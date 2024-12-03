import * as jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'quiz-backend';

export async function generateToken(payload: object): Promise<string> {
  const expiresIn = '1h';
  return jwt.sign(payload, secretKey, { expiresIn, algorithm: 'HS256' });
}

export function verifyToken(token: string): string {
  return jwt.verify(token, secretKey, { algorithm: 'RS256' });
}
