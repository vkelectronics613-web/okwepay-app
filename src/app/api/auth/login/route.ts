import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { login } from '@/lib/auth';
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { email },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== merchant.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await login(merchant.id);

    return NextResponse.json({ message: 'Login successful', merchantId: merchant.id }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
