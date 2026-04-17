import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { calculateNutritionPlan } from '@/lib/core-engine';

export async function POST(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace('Bearer ', '');
  const verified = verifyToken(token);
  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const gender = String(payload.gender || 'male') as 'male' | 'female';
  const age = Number(payload.age);
  const weight = Number(payload.weight);
  const height = Number(payload.height);
  const bodyFat = payload.bodyFat ? Number(payload.bodyFat) : undefined;
  const goal = String(payload.goal) as 'fat loss' | 'muscle gain' | 'recomposition';
  const activity = String(payload.activity) as 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete';
  const trainingExperience = String(payload.trainingExperience || 'beginner');
  const trainingFrequency = Number(payload.trainingFrequency);
  const eatingPreference = String(payload.eatingPreference || '3 meals');
  const dietaryRestrictions = String(payload.dietaryRestrictions || '');

  if (!age || !weight || !height || !goal || !activity || !trainingFrequency) {
    return NextResponse.json({ error: 'Missing onboarding details.' }, { status: 400 });
  }

  const plan = calculateNutritionPlan({
    gender,
    age,
    weight,
    height,
    goal,
    activityLevel: activity,
    trainingFrequency,
    bodyFat,
  });

  const user = await prisma.user.update({
    where: { id: verified.userId },
    data: {
      gender,
      age,
      weight,
      height,
      bodyFat,
      goal,
      activityLevel: activity,
      trainingExperience,
      trainingFrequency,
      eatingPreference,
      dietaryRestrictions,
      calories: plan.calories,
      protein: plan.protein,
      carbs: plan.carbs,
      fat: plan.fat,
    },
  });

  await prisma.onboarding.create({
    data: {
      userId: verified.userId,
      gender,
      age,
      weight,
      height,
      bodyFat,
      goal,
      activityLevel: activity,
      trainingExperience,
      trainingFrequency,
      eatingPreference,
      dietaryRestrictions,
      calories: plan.calories,
      protein: plan.protein,
      carbs: plan.carbs,
      fat: plan.fat,
    },
  });

  return NextResponse.json({ user, plan });
}
