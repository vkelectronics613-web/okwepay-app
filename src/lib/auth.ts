import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as Record<string, unknown>;
}

export async function login(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ userId, expires: expires.getTime() });

  const c = await cookies();
  c.set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  const c = await cookies();
  c.set('session', '', { expires: new Date(0) });
}

export async function getSession(): Promise<{ userId: string; expires: number } | null> {
  const c = await cookies();
  const session = c.get('session')?.value;
  if (!session) return null;
  try {
    const payload = await decrypt(session);
    return payload as unknown as { userId: string; expires: number };
  } catch {
    return null;
  }
}
