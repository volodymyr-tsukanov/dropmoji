/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import mongoose, { Document, Schema } from 'mongoose';


export interface IMessage extends Document {
  content: string;
  creator: mongoose.Types.ObjectId;
  viewToken: string;
  expiresAt: Date;
  viewedAt?: Date;
  response?: string;
  createdAt: Date;
}


const MessageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  viewToken: {
    type: String,
    required: [true, 'View token is required'],
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
  },
  viewedAt: {
    type: Date,
    default: null
  },
  response: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Automatically delete expired messages (TTL index)
//MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
