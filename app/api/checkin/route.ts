import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { calculateNutritionPlan, adjustCaloriesForCheckin } from '@/lib/core-engine';

export async function POST(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace('Bearer ', '');
  const verified = verifyToken(token);
  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const rating = Math.min(Math.max(Number(payload.rating) || 3, 1), 5);
  const comment = String(payload.comment || '');
  const weight = payload.weight ? Number(payload.weight) : undefined;

  const user = await prisma.user.findUnique({ where: { id: verified.userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updatedUser = weight
    ? await prisma.user.update({ where: { id: verified.userId }, data: { weight } })
    : user;

  const checkin = await prisma.checkin.create({
    data: {
      userId: verified.userId,
      rating,
      comment,
      calories: updatedUser.calories,
      weight,
    },
  });

  if (updatedUser.planType !== 'premium') {
    return NextResponse.json({ message: 'Check-in saved. Upgrade to premium for automatic weekly recalibration.', checkin });
  }

  if (!updatedUser.goal || !updatedUser.activityLevel || !updatedUser.trainingFrequency || !updatedUser.gender || !updatedUser.age || !updatedUser.height || !updatedUser.weight) {
    return NextResponse.json({ message: 'Check-in saved, but premium recalibration requires completed onboarding.', checkin });
  }

  const profile = {
    gender: updatedUser.gender as 'male' | 'female',
    age: updatedUser.age,
    weight: updatedUser.weight,
    height: updatedUser.height,
    goal: updatedUser.goal as 'fat loss' | 'muscle gain' | 'recomposition',
    activityLevel: updatedUser.activityLevel as 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete',
    trainingFrequency: updatedUser.trainingFrequency,
    bodyFat: updatedUser.bodyFat ?? undefined,
  };

  const target = calculateNutritionPlan(profile);
  const recalculatedCalories = adjustCaloriesForCheckin(target.calories, profile.goal, rating);
  const recalculatedMacros = calculateNutritionPlan(profile);

  await prisma.user.update({
    where: { id: verified.userId },
    data: {
      calories: recalculatedCalories,
      protein: recalculatedMacros.protein,
      carbs: recalculatedMacros.carbs,
      fat: recalculatedMacros.fat,
    },
  });

  return NextResponse.json({
    message: 'Premium check-in saved and weekly target refreshed.',
    checkin,
    adjustedCalories: recalculatedCalories,
    macros: {
      protein: recalculatedMacros.protein,
      carbs: recalculatedMacros.carbs,
      fat: recalculatedMacros.fat,
    },
  });
}
