import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 2,
    parallelism: 2,
  });
}

export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  return await argon2.verify(hashedPassword, plainPassword);
}
