'use client';

import { useEffect, useState } from 'react';

interface PlanResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: string;
  trainingSplit: string;
  shoppingList: string;
  explanation: string;
  reasoning: {
    bmr: number;
    activityFactor: number;
    frequencyFactor: number;
    bodyFatFactor: number;
    tdee: number;
    calorieTarget: number;
    changePercent: number;
    proteinPerKg: number;
    notes: string[];
  };
  planType?: string;
}

export default function PlanPage() {
  const [result, setResult] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastPlan');
    if (stored) setResult(JSON.parse(stored));
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to generate a plan.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || 'Unable to generate plan');
      return;
    }

    setResult(data.plan);
    sessionStorage.setItem('lastPlan', JSON.stringify(data.plan));
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 text-slate-100 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Create your weekly plan</h1>
            <p className="mt-3 text-slate-400">Generate tailored meals, training, and shopping guidance based on your onboarding profile.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Generating...' : 'Generate plan'}
          </button>
        </div>

        {error ? <div className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        {result ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-6">
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <h2 className="text-lg font-semibold text-white">Plan summary</h2>
                <p className="mt-4 text-slate-300">Calories: {result.calories} kcal</p>
                <p className="text-slate-300">Protein: {result.protein}g</p>
                <p className="text-slate-300">Carbs: {result.carbs}g</p>
                <p className="text-slate-300">Fat: {result.fat}g</p>
                <p className="mt-4 text-slate-400">{result.explanation}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <h2 className="text-lg font-semibold text-white">Why this plan works</h2>
                <ul className="mt-4 space-y-3 text-slate-300">
                  <li>BMR: {result.reasoning.bmr} kcal</li>
                  <li>Activity factor: {result.reasoning.activityFactor.toFixed(2)}</li>
                  <li>Training frequency factor: {result.reasoning.frequencyFactor.toFixed(2)}</li>
                  <li>Body fat factor: {result.reasoning.bodyFatFactor.toFixed(2)}</li>
                  <li>TDEE estimate: {result.reasoning.tdee} kcal</li>
                </ul>
                <div className="mt-4 text-slate-400">
                  {result.reasoning.notes.map((note, index) => (
                    <p key={index}>{note}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <h2 className="text-lg font-semibold text-white">Meals</h2>
                <p className="mt-4 whitespace-pre-line text-slate-300">{result.meals}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <h2 className="text-lg font-semibold text-white">Training split</h2>
                <p className="mt-4 whitespace-pre-line text-slate-300">{result.trainingSplit}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 p-6">
                <h2 className="text-lg font-semibold text-white">Shopping list</h2>
                <p className="mt-4 whitespace-pre-line text-slate-300">{result.shoppingList}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-800 bg-slate-900/80 p-8 text-slate-400">
            Generate your first meal and workout plan from your profile to see a personalized plan and reasoning.
          </div>
        )}
      </div>
    </section>
  );
}
