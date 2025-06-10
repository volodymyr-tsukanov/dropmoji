/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import crypto from "node:crypto";
import { IMessage } from "@/models/Message";


const SALT_FIXED = 's0l!';
const SEPARATOR_CONTENT = '?';
export const PREFIX_CRYPTED = 'e';


/** @returns **viewToken** */
export function encryptMessage(message: IMessage): string {
  const vtoken = crypto.randomBytes(32).toString('base64url');
  message.viewToken = crypto.createHash('sha256').update(vtoken).digest('hex');

  const key = crypto.scryptSync(vtoken, SALT_FIXED, 32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encryptedContent = Buffer.concat([cipher.update(message.content, 'utf-8'), cipher.final()]);
  const authTag = cipher.getAuthTag().toString('hex');
  message.content = [encryptedContent.toString('base64'), authTag, iv.toString('base64')].join(SEPARATOR_CONTENT);

  return PREFIX_CRYPTED + vtoken;
}

export function procMessageViewToken(vtoken: string): string {
  if (vtoken.startsWith(PREFIX_CRYPTED)) return crypto.createHash('sha256').update(vtoken.substring(1)).digest('hex');
  else return vtoken;
}
export function decryptMessageContent(encryptedContent: string, vtoken: string): string {
  if (!vtoken.startsWith(PREFIX_CRYPTED)) throw Error('invalid vtoken');
  vtoken = vtoken.substring(1);
  const phases = encryptedContent.split(SEPARATOR_CONTENT);
  if (phases.length !== 3) throw Error('invalid content');
  const iv = Buffer.from(phases[2], 'base64');
  const authTag = Buffer.from(phases[1], 'hex');
  const key = crypto.scryptSync(vtoken, SALT_FIXED, 32);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(phases[0], 'base64', 'utf-8') + decipher.final('utf-8');
}
