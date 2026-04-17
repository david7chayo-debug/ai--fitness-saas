import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function createMockTxHash() {
  return `0x${crypto.randomUUID().replace(/-/g, '').slice(0, 40)}`;
}

function mockVerifyCryptoPayment(txHash: string) {
  return txHash.startsWith('0x') && txHash.length >= 10 ? 'confirmed' : 'pending';
}

export async function POST(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace('Bearer ', '');
  const verified = verifyToken(token);

  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const amount = Number(payload.amount || 0);
  const currency = String(payload.currency || 'USDT').toUpperCase();
  const walletAddress = String(payload.walletAddress || '').trim();
  const txHash = String(payload.txHash || createMockTxHash());

  if (amount <= 0) {
    return NextResponse.json({ error: 'Invalid payment amount.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: verified.userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const status = mockVerifyCryptoPayment(txHash);

  const payment = await prisma.payment.create({
    data: {
      userId: verified.userId,
      amount,
      currency,
      txHash,
      status,
    },
  });

  if (user.planType !== 'premium' && status === 'confirmed') {
    await prisma.user.update({
      where: { id: verified.userId },
      data: {
        planType: 'premium',
        walletAddress: walletAddress || user.walletAddress,
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: status === 'confirmed'
      ? `Mock ${currency} payment for ${amount.toFixed(2)} confirmed. Your account is now premium.`
      : `Mock ${currency} payment for ${amount.toFixed(2)} is pending confirmation.`,
    payment,
    status,
  });
}
