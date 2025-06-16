/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from 'next/server';
import Message, { IMessage } from '@/models/Message';
import connectDB from '@/lib/db/mongo';
import { decryptMessageContent, PREFIX_CRYPTED, procMessageViewToken } from '@/lib/sec/crypton';


interface RouteParams {
  params: Promise<{ vtoken: string }>;
}


/** View specific message (via viewToken) */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { vtoken } = await params;
    if (!vtoken || vtoken.length < 4) {
      return NextResponse.json(
        { success: false, error: 'ViewToken is invalid' },
        { status: 401 }
      );
    }

    await connectDB();
    const message = await Message.findOne({ viewToken: procMessageViewToken(vtoken) }) as IMessage;
    const now = new Date();

    if (!message || message.viewedAt || now > message.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    message.viewedAt = now;
    await message.save();

    let messageContent = message.content;
    if (vtoken.startsWith(PREFIX_CRYPTED)) {
      try {
        messageContent = decryptMessageContent(messageContent, vtoken);
      } catch (err) {
        console.error(err);
        return NextResponse.json(
          { success: false, error: 'Message appears to be invalid' },
          { status: 402 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        content: messageContent,
        expiresAt: message.expiresAt,
        createdAt: message.createdAt
      }
    });
  } catch (err) {
    console.error('view message error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

/** Respond to specific message (via viewToken) */
export async function POST(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { response2Msg } = await req.json();
    if (typeof response2Msg !== 'string' || response2Msg.length > 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid emoji response' },
        { status: 400 }
      );
    }

    const { vtoken } = await params;
    if (!vtoken || vtoken.length < 9) {
      return NextResponse.json(
        { success: false, error: 'ViewToken is invalid' },
        { status: 401 }
      );
    }
    await connectDB();
    const message = await Message.findOne({ viewToken: procMessageViewToken(vtoken) }) as IMessage;
    const now = new Date();

    if (!message || !message.viewedAt || now > message.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    message.response = response2Msg;
    await message.save();

    return NextResponse.json({
      success: true,
      message: `Responded with ${response2Msg}`
    });
  } catch (err) {
    console.error('view message error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
