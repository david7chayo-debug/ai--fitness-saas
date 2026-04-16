import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateMacros,
  generateWorkoutPlan,
  generateNutritionPlan,
  generateShoppingList,
  type ActivityLevel,
  type FitnessGoal,
  type Gender,
} from "@/lib/core-engine";
import { generatePlanExplanation } from "@/lib/ai";
import type { UserContext } from "@/lib/system-prompt";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user?.isActive) {
    return NextResponse.json(
      { error: "Active subscription required" },
      { status: 403 }
    );
  }

  const onboarding = await prisma.onboarding.findUnique({
    where: { userId: session.sub },
  });
  if (!onboarding) {
    return NextResponse.json(
      { error: "Complete onboarding first" },
      { status: 400 }
    );
  }

  // Deactivate existing plans
  await prisma.plan.updateMany({
    where: { userId: session.sub, isActive: true },
    data: { isActive: false },
  });

  const checkInCount = await prisma.checkIn.count({ where: { userId: session.sub } });
  const weekNumber = checkInCount + 1;

  // Core Engine: pure math
  const metrics = {
    weightKg: onboarding.weightKg,
    heightCm: onboarding.heightCm,
    age: onboarding.age,
    gender: onboarding.gender as Gender,
    activityLevel: onboarding.activityLevel as ActivityLevel,
    bodyFatPct: onboarding.bodyFatPct ?? undefined,
  };

  const macros = calculateMacros(metrics, onboarding.goal as FitnessGoal);
  const workoutPlan = generateWorkoutPlan(
    onboarding.goal as FitnessGoal,
    onboarding.activityLevel as ActivityLevel
  );
  const nutritionPlan = generateNutritionPlan(macros, onboarding.goal as FitnessGoal);
  const shoppingList = generateShoppingList(onboarding.goal as FitnessGoal);

  // LLM: only for explanation
  const userCtx: UserContext = {
    name: user.name ?? undefined,
    language: user.language,
    goal: onboarding.goal,
    weightKg: onboarding.weightKg,
    macros,
    weekNumber,
  };

  const explanation = await generatePlanExplanation(userCtx, workoutPlan);

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);

  const plan = await prisma.plan.create({
    data: {
      userId: session.sub,
      weekNumber,
      calories: macros.calories,
      proteinG: macros.proteinG,
      carbsG: macros.carbsG,
      fatG: macros.fatG,
      tdee: macros.tdee,
      bmr: macros.bmr,
      nutritionPlan: nutritionPlan as unknown as object,
      workoutPlan: workoutPlan as unknown as object,
      shoppingList: shoppingList as unknown as object,
      explanation,
      validUntil,
    },
  });

  return NextResponse.json({ plan });
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await prisma.plan.findFirst({
    where: { userId: session.sub, isActive: true },
    orderBy: { generatedAt: "desc" },
  });

  return NextResponse.json({ plan });
}
