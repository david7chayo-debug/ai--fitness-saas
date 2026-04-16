import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatWithCoach } from "@/lib/ai";
import type { UserContext } from "@/lib/system-prompt";
import type { MacroTargets } from "@/lib/core-engine";

const schema = z.object({
  message: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user?.isActive) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { message } = schema.parse(body);

    const [onboarding, currentPlan, history] = await Promise.all([
      prisma.onboarding.findUnique({ where: { userId: session.sub } }),
      prisma.plan.findFirst({
        where: { userId: session.sub, isActive: true },
        orderBy: { generatedAt: "desc" },
      }),
      prisma.chatMessage.findMany({
        where: { userId: session.sub },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const macros: MacroTargets = currentPlan
      ? {
          calories: currentPlan.calories,
          proteinG: currentPlan.proteinG,
          carbsG: currentPlan.carbsG,
          fatG: currentPlan.fatG,
          bmr: currentPlan.bmr,
          tdee: currentPlan.tdee,
        }
      : { calories: 2000, proteinG: 150, carbsG: 200, fatG: 70, bmr: 1700, tdee: 2200 };

    const userCtx: UserContext = {
      name: user.name ?? undefined,
      language: user.language,
      goal: onboarding?.goal || "MAINTENANCE",
      weightKg: onboarding?.weightKg || 70,
      macros,
      weekNumber: currentPlan?.weekNumber || 1,
    };

    const conversationHistory = history
      .reverse()
      .map((m) => ({ role: m.role.toLowerCase() as "user" | "assistant", content: m.content }));

    const response = await chatWithCoach(userCtx, conversationHistory, message);

    // Persist messages
    await prisma.chatMessage.createMany({
      data: [
        { userId: session.sub, role: "USER", content: message },
        { userId: session.sub, role: "ASSISTANT", content: response.content, tokens: response.tokens },
      ],
    });

    return NextResponse.json({ reply: response.content, tokens: response.tokens });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.chatMessage.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json({ messages });
}
