import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function normalizeInput(text: string) {
  return text.trim().toLowerCase();
}

function isCalorieRequest(text: string) {
  return /change.*calorie|adjust.*calorie|calorie.*change|update.*calorie|macro.*change|protein.*target|carb.*target|fat.*target|calories?/i.test(text);
}

function buildPlanSummary(plan: any) {
  if (!plan) return 'No generated plan is available yet.';
  return `Current targeted calories: ${plan.calories} kcal. Macros: ${plan.protein}g protein, ${plan.carbs}g carbs, ${plan.fat}g fat. Training split: ${plan.trainingSplit}. Meals: ${plan.meals}`;
}

function buildCheckinSummary(checkin: any) {
  if (!checkin) return 'No recent check-in data is available yet.';
  const weightText = checkin.weight ? ` Weight recorded: ${checkin.weight} kg.` : '';
  return `Latest check-in rating: ${checkin.rating}. ${checkin.comment || 'No comment provided.'}${weightText}`;
}

function buildFreeCoachReply(message: string, plan: any, checkin: any) {
  const normalized = normalizeInput(message);
  const planSummary = buildPlanSummary(plan);
  const checkinSummary = buildCheckinSummary(checkin);

  if (isCalorieRequest(message)) {
    return `I can help explain your current strategy, but I cannot change targets directly in chat. ${planSummary} Use the plan page or onboarding to update your nutrition target.`;
  }

  if (/workout|training|exercise|split/.test(normalized)) {
    return `Your plan is built on your existing training split. ${planSummary} Focus on consistency and recovery, and upgrade for a premium coach experience with deeper programming.`;
  }

  if (/meal|food|nutrition|diet|calories/.test(normalized)) {
    return `Here is your current nutrition approach. ${planSummary} ${checkinSummary}`;
  }

  return `I am your fitness coach. ${planSummary} ${checkinSummary} Ask me about your current meals, workout split, or how to stay consistent.`;
}

export async function POST(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace('Bearer ', '');
  const verified = verifyToken(token);

  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const message = String(payload.message || '');
  if (!message.trim()) {
    return NextResponse.json({ reply: 'Send a question to get coaching feedback.' });
  }

  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    include: {
      plans: {
        orderBy: { generatedAt: 'desc' },
        take: 1,
      },
      checkins: {
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const latestPlan = user.plans[0] || null;
  const latestCheckin = user.checkins[0] || null;
  const weightTrend = latestCheckin?.weight ? `Latest tracked weight is ${latestCheckin.weight} kg.` : 'No weight trend yet.';
  const planSummary = buildPlanSummary(latestPlan);
  const checkinSummary = buildCheckinSummary(latestCheckin);

  if (isCalorieRequest(message)) {
    const reply = latestPlan
      ? `Your current plan target is ${latestPlan.calories} kcal with ${latestPlan.protein}g protein, ${latestPlan.carbs}g carbs, and ${latestPlan.fat}g fat. I can explain how these targets support your goal, but I cannot change your calories directly in chat. Use the plan page or onboarding to update your nutrition targets.`
      : 'No plan is available yet. Complete onboarding and generate a plan first.';

    await prisma.chatMemory.create({
      data: {
        userId: user.id,
        role: 'user',
        message,
        reply,
      },
    });

    return NextResponse.json({ reply });
  }

  if (user.planType !== 'premium' || !OPENAI_API_KEY) {
    const reply = buildFreeCoachReply(message, latestPlan, latestCheckin);
    await prisma.chatMemory.create({
      data: {
        userId: user.id,
        role: 'user',
        message,
        reply,
      },
    });
    return NextResponse.json({ reply });
  }

  const systemMessage = `You are a personalized fitness coach. Only explain and interpret the user's existing plan, macros, and check-in data. Do not invent new calorie or macro targets. If asked to change calorie targets, tell the user to use the plan generation or onboarding workflow instead. Use the user's latest plan and check-in notes as context.`;
  const contextMessage = `Plan context: ${planSummary}. Latest check-in: ${checkinSummary}. Weight trend: ${weightTrend}. User type: ${user.planType}.`;

  try {
    const client = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'system', content: contextMessage },
        { role: 'user', content: message },
      ],
      max_tokens: 220,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || `I reviewed your plan. ${planSummary}`;
    await prisma.chatMemory.create({
      data: {
        userId: user.id,
        role: 'user',
        message,
        reply,
      },
    });
    return NextResponse.json({ reply });
  } catch (error) {
    const reply = buildFreeCoachReply(message, latestPlan, latestCheckin);
    await prisma.chatMemory.create({
      data: {
        userId: user.id,
        role: 'user',
        message,
        reply,
      },
    });
    return NextResponse.json({ reply });
  }
}
