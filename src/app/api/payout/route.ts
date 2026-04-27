import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();

    const merchant = await prisma.merchant.findUnique({
      where: { id: session.userId },
      include: { payouts: true, payments: true }
    });

    if (!merchant || !merchant.payout_upi) {
      return NextResponse.json({ error: 'Please link your .owb handle first' }, { status: 400 });
    }

    // Calculate available balance
    const totalEarned = merchant.payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0);
    
    const totalPaidOut = merchant.payouts
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0);

    const available = totalEarned - totalPaidOut;

    if (amount > available || amount <= 0) {
      return NextResponse.json({ error: 'Insufficient balance for withdrawal' }, { status: 400 });
    }

    // Call Bank Settle API
    const GATEWAY_SECRET = process.env.GATEWAY_SECRET || 'super-secret-gateway-key-12345';
    const BANK_API_URL = process.env.BANK_API_URL || 'https://okwebank.vercel.app';

    const bankRes = await fetch(`${BANK_API_URL}/api/gateway/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_SECRET}`
      },
      body: JSON.stringify({
        to_upi: merchant.payout_upi,
        amount: amount
      })
    });

    const bankData = await bankRes.json();

    if (bankRes.ok && bankData.success) {
        // Record payout in gateway DB
        await prisma.payout.create({
            data: {
                merchant_id: merchant.id,
                amount: amount,
                status: 'success'
            }
        });
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ error: bankData.error || 'Bank transfer failed' }, { status: 400 });
    }

  } catch (error) {
    console.error('Payout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
