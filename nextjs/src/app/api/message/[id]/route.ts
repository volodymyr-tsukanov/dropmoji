/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from 'next/server';
import { extendToken, verifyRequest } from '@/lib/sec/auth';
import Message from '@/models/Message';
import connectDB from '@/lib/db/mongo';
import { config } from '@/lib/config';


interface RouteParams {
  params: Promise<{ id: string }>;
}


/** View specific message (creator only) */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const payload = verifyRequest(req);
    if (payload instanceof NextResponse) return payload;

    const { id } = await params;
    await connectDB();
    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    // Only creator can view via this endpoint
    if (message.creator.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        response: message.response,
        viewedAt: message.viewedAt,
        expiresAt: message.expiresAt,
        createdAt: message.createdAt,
        shareUrl: `${config.app.url}/message/${message.viewToken}`,
      }
    });
  } catch (err) {
    console.error('GET message error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

/** Update message (creator only) */
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const payload = verifyRequest(req);
    if (payload instanceof NextResponse) return payload;

    const { content, expiresIn } = await req.json();

    const { id } = await params;
    await connectDB();
    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    // Only creator can update
    if (message.creator.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }
    // Can't update if already viewed
    if (message.viewedAt) {
      return NextResponse.json(
        { success: false, error: 'Cannot update viewed message' },
        { status: 400 }
      );
    }
    // Update content if provided
    if (content) {
      if (!content.type || !content.data || !['emoji', 'gif'].includes(content.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid content format' },
          { status: 400 }
        );
      }
      message.content = content;
    }
    // Update expiration if provided
    if (expiresIn) {
      const hours = parseInt(expiresIn);
      if (hours > 0 && hours <= 168) {
        message.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      }
    }
    await message.save();

    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        expiresAt: message.expiresAt,
        updatedAt: new Date(),
      }
    });
  } catch (err) {
    console.error('PUT message error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

/** Delete message (creator only) */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const payload = verifyRequest(req);
    if (payload instanceof NextResponse) return payload;

    const { id } = await params;
    await connectDB();
    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    // Only creator can delete
    if (message.creator.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }
    await Message.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
      newToken: extendToken(payload?.token ?? '')
    });
  } catch (err) {
    console.error('DELETE message error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
