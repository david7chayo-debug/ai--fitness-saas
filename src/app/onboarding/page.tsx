"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const TOTAL_STEPS = 4;

interface FormData {
  name: string;
  age: string;
  gender: string;
  weightKg: string;
  heightCm: string;
  bodyFatPct: string;
  activityLevel: string;
  goal: string;
  sleepHours: string;
  weeklyBudget: string;
}

const initialForm: FormData = {
  name: "",
  age: "",
  gender: "MALE",
  weightKg: "",
  heightCm: "",
  bodyFatPct: "",
  activityLevel: "MEDIUM",
  goal: "FAT_LOSS",
  sleepHours: "7",
  weeklyBudget: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    setError("");
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
    setError("");
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const payload = {
        weightKg: parseFloat(form.weightKg),
        heightCm: parseFloat(form.heightCm),
        age: parseInt(form.age),
        gender: form.gender,
        bodyFatPct: form.bodyFatPct ? parseFloat(form.bodyFatPct) : undefined,
        activityLevel: form.activityLevel,
        goal: form.goal,
        sleepHours: parseFloat(form.sleepHours),
        weeklyBudget: form.weeklyBudget ? parseFloat(form.weeklyBudget) : undefined,
      };

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.[0]?.message || data.error || "Error al guardar perfil");
        return;
      }

      router.push("/payment");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-400 font-bold text-lg">AI<span className="text-white">Fit</span></span>
            <span className="text-zinc-500 text-sm">Paso {step} de {TOTAL_STEPS}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-1">Hablemos de ti</h2>
              <p className="text-zinc-400 text-sm">Datos básicos para calcular tu metabolismo</p>
            </div>
            <Input
              label="Nombre (opcional)"
              placeholder="¿Cómo te llaman?"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <Input
              label="Edad"
              type="number"
              placeholder="25"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              required
              min="16"
              max="100"
            />
            <Select
              label="Sexo biológico"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              options={[
                { value: "MALE", label: "Masculino" },
                { value: "FEMALE", label: "Femenino" },
                { value: "OTHER", label: "Otro" },
              ]}
            />
          </div>
        )}

        {/* Step 2: Body Metrics */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-1">Tu cuerpo</h2>
              <p className="text-zinc-400 text-sm">Usamos esto para calcular tus calorías exactas</p>
            </div>
            <Input
              label="Peso (kg)"
              type="number"
              placeholder="75.5"
              value={form.weightKg}
              onChange={(e) => update("weightKg", e.target.value)}
              required
              step="0.1"
              min="30"
              max="300"
            />
            <Input
              label="Altura (cm)"
              type="number"
              placeholder="175"
              value={form.heightCm}
              onChange={(e) => update("heightCm", e.target.value)}
              required
              min="100"
              max="250"
            />
            <Input
              label="% Grasa corporal (opcional)"
              type="number"
              placeholder="20"
              value={form.bodyFatPct}
              onChange={(e) => update("bodyFatPct", e.target.value)}
              step="0.5"
              min="3"
              max="60"
              hint="Si no lo sabes, déjalo en blanco. Te estimamos uno."
            />
          </div>
        )}

        {/* Step 3: Goal & Activity */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-1">Objetivo</h2>
              <p className="text-zinc-400 text-sm">Esto define tu déficit/superávit calórico</p>
            </div>
            <Select
              label="¿Qué quieres lograr?"
              value={form.goal}
              onChange={(e) => update("goal", e.target.value)}
              options={[
                { value: "FAT_LOSS", label: "🔥 Perder grasa" },
                { value: "MUSCLE_GAIN", label: "💪 Ganar músculo" },
                { value: "RECOMPOSITION", label: "⚖️ Recomposición corporal" },
                { value: "MAINTENANCE", label: "✅ Mantenimiento" },
              ]}
            />
            <Select
              label="Nivel de actividad actual"
              value={form.activityLevel}
              onChange={(e) => update("activityLevel", e.target.value)}
              options={[
                { value: "SEDENTARY", label: "Sedentario (sin ejercicio)" },
                { value: "LOW", label: "Bajo (1-2 días/semana)" },
                { value: "MEDIUM", label: "Moderado (3-4 días/semana)" },
                { value: "HIGH", label: "Alto (5-6 días/semana)" },
                { value: "VERY_HIGH", label: "Muy alto (2x/día o atleta)" },
              ]}
            />
          </div>
        )}

        {/* Step 4: Lifestyle */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-1">Estilo de vida</h2>
              <p className="text-zinc-400 text-sm">Para personalizar tu plan al máximo</p>
            </div>
            <Input
              label="Horas de sueño promedio"
              type="number"
              placeholder="7"
              value={form.sleepHours}
              onChange={(e) => update("sleepHours", e.target.value)}
              step="0.5"
              min="3"
              max="12"
              hint="El sueño afecta directamente la composición corporal"
            />
            <Input
              label="Presupuesto semanal para comida (USD, opcional)"
              type="number"
              placeholder="80"
              value={form.weeklyBudget}
              onChange={(e) => update("weeklyBudget", e.target.value)}
              min="0"
              hint="Te ayuda a darte una lista de compras realista"
            />

            {/* Summary preview */}
            {form.weightKg && form.heightCm && form.age && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Resumen</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-zinc-500">Peso:</span>
                    <span className="text-white ml-1">{form.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Talla:</span>
                    <span className="text-white ml-1">{form.heightCm} cm</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Objetivo:</span>
                    <span className="text-green-400 ml-1">
                      {{ FAT_LOSS: "Fat loss", MUSCLE_GAIN: "Muscle gain", RECOMPOSITION: "Recomp", MAINTENANCE: "Mantener" }[form.goal]}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Actividad:</span>
                    <span className="text-white ml-1">{form.activityLevel}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button variant="secondary" onClick={prevStep} className="flex-1">
              Atrás
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button onClick={nextStep} className="flex-1">
              Continuar
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} className="flex-1">
              Completar perfil
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
