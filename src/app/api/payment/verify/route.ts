import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPayment, isPaymentExpired } from "@/lib/crypto-payment";

const schema = z.object({
  paymentId: z.string(),
  txHash: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { paymentId, txHash } = schema.parse(body);

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, userId: session.sub },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "CONFIRMED") {
      return NextResponse.json({ status: "already_confirmed", payment });
    }

    if (isPaymentExpired(payment.expiresAt)) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Payment expired" }, { status: 410 });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "CONFIRMING" },
    });

    const result = await verifyPayment(
      payment.network,
      txHash || payment.txHash || payment.reference,
      payment.amount,
      payment.reference
    );

    if (!result.verified) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PENDING", txHash: txHash || payment.txHash },
      });
      return NextResponse.json({ verified: false, error: result.error });
    }

    // Activate subscription
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + payment.planMonths);

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "CONFIRMED",
          txHash: result.txHash || txHash || payment.txHash,
          fromAddress: result.fromAddress,
          confirmedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: session.sub },
        data: { isActive: true },
      }),
    ]);

    return NextResponse.json({
      verified: true,
      message: "Pago confirmado. Tu suscripción está activa.",
      payment: { ...payment, status: "CONFIRMED" },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("Payment verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
