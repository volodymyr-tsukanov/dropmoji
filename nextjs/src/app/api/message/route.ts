/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/sec/auth';
import Message, { IMessage } from '@/models/Message';
import { config } from '@/lib/config';
import connectDB from '@/lib/db/mongo';
import { encryptMessage, insecureViewToken, PREFIX_CRYPTED } from '@/lib/sec/crypton';


/** List user's messages (Auth) */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = verifyRequest(req);
    if (payload instanceof NextResponse) return payload;
    else {
      await connectDB();
      const messages = await Message.find({ creator: payload.userId }) as IMessage[];
      // Filter Messages
      messages.forEach((msg) => {
        if (msg.viewToken.startsWith(PREFIX_CRYPTED)) msg.viewToken = '-';
      });
      return NextResponse.json({
        success: true,
        messages: messages
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/** Create new message (Auth) */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = verifyRequest(req);
    if (payload instanceof NextResponse) return payload;

    const { content, expiresIn, secrecy } = await req.json();

    // Validation
    if (!content || content.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Content is invalid' },
        { status: 401 }
      );
    }
    // Calculate expiration
    let expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days default
    if (expiresIn) {
      const hours = parseInt(expiresIn);
      if (hours > 0 && hours <= 168) { // Max 7 days
        expiresAt = new Date(Date.now() + hours * 1000 * 60 * 60);
      }
    }
    // Create Message
    await connectDB();
    const message = new Message({
      content: JSON.stringify(content),
      creator: payload.userId,
      viewToken: 'placeholder',
      expiresAt: expiresAt,
    });
    let vtoken: string;
    if (secrecy) {  //use crypton
      vtoken = encryptMessage(message);
    } else {
      let parts = 2;
      do {
        vtoken = insecureViewToken(parts);
        const msgCollision = await Message.findOne({ viewToken: vtoken });
        if (!msgCollision) {
          parts = 0;
          break;
        } else console.warn(`create new msg: vtoken collision ${parts}`);
        parts += 1;
      } while (parts > 0);
      message.viewToken = vtoken;
    }
    await message.save();

    // Return message with share link
    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        shareUrl: `${config.app.url}/view/${vtoken}`,
        expiresAt: message.expiresAt,
        createdAt: message.createdAt,
      }
    }, { status: 200 });
  } catch (err) {
    console.error('create new msg:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
