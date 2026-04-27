import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingMerchant = await prisma.merchant.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingMerchant) {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 400 });
    }

    const password_hash = hashPassword(password);

    const merchant = await prisma.merchant.create({
      data: {
        name,
        email: normalizedEmail,
        password_hash,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Merchant registration error:', error);
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Email already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
