import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payout_upi } = await req.json();

    if (!payout_upi || !payout_upi.endsWith('.owb')) {
      return NextResponse.json({ error: 'Invalid .owb handle' }, { status: 400 });
    }

    await prisma.merchant.update({
      where: { id: session.userId },
      data: { payout_upi },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to link account' }, { status: 500 });
  }
}
