/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use server'
import connectDB from '@/lib/db/mongo';
import User from '@/models/User';
import { generateToken, createAuthResponse, AuthResponse, AuthRequest, verifyToken, extendToken } from '@/lib/sec/auth';


const uniformErrorResponse = 'Invalid credentials';


/** @returns _null_=ok | _string_=error message */
function validateCredentials(email: string, password: string): string | null {
  if (!email || !password) return 'Email and password are required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
  if (false) {
    //email validation
  }
}

export async function ARegister(req: AuthRequest): Promise<AuthResponse | string> {
  try {
    await connectDB();
    const { email, password } = req;

    // Validation
    const validationError = validateCredentials(email, password);
    if (validationError !== null) {
      return validationError;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return 'User already exists with this email';
    }

    // Create new user
    const user = new User({
      email: email.trim().toLowerCase(),
      password,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    return createAuthResponse(user, token);
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      console.error(firstError.message);
      return uniformErrorResponse;
    }

    return 'Registration failed';
  }
}

export async function ALogin(req: AuthRequest): Promise<AuthResponse | string> {
  try {
    await connectDB();
    const { email, password } = req;

    // Validation
    const validationError = validateCredentials(email, password);
    if (validationError !== null) {
      return validationError;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return uniformErrorResponse;
    }
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return uniformErrorResponse;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    return createAuthResponse(user, token);
  } catch (error: any) {
    console.error('Login error:', error);
    return 'Login failed';
  }
}

export async function AExtendSession(actualToken: string): Promise<string | null> {
  try {
    if (!actualToken || actualToken.length < 9) {
      return null;
    }
    return extendToken(actualToken);
  } catch (err: any) {
    console.error('ExtendSession error: ', err);
    return null;
  }
}
