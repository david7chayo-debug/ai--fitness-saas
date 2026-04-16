import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  weightKg: z.number().min(30).max(300),
  heightCm: z.number().min(100).max(250),
  age: z.number().min(16).max(100),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  bodyFatPct: z.number().min(3).max(60).optional(),
  activityLevel: z.enum(["SEDENTARY", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
  goal: z.enum(["FAT_LOSS", "MUSCLE_GAIN", "RECOMPOSITION", "MAINTENANCE"]),
  sleepHours: z.number().min(3).max(12).default(7),
  weeklyBudget: z.number().min(0).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const onboarding = await prisma.onboarding.upsert({
      where: { userId: session.sub },
      create: { userId: session.sub, ...data },
      update: data,
    });

    return NextResponse.json({ onboarding, success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const onboarding = await prisma.onboarding.findUnique({
    where: { userId: session.sub },
  });

  if (!onboarding) return NextResponse.json({ onboarding: null });
  return NextResponse.json({ onboarding });
}
