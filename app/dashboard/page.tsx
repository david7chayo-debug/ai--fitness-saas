'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  email: string;
  name?: string;
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  bodyFat?: number;
  goal?: string;
  activityLevel?: string;
  trainingExperience?: string;
  trainingFrequency?: number;
  eatingPreference?: string;
  dietaryRestrictions?: string;
  planType?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError('Authentication required');
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return <div className="container py-20 text-slate-200">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <section className="container py-20 text-slate-200">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="container py-16">
      <div className="grid gap-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 text-slate-100 shadow-xl">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Welcome back, {user?.name ?? user?.email}</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Your personalized fitness dashboard</h1>
          <p className="mt-3 text-slate-400">View your current strategy, premium access, and plan details.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Plan Type</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.planType ?? 'free'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Goal</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.goal ?? 'Not set'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Calories</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.calories ?? 'N/A'} kcal</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Macros</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.protein ?? 0}P / {user?.carbs ?? 0}C / {user?.fat ?? 0}F</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Training</p>
              <p className="mt-3 text-white">{user?.trainingFrequency ?? '–'} days / {user?.trainingExperience ?? '–'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Eating style</p>
              <p className="mt-3 text-white">{user?.eatingPreference ?? '–'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Diet notes</p>
              <p className="mt-3 text-white">{user?.dietaryRestrictions || 'None'}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan" className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
              Generate plan
            </Link>
            <Link href="/checkin" className="rounded-3xl border border-slate-700 px-5 py-3 text-sm text-slate-100 hover:border-slate-500">
              Weekly check-in
            </Link>
            <Link href="/chat" className="rounded-3xl border border-slate-700 px-5 py-3 text-sm text-slate-100 hover:border-slate-500">
              Chat coach
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
