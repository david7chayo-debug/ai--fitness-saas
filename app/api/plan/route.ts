import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { generatePersonalizedPlan } from '@/lib/plan';

export async function POST(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace('Bearer ', '');
  const verified = verifyToken(token);
  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: verified.userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const requiredKeys = [
    user.gender,
    user.age,
    user.height,
    user.weight,
    user.goal,
    user.activityLevel,
    user.trainingFrequency,
    user.eatingPreference,
  ];

  if (requiredKeys.some((value) => value === null || value === undefined || value === '')) {
    return NextResponse.json({ error: 'Please complete onboarding before generating a plan.' }, { status: 400 });
  }

  const premium = user.planType === 'premium';
  const planData = generatePersonalizedPlan({
    gender: user.gender as 'male' | 'female',
    age: user.age as number,
    height: user.height as number,
    weight: user.weight as number,
    bodyFat: user.bodyFat ?? undefined,
    goal: user.goal as 'fat loss' | 'muscle gain' | 'recomposition',
    activityLevel: user.activityLevel as 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete',
    trainingExperience: (user.trainingExperience as 'beginner' | 'intermediate' | 'advanced') ?? 'beginner',
    trainingFrequency: user.trainingFrequency as number,
    eatingPreference: user.eatingPreference as '3 meals' | '4 meals' | 'intermittent fasting',
    dietaryRestrictions: user.dietaryRestrictions || '',
    premium,
  });

  const plan = await prisma.plan.create({
    data: {
      userId: user.id,
      calories: planData.calories,
      protein: planData.protein,
      carbs: planData.carbs,
      fat: planData.fat,
      meals: planData.meals,
      trainingSplit: planData.trainingSplit,
      shoppingList: planData.shoppingList,
      explanation: planData.explanation,
      goal: user.goal,
      eatingPreference: user.eatingPreference,
    },
  });

  return NextResponse.json({ plan: { ...planData, generatedAt: plan.generatedAt, planType: user.planType } });
}
