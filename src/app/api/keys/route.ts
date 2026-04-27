import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const publicKey = `pk_test_${uuidv4().replace(/-/g, '')}`;
    const secretKey = `sk_test_${uuidv4().replace(/-/g, '')}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        merchant_id: session.userId as string,
        public_key: publicKey,
        secret_key: secretKey,
      },
    });

    return NextResponse.json(apiKey, { status: 201 });
  } catch (error) {
    console.error('Error generating API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
