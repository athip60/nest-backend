import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

if (!privateKey || !publicKey) {
  throw new Error('Private or Public Key is missing or invalid');
}
export async function generateToken(payload: object): Promise<string> {
  const expiresIn = '1h';
  return jwt.sign(payload, privateKey, { expiresIn, algorithm: 'RS256' });
}

export function verifyToken(token: string): string | object {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}
