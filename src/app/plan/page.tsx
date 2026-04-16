"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface MealPlan {
  meal: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
}

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  type: string;
  durationMin: number;
  exercises: WorkoutExercise[];
  notes?: string;
}

interface ShoppingItem {
  category: string;
  items: string[];
}

interface Plan {
  id: string;
  weekNumber: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  bmr: number;
  tdee: number;
  nutritionPlan: MealPlan[];
  workoutPlan: WorkoutDay[];
  shoppingList: ShoppingItem[];
  explanation: string;
  generatedAt: string;
}

const workoutTypeColors: Record<string, "green" | "blue" | "yellow" | "red" | "gray"> = {
  strength: "blue",
  hiit: "red",
  cardio: "yellow",
  active_recovery: "green",
  rest: "gray",
};

const workoutTypeLabels: Record<string, string> = {
  strength: "Fuerza",
  hiit: "HIIT",
  cardio: "Cardio",
  active_recovery: "Recuperación activa",
  rest: "Descanso",
};

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"nutrition" | "workout" | "shopping" | "explanation">("nutrition");

  useEffect(() => {
    fetch("/api/plan")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (!data.plan) { router.push("/dashboard"); return; }
        setPlan(data.plan);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />

      <main className="max-w-screen-sm mx-auto px-4 pt-20">
        <div className="py-5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">Mi Plan</h1>
            <Badge variant="green">Semana {plan.weekNumber}</Badge>
          </div>
          <p className="text-zinc-500 text-sm">
            {plan.calories} kcal · {Math.round(plan.proteinG)}g P · {Math.round(plan.carbsG)}g C · {Math.round(plan.fatG)}g G
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 mb-6">
          {(["nutrition", "workout", "shopping", "explanation"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === t
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "nutrition" ? "🍽 Comidas" : t === "workout" ? "🏋️ Entreno" : t === "shopping" ? "🛒 Compras" : "💬 Coach"}
            </button>
          ))}
        </div>

        {/* Nutrition Tab */}
        {tab === "nutrition" && (
          <div className="space-y-4">
            {plan.nutritionPlan.map((meal, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{meal.meal}</h3>
                    <p className="text-xs text-zinc-500">{meal.time}</p>
                  </div>
                  <span className="text-green-400 font-bold">{meal.calories} kcal</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">P {meal.protein}g</span>
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">C {meal.carbs}g</span>
                  <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">G {meal.fat}g</span>
                </div>
                <ul className="space-y-1">
                  {meal.foods.map((food, j) => (
                    <li key={j} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {food}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}

        {/* Workout Tab */}
        {tab === "workout" && (
          <div className="space-y-4">
            {plan.workoutPlan.map((day, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{day.day}</h3>
                    {day.durationMin > 0 && (
                      <p className="text-xs text-zinc-500">{day.durationMin} min</p>
                    )}
                  </div>
                  <Badge variant={workoutTypeColors[day.type] || "gray"}>
                    {workoutTypeLabels[day.type] || day.type}
                  </Badge>
                </div>
                {day.notes && (
                  <p className="text-xs text-zinc-500 mb-3 italic">{day.notes}</p>
                )}
                {day.exercises.length > 0 ? (
                  <div className="space-y-2">
                    {day.exercises.map((ex, j) => (
                      <div key={j} className="flex items-center gap-3 py-2 border-t border-zinc-800 first:border-0 first:pt-0">
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{ex.name}</p>
                          {ex.notes && <p className="text-xs text-zinc-500">{ex.notes}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-green-400 font-medium">
                            {ex.sets} × {ex.reps}
                          </p>
                          <p className="text-xs text-zinc-500">{ex.restSec}s descanso</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm">Día de descanso completo 🛌</p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Shopping Tab */}
        {tab === "shopping" && (
          <div className="space-y-4">
            {plan.shoppingList.map((section, i) => (
              <Card key={i}>
                <h3 className="font-semibold text-white mb-3">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-4 h-4 border border-zinc-700 rounded shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}

        {/* Explanation Tab */}
        {tab === "explanation" && (
          <Card>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🤖</span> Alex, tu coach
            </h3>
            <div className="prose-dark whitespace-pre-line text-sm text-zinc-300 leading-relaxed">
              {plan.explanation}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
