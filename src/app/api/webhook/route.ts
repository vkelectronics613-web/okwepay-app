import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { webhook_url } = await req.json();

    const merchant = await prisma.merchant.update({
      where: { id: session.userId as string },
      data: { webhook_url },
    });

    return NextResponse.json({ success: true, webhook_url: merchant.webhook_url }, { status: 200 });
  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
