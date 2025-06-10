/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IAuthResponse } from '../consts';
import { NextRequest, NextResponse } from 'next/server';


export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
  token?: string;
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}


export const generateToken = (userId: string, email: string): string => {
  try {
    return jwt.sign(
      { userId, email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  } catch (error) {
    throw new AuthError('Failed to generate token', 500);
  }
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Invalid token');
    }
    throw new AuthError('Token verification failed');
  }
};

export const extendToken = (oldToken: string): string | null => {
  try {
    const payload = verifyToken(oldToken);
    const currentTime = Date.now() / 1000;
    const issuedAt = payload.iat;

    if (!issuedAt)
      return null;
    else if (currentTime < issuedAt) {
      console.warn(`Time Traweller spotted ${new Date(issuedAt)}`);
      return null;
    } else if (currentTime - issuedAt > config.jwt.extendLimit) {
      console.log('too old to extend', currentTime - issuedAt);
      return null;
    }
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        iat: issuedAt,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  } catch (error) {
    console.error(error);
    throw new AuthError('Failed to extend token', 500);
  }
}


export const extractTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader)
    return null;
  if (!authHeader.startsWith('Bearer '))
    return null;

  const token = authHeader.substring(7);
  if (!token || token.length < 9)
    return null;
  return token;
};

export function createAuthResponse(user: any, token: string): IAuthResponse {
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    },
    token,
    expiresIn: config.jwt.expiresIn,
  };
}

export function verifyRequest(req: NextRequest): NextResponse | JWTPayload {
  try {
    const token = extractTokenFromHeader(req.headers.get('Auth'));
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    return { ...verifyToken(token), token };
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    else throw err;
  }
}
