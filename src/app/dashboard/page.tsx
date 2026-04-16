"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import MacroCard from "@/components/MacroCard";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  hasOnboarding: boolean;
  hasActivePlan: boolean;
  currentPlan: {
    id: string;
    weekNumber: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    explanation: string;
    generatedAt: string;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (!data.hasOnboarding) { router.push("/onboarding"); return; }
        if (!data.isActive) { router.push("/payment"); return; }
        setUser(data);
      })
      .catch(() => setError("Error cargando datos"))
      .finally(() => setLoading(false));
  }, [router]);

  async function generatePlan() {
    setGeneratingPlan(true);
    setError("");
    try {
      const res = await fetch("/api/plan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); return; }
      setUser((u) => u ? { ...u, hasActivePlan: true, currentPlan: data.plan } : u);
    } catch {
      setError("Error al generar el plan");
    } finally {
      setGeneratingPlan(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />

      <main className="max-w-screen-sm mx-auto px-4 pt-20">
        {/* Greeting */}
        <div className="py-6">
          <h1 className="text-2xl font-bold">
            Hola, {user?.name || "atleta"} 👋
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {user?.currentPlan
              ? `Semana ${user.currentPlan.weekNumber} del programa`
              : "Genera tu primer plan para empezar"}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* No plan yet */}
        {!user?.hasActivePlan && (
          <Card className="mb-6 text-center py-10">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl font-bold mb-2">Tu plan te espera</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Calculamos tu plan personalizado basado en tu perfil. El sistema es científico, no genérico.
            </p>
            <Button onClick={generatePlan} loading={generatingPlan} size="lg" className="mx-auto">
              {generatingPlan ? "Generando plan..." : "Generar mi plan"}
            </Button>
          </Card>
        )}

        {/* Active plan macros */}
        {user?.currentPlan && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-zinc-300">Objetivos diarios</h2>
              <Badge variant="green">Semana {user.currentPlan.weekNumber}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <MacroCard
                label="Calorías"
                value={user.currentPlan.calories}
                unit="kcal"
                color="green"
              />
              <MacroCard
                label="Proteína"
                value={Math.round(user.currentPlan.proteinG)}
                unit="g"
                color="blue"
              />
              <MacroCard
                label="Carbos"
                value={Math.round(user.currentPlan.carbsG)}
                unit="g"
                color="yellow"
              />
              <MacroCard
                label="Grasa"
                value={Math.round(user.currentPlan.fatG)}
                unit="g"
                color="red"
              />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link href="/plan">
                <Card className="text-center cursor-pointer hover:border-zinc-600 transition-colors h-full">
                  <div className="text-2xl mb-1">📋</div>
                  <p className="text-sm font-medium text-white">Ver plan completo</p>
                  <p className="text-xs text-zinc-500 mt-1">Comidas y ejercicios</p>
                </Card>
              </Link>
              <Link href="/checkin">
                <Card className="text-center cursor-pointer hover:border-zinc-600 transition-colors h-full">
                  <div className="text-2xl mb-1">📊</div>
                  <p className="text-sm font-medium text-white">Check-in semanal</p>
                  <p className="text-xs text-zinc-500 mt-1">Registrar progreso</p>
                </Card>
              </Link>
              <Link href="/chat">
                <Card className="text-center cursor-pointer hover:border-zinc-600 transition-colors h-full">
                  <div className="text-2xl mb-1">🤖</div>
                  <p className="text-sm font-medium text-white">Coach IA</p>
                  <p className="text-xs text-zinc-500 mt-1">Preguntar al coach</p>
                </Card>
              </Link>
              <button onClick={generatePlan} disabled={generatingPlan}>
                <Card className="text-center cursor-pointer hover:border-zinc-600 transition-colors h-full w-full">
                  <div className="text-2xl mb-1">🔄</div>
                  <p className="text-sm font-medium text-white">
                    {generatingPlan ? "Generando..." : "Regenerar plan"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Reiniciar semana</p>
                </Card>
              </button>
            </div>

            {/* Plan explanation preview */}
            {user.currentPlan.explanation && (
              <Card className="mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🤖</span> Coach dice
                </h3>
                <div className="text-zinc-400 text-sm leading-relaxed line-clamp-6 whitespace-pre-line">
                  {user.currentPlan.explanation.slice(0, 400)}...
                </div>
                <Link href="/plan" className="inline-flex items-center gap-1 text-green-400 text-sm mt-3 font-medium">
                  Leer completo →
                </Link>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
