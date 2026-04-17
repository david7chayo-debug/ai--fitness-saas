'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="container py-16 text-slate-100">
      <div className="grid gap-10 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/10">
        <div className="space-y-6">
          <p className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            AI Fitness & Nutrition Coach
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Build your custom nutrition and workout plan with smart coaching.
          </h1>
          <p className="max-w-3xl text-slate-300">
            Register, complete onboarding, generate personalized meals, workouts, and shopping lists, check in weekly and chat with your coach.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Start free
            </Link>
            <Link href="/login" className="rounded-3xl border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-slate-500">
              Login
            </Link>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Onboarding', body: 'Tell us your goals, stats, and activity level.' },
            { title: 'Plan', body: 'Generate balanced meals, workouts, and shopping lists.' },
            { title: 'AI Coach', body: 'Ask questions and get guidance every step.' },
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h2 className="text-lg font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-slate-400">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
