/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, AuthError, JWTPayload } from './auth';
import connectDB from '../db/mongo';
import User from '../../models/User';


export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * **use example**:
```ts
// app/api/protected-route/route.ts
export const GET = withAuth(async (req) => {
  // req.user is now available
  console.log('Authenticated user:', req.user);

  return NextResponse.json({
    message: 'Protected data',
    user: req.user
  });
});
```
 */
export const withAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Connect to database
      await connectDB();

      // Extract and verify token
      const authHeader = req.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);
      const payload: JWTPayload = verifyToken(token);

      // Verify user still exists
      const user = await User.findById(payload.userId);
      if (!user) {
        throw new AuthError('User not found');
      }

      // Add user to request
      (req as AuthenticatedRequest).user = {
        id: user._id.toString(),
        email: user.email,
      };

      return await handler(req as AuthenticatedRequest);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
};

// Alternative middleware for API routes that don't need strict auth
export const optionalAuth = async (req: NextRequest): Promise<JWTPayload | null> => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;

    const token = extractTokenFromHeader(authHeader);
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};
