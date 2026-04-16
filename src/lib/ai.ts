import { buildSystemPrompt, buildCheckInPrompt, buildPlanExplanationPrompt } from "./system-prompt";
import type { UserContext } from "./system-prompt";
import type { MacroTargets, WorkoutDay } from "./core-engine";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIResponse {
  content: string;
  tokens: number;
}

// ─── Provider abstraction ─────────────────────────────────────────────────

async function callAnthropic(
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens = 2048
): Promise<AIResponse> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const content =
    response.content[0].type === "text" ? response.content[0].text : "";
  const tokens = response.usage.input_tokens + response.usage.output_tokens;

  return { content, tokens };
}

async function callOpenAI(
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens = 2048
): Promise<AIResponse> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  const tokens =
    (response.usage?.prompt_tokens || 0) +
    (response.usage?.completion_tokens || 0);

  return { content, tokens };
}

export async function callAI(
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens = 2048
): Promise<AIResponse> {
  const provider = process.env.AI_PROVIDER || "anthropic";
  if (provider === "openai") {
    return callOpenAI(systemPrompt, messages, maxTokens);
  }
  return callAnthropic(systemPrompt, messages, maxTokens);
}

// ─── High-level AI actions ────────────────────────────────────────────────

export async function generatePlanExplanation(
  userCtx: UserContext,
  workoutPlan: WorkoutDay[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(userCtx);
  const workoutDays = workoutPlan.filter((d) => d.type !== "rest").length;
  const topFoods = [
    "pollo",
    "arroz integral",
    "brócoli",
    "huevos",
    "avena",
    "salmón",
  ];

  const userMessage = buildPlanExplanationPrompt(userCtx, workoutDays, topFoods);

  const response = await callAI(systemPrompt, [
    { role: "user", content: userMessage },
  ], 2500);

  return response.content;
}

export async function generateCheckInResponse(
  userCtx: UserContext,
  checkIn: { weightKg: number; adherencePct: number; notes?: string },
  adjustment: { newCalories: number; changeKcal: number; reason: string }
): Promise<string> {
  const systemPrompt = buildSystemPrompt(userCtx);
  const userMessage = buildCheckInPrompt(userCtx, checkIn, adjustment);

  const response = await callAI(systemPrompt, [
    { role: "user", content: userMessage },
  ], 1500);

  return response.content;
}

export async function chatWithCoach(
  userCtx: UserContext,
  conversationHistory: AIMessage[],
  newMessage: string
): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(userCtx);
  const messages: AIMessage[] = [
    ...conversationHistory.slice(-10), // keep last 10 messages for context
    { role: "user", content: newMessage },
  ];

  return callAI(systemPrompt, messages, 1024);
}
