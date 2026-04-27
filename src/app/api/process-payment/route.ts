import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { payment_id, upi_id } = await req.json();

    if (!payment_id || !upi_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // NUCLEAR FIX: Use character codes to match the new handle format
    const suffix = String.fromCharCode(46) + "owb";
    if (!upi_id.endsWith(suffix)) {
      return NextResponse.json({ error: `Invalid UPI ID. Must end with ${suffix}` }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { payment_id },
      include: { merchant: true }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status === 'success') {
      return NextResponse.json({ error: 'Payment already successful' }, { status: 400 });
    }

    // Call okwebank gateway API
    const gatewaySecret = process.env.GATEWAY_SECRET || 'super-secret-gateway-key-12345';
    const BANK_API_URL = process.env.BANK_API_URL || 'https://okwebank.vercel.app';
    
    const bankRes = await fetch(`${BANK_API_URL}/api/gateway/process-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewaySecret}`
      },
      body: JSON.stringify({
        from_upi: upi_id,
        amount: payment.amount
      })
    });

    const bankData = await bankRes.json();

    if (!bankRes.ok || !bankData.success) {
      return NextResponse.json({ error: bankData.error || 'Payment failed at bank' }, { status: 400 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { payment_id },
      data: { status: 'success' },
    });

    // Fire webhook asynchronously if merchant has one configured
    if (payment.merchant.webhook_url) {
      fetch(payment.merchant.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: updatedPayment.payment_id,
          amount: updatedPayment.amount,
          status: updatedPayment.status,
          created_at: updatedPayment.created_at,
        })
      }).catch(err => console.error('Failed to trigger webhook:', err));
    }

    return NextResponse.json({ success: true, payment: updatedPayment }, { status: 200 });
  } catch (error) {
    console.error('Process payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
