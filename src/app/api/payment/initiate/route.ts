import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymentDetails, getReceivingAddress } from "@/lib/crypto-payment";

const schema = z.object({
  network: z.enum(["TRON", "ETHEREUM"]),
  planMonths: z.number().min(1).max(12).default(1),
});

const PRICE_PER_MONTH = parseFloat(process.env.SUBSCRIPTION_PRICE_USDT || "29.99");

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { network, planMonths } = schema.parse(body);

    const amount = parseFloat((PRICE_PER_MONTH * planMonths).toFixed(2));
    const toAddress = getReceivingAddress(network);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const payment = await prisma.payment.create({
      data: {
        userId: session.sub,
        amount,
        currency: "USDT",
        network,
        toAddress,
        status: "PENDING",
        planMonths,
        expiresAt,
      },
    });

    const details = createPaymentDetails(network, amount, payment.reference);

    return NextResponse.json({
      payment: {
        id: payment.id,
        reference: payment.reference,
        amount,
        currency: "USDT",
        network,
        toAddress: details.toAddress,
        expiresAt: payment.expiresAt,
      },
      instructions: {
        TRON: "Envía exactamente el monto indicado en USDT TRC20 a la dirección. No envíes TRX ni otro token.",
        ETHEREUM: "Envía exactamente el monto indicado en USDT ERC20 a la dirección. Asegúrate de pagar el gas en ETH.",
      }[network],
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("Payment initiate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
