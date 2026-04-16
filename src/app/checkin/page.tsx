"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

interface CheckIn {
  id: string;
  weekNumber: number;
  weightKg: number;
  adherencePct: number;
  notes: string | null;
  createdAt: string;
}

export default function CheckInPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    weightKg: "",
    adherencePct: "80",
    notes: "",
    mood: "3",
  });
  const [history, setHistory] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [result, setResult] = useState<{ explanation: string; adjustment: { reason: string; changeKcal: number; newCalories: number } } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/checkin")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setHistory(data.checkIns); })
      .finally(() => setLoadingHistory(false));
  }, [router]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightKg: parseFloat(form.weightKg),
          adherencePct: parseFloat(form.adherencePct),
          notes: form.notes || undefined,
          mood: parseInt(form.mood),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.[0]?.message || data.error || "Error al guardar");
        return;
      }

      setResult({ explanation: data.explanation, adjustment: data.adjustment });
      setHistory((h) => [data.checkIn, ...h]);
      setForm({ weightKg: "", adherencePct: "80", notes: "", mood: "3" });
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  const moodEmojis = ["", "😞", "😕", "😐", "🙂", "😊"];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />
      <main className="max-w-screen-sm mx-auto px-4 pt-20">
        <div className="py-5">
          <h1 className="text-2xl font-bold mb-1">Check-in semanal</h1>
          <p className="text-zinc-400 text-sm">Registra tu progreso y ajustamos el plan automáticamente</p>
        </div>

        {/* Result from AI */}
        {result && (
          <Card className="mb-6 border-green-500/30 bg-green-500/5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-semibold text-green-400 mb-0.5">Check-in registrado</p>
                <p className="text-xs text-zinc-500">
                  Ajuste: {result.adjustment.changeKcal > 0 ? "+" : ""}{result.adjustment.changeKcal} kcal →{" "}
                  <strong className="text-white">{result.adjustment.newCalories} kcal/día</strong>
                </p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
              {result.explanation}
            </p>
            <button
              onClick={() => setResult(null)}
              className="mt-3 text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cerrar ×
            </button>
          </Card>
        )}

        {/* Form */}
        <Card className="mb-6">
          <h2 className="font-semibold text-white mb-4">Nuevo check-in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Peso actual (kg)"
              type="number"
              step="0.1"
              min="30"
              max="300"
              placeholder="75.2"
              value={form.weightKg}
              onChange={(e) => update("weightKg", e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Adherencia al plan — {form.adherencePct}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.adherencePct}
                onChange={(e) => update("adherencePct", e.target.value)}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Estado de ánimo de la semana
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update("mood", String(m))}
                    className={`flex-1 py-2 rounded-xl text-xl transition-all ${
                      form.mood === String(m)
                        ? "bg-zinc-700 scale-110"
                        : "bg-zinc-900 hover:bg-zinc-800"
                    }`}
                  >
                    {moodEmojis[m]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Notas (opcional)
              </label>
              <textarea
                placeholder="¿Cómo fue la semana? ¿Algún obstáculo?"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Enviar check-in
            </Button>
          </form>
        </Card>

        {/* History */}
        {!loadingHistory && history.length > 0 && (
          <div>
            <h2 className="font-semibold text-zinc-300 mb-3">Historial</h2>
            <div className="space-y-3">
              {history.map((ci) => (
                <Card key={ci.id} padding="sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Semana {ci.weekNumber} · {ci.weightKg} kg
                      </p>
                      <p className="text-xs text-zinc-500">
                        Adherencia: {ci.adherencePct}% ·{" "}
                        {new Date(ci.createdAt).toLocaleDateString("es")}
                      </p>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      ci.adherencePct >= 80 ? "bg-green-500/10 text-green-400" :
                      ci.adherencePct >= 60 ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {ci.adherencePct}%
                    </div>
                  </div>
                  {ci.notes && (
                    <p className="text-xs text-zinc-500 mt-2 italic">{ci.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
