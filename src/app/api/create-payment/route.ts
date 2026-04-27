import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const secretKey = authHeader.split(' ')[1];

    const apiKey = await prisma.apiKey.findUnique({
      where: { secret_key: secretKey },
      include: { merchant: true }
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        merchant_id: apiKey.merchant_id,
        amount,
        status: 'created',
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    
    return NextResponse.json({
      payment_id: payment.payment_id,
      checkout_url: `${baseUrl}/pay/${payment.payment_id}`
    }, { status: 201 });

  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
