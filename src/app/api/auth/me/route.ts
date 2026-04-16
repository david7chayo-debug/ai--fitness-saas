import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: {
      onboarding: true,
      plans: { where: { isActive: true }, orderBy: { generatedAt: "desc" }, take: 1 },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
    language: user.language,
    hasOnboarding: !!user.onboarding,
    hasActivePlan: user.plans.length > 0,
    currentPlan: user.plans[0] || null,
    latestPayment: user.payments[0] || null,
  });
}
