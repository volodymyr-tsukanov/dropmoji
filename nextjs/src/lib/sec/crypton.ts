/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import crypto from "node:crypto";
import { IMessage } from "@/models/Message";
import { Primero } from "../consts";


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


export const insecureViewToken = (parts: number): string => {
  const NOUNS = [
    'coffee', 'tea', 'beer', 'cocktail', 'wine', 'smoothie', 'juice', 'cider', 'mead', 'margarita', 'mojito', 'martini', 'mimosa', 'rum', 'gin', 'vodka', 'whiskey',
    'bear', 'monkey', 'tiger', 'panda', 'dog', 'cat', 'pig', 'zebra', 'lion', 'wolf', 'elephant', 'turtle', 'dolphin', 'okapi', 'quokka', 'platypus', 'tapir', 'ibex', 'lemur', 'olm', 'markhor', 'fossa', 'manatee', 'numbat', 'axolotl', 'quetzal', 'meerkat', 'dakka', 'orangutan', 'langur', 'tapir',
    'moon', 'light', 'sun', 'water', 'fire', 'wind', 'sea', 'star', 'comet', 'nebula', 'planet',
    'knight', 'king', 'queen', 'fate', 'monk', 'virgin', 'bard', 'jester', 'bastard', 'court', 'archer', 'guardian', 'warden', 'castle', 'crown',
    'zombie', 'vampire', 'elf', 'gnome', 'orc', 'mage', 'dragon', 'witch', 'werewolf', 'boggart', 'chimera', 'dementor', 'griffon', 'hydra', 'krampus', 'mermaid', 'phoenix', 'selkie', 'cerberus',
    'buzz', 'rizz', 'kiss', 'skibidi', 'poo', 'hug', 'smile', 'junkie', 'bum', 'ass', 'punk',  //!INAPPROPRIATE
    'alex', 'zara', 'jordan', 'yamada', 'li', 'patricia', 'mario', 'sofia', 'gunnar', 'zola', 'ocean', 'pavel', 'afia', 'daria', 'saif', 'mix', 'nava', 'krum', 'vihaan', 'oscar', 'avery', 'hanna', 'lev', 'katarina'
  ]; const nLng = NOUNS.length;
  const ADJECTIVES = [
    'good', 'bad', 'ugly', 'creepy', 'gorgeous', 'horrifying', 'magical', 'agile',
    'holy', 'penitent', 'tragic', 'ecstatic', 'melancholic', 'bloody',
    'dancing', 'drawing', 'dying', 'laughing', 'crying',
    'goofy', 'yapping', 'silly', 'loyal', 'brave', 'celestial', 'horny', 'popular', 'funky' //!INAPPROPRIATE
  ]; const aLng = ADJECTIVES.length;
  const CONCATS = [
    '.', '+', '=', ':', '@', '!', '$', ',', ';', '%', '*'
  ]; const cLng = CONCATS.length;

  const prm = new Primero();
  const n = crypto.randomInt(999_999_999);
  const adjConcat = n % 2 == 0 ? '-' : '_';

  let vtoken = NOUNS[n % nLng];
  while (--parts > 0) {
    const r = Math.floor(Math.random() * nLng);
    const do5050 = r % 2 == 0;
    const doConcat = r % 29 != 0;
    if (doConcat) vtoken += CONCATS[r % cLng];
    if (r % prm.next() == 0) {
      const num = r % 5 == 0 ? (10 + (n - r) % 100) : r % 100;
      vtoken += num.toFixed(0);
    } else {
      const rn = Math.abs(r + n);
      if (doConcat && do5050) {
        vtoken += ADJECTIVES[rn % aLng];
        if (r % 5 != 0) vtoken += adjConcat;
      }
      if (n % r == 0) {
        if (do5050) vtoken += '(' + NOUNS[r] + ')';
        else vtoken += '[' + NOUNS[r] + ']';
      } else {
        vtoken += NOUNS[r];
      }
    }
    if (!doConcat && do5050) vtoken += CONCATS[r % cLng];
  }
  return vtoken;
};
function _testCollisions(count: number, parts: number) {
  const tokenMap = new Map<string, boolean>();
  let collisionCount = 0;

  for (let i = 1; i <= count; i++) {
    const token = insecureViewToken(parts);
    if (tokenMap.has(token)) {
      console.log(`${i}: ${token}`);
      collisionCount++;
    } else {
      tokenMap.set(token, true);
    }
  }

  const collisionPercentage = (collisionCount / count) * 100;
  console.log(`Test completed. Collision count: ${collisionCount} (${collisionPercentage.toFixed(2)}%)`);
}
