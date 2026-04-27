import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const secretKey = authHeader.split(' ')[1];

    const apiKey = await prisma.apiKey.findUnique({
      where: { secret_key: secretKey },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { payment_id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.merchant_id !== apiKey.merchant_id) {
      return NextResponse.json({ error: 'Unauthorized access to payment' }, { status: 403 });
    }

    return NextResponse.json({
      payment_id: payment.payment_id,
      status: payment.status,
      amount: payment.amount,
      created_at: payment.created_at
    }, { status: 200 });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
