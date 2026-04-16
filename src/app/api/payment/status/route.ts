import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ payments });
}
