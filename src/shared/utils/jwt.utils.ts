import * as jwt from 'jsonwebtoken';

export function generateToken(payload: any): string {
  const secretKey = process.env.JWT_SECRET || 'quiz-backend';
  const expiresIn = '1h';

  return jwt.sign(payload, secretKey, { expiresIn });
}