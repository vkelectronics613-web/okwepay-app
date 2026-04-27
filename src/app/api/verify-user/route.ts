import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { upi_id } = await req.json();

    const suffix = String.fromCharCode(46) + "owb";
    if (!upi_id || !upi_id.endsWith(suffix)) {
      return NextResponse.json({ error: `Invalid UPI ID. Must end with ${suffix}` }, { status: 400 });
    }

    const gatewaySecret = process.env.GATEWAY_SECRET || 'super-secret-gateway-key-12345';
    const BANK_API_URL = process.env.BANK_API_URL || 'https://okwebank.vercel.app';
    const bankRes = await fetch(`${BANK_API_URL}/api/gateway/verify-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewaySecret}`
      },
      body: JSON.stringify({ upi_id })
    });

    const bankData = await bankRes.json();

    if (!bankRes.ok || !bankData.success) {
      return NextResponse.json({ error: bankData.error || 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: bankData.user }, { status: 200 });
  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
