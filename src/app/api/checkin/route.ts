import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  weeklyAdjustment,
  calculateMacros,
  generateWorkoutPlan,
  generateNutritionPlan,
  generateShoppingList,
  type ActivityLevel,
  type FitnessGoal,
  type Gender,
  type MacroTargets,
} from "@/lib/core-engine";
import { generateCheckInResponse } from "@/lib/ai";
import type { UserContext } from "@/lib/system-prompt";

const schema = z.object({
  weightKg: z.number().min(30).max(300),
  adherencePct: z.number().min(0).max(100),
  notes: z.string().max(1000).optional(),
  mood: z.number().min(1).max(5).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user?.isActive) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  const onboarding = await prisma.onboarding.findUnique({
    where: { userId: session.sub },
  });
  if (!onboarding) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const currentPlan = await prisma.plan.findFirst({
      where: { userId: session.sub, isActive: true },
      orderBy: { generatedAt: "desc" },
    });

    const weekNumber = currentPlan ? currentPlan.weekNumber : 1;
    const previousWeight = currentPlan
      ? (await prisma.checkIn.findFirst({
          where: { userId: session.sub },
          orderBy: { createdAt: "desc" },
        }))?.weightKg ?? onboarding.weightKg
      : onboarding.weightKg;

    const currentMacros: MacroTargets = currentPlan
      ? {
          calories: currentPlan.calories,
          proteinG: currentPlan.proteinG,
          carbsG: currentPlan.carbsG,
          fatG: currentPlan.fatG,
          bmr: currentPlan.bmr,
          tdee: currentPlan.tdee,
        }
      : calculateMacros(
          {
            weightKg: onboarding.weightKg,
            heightCm: onboarding.heightCm,
            age: onboarding.age,
            gender: onboarding.gender as Gender,
            activityLevel: onboarding.activityLevel as ActivityLevel,
            bodyFatPct: onboarding.bodyFatPct ?? undefined,
          },
          onboarding.goal as FitnessGoal
        );

    // Core Engine: calculate adjustment
    const adjustment = weeklyAdjustment(
      currentMacros,
      {
        currentWeightKg: data.weightKg,
        previousWeightKg: previousWeight,
        adherencePct: data.adherencePct,
        weekNumber,
      },
      onboarding.goal as FitnessGoal
    );

    // Save check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: session.sub,
        weekNumber,
        weightKg: data.weightKg,
        adherencePct: data.adherencePct,
        notes: data.notes,
        mood: data.mood,
        adjustment: adjustment as unknown as object,
      },
    });

    // Generate new plan with adjusted macros
    const newMetrics = {
      weightKg: data.weightKg,
      heightCm: onboarding.heightCm,
      age: onboarding.age,
      gender: onboarding.gender as Gender,
      activityLevel: onboarding.activityLevel as ActivityLevel,
      bodyFatPct: onboarding.bodyFatPct ?? undefined,
    };

    const newMacros: MacroTargets = {
      calories: adjustment.newCalories,
      proteinG: adjustment.newProteinG,
      carbsG: adjustment.newCarbsG,
      fatG: adjustment.newFatG,
      bmr: currentMacros.bmr,
      tdee: currentMacros.tdee,
    };

    const workoutPlan = generateWorkoutPlan(
      onboarding.goal as FitnessGoal,
      onboarding.activityLevel as ActivityLevel
    );
    const nutritionPlan = generateNutritionPlan(newMacros, onboarding.goal as FitnessGoal);
    const shoppingList = generateShoppingList(onboarding.goal as FitnessGoal);

    const userCtx: UserContext = {
      name: user.name ?? undefined,
      language: user.language,
      goal: onboarding.goal,
      weightKg: data.weightKg,
      macros: newMacros,
      weekNumber: weekNumber + 1,
    };

    const explanation = await generateCheckInResponse(userCtx, data, {
      newCalories: adjustment.newCalories,
      changeKcal: adjustment.changeKcal,
      reason: adjustment.reason,
    });

    // Deactivate old plan, create new
    if (currentPlan) {
      await prisma.plan.update({
        where: { id: currentPlan.id },
        data: { isActive: false },
      });
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    const newPlan = await prisma.plan.create({
      data: {
        userId: session.sub,
        weekNumber: weekNumber + 1,
        calories: newMacros.calories,
        proteinG: newMacros.proteinG,
        carbsG: newMacros.carbsG,
        fatG: newMacros.fatG,
        tdee: newMacros.tdee,
        bmr: newMacros.bmr,
        nutritionPlan: nutritionPlan as unknown as object,
        workoutPlan: workoutPlan as unknown as object,
        shoppingList: shoppingList as unknown as object,
        explanation,
        validUntil,
      },
    });

    // Update user weight in onboarding for next cycle
    await prisma.onboarding.update({
      where: { userId: session.sub },
      data: { weightKg: data.weightKg },
    });

    return NextResponse.json({
      checkIn,
      adjustment,
      newPlan,
      explanation,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("Check-in error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return NextResponse.json({ checkIns });
}
