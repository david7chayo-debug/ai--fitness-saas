import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace('Bearer ', '');
  const verified = verifyToken(token);

  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    select: {
      email: true,
      name: true,
      gender: true,
      age: true,
      weight: true,
      height: true,
      bodyFat: true,
      activityLevel: true,
      goal: true,
      trainingExperience: true,
      trainingFrequency: true,
      eatingPreference: true,
      dietaryRestrictions: true,
      walletAddress: true,
      planType: true,
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
