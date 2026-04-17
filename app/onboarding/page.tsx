'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(175);
  const [bodyFat, setBodyFat] = useState('18');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('fat loss');
  const [experience, setExperience] = useState('beginner');
  const [trainingFrequency, setTrainingFrequency] = useState(4);
  const [eatingPreference, setEatingPreference] = useState('3 meals');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        gender,
        age,
        weight,
        height,
        bodyFat,
        goal,
        activity,
        trainingExperience: experience,
        trainingFrequency,
        eatingPreference,
        dietaryRestrictions,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || 'Cannot complete onboarding');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 text-slate-100 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">Profile setup</h1>
        <p className="mt-3 text-slate-400">Complete these details for a tailored plan and premium AI coaching.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-300">Gender</span>
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Training experience</span>
              <select
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block">
              <span className="text-sm text-slate-300">Age</span>
              <input
                required
                type="number"
                value={age}
                min={12}
                onChange={(event) => setAge(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Weight (kg)</span>
              <input
                required
                type="number"
                step="0.1"
                value={weight}
                min={30}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Height (cm)</span>
              <input
                required
                type="number"
                step="0.1"
                value={height}
                min={120}
                onChange={(event) => setHeight(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Body fat %</span>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                min={5}
                max={45}
                onChange={(event) => setBodyFat(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm text-slate-300">Activity level</span>
              <select
                value={activity}
                onChange={(event) => setActivity(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500">
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="athlete">Athlete</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Goal</span>
              <select
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500">
                <option value="fat loss">Fat loss</option>
                <option value="muscle gain">Muscle gain</option>
                <option value="recomposition">Recomposition</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Training days</span>
              <input
                required
                type="number"
                value={trainingFrequency}
                min={2}
                max={7}
                onChange={(event) => setTrainingFrequency(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-300">Eating preference</span>
              <select
                value={eatingPreference}
                onChange={(event) => setEatingPreference(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500">
                <option value="3 meals">3 meals</option>
                <option value="4 meals">4 meals</option>
                <option value="intermittent fasting">Intermittent fasting</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Dietary restrictions</span>
              <input
                type="text"
                value={dietaryRestrictions}
                onChange={(event) => setDietaryRestrictions(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
                placeholder="e.g. gluten, dairy, soy"
              />
            </label>
          </div>

          {error ? <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Saving profile...' : 'Complete onboarding'}
          </button>
        </form>
      </div>
    </section>
  );
}
