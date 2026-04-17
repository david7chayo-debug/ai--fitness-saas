'use client';

import { useState } from 'react';

export default function CheckinPage() {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication required.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rating, comment, weight: weight ? Number(weight) : undefined }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data?.error || 'Could not submit check-in');
      return;
    }

    setMessage(data?.message || 'Check-in saved successfully.');
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 text-slate-100 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">Weekly check-in</h1>
        <p className="mt-3 text-slate-400">Share how you felt, optionally update weight, and receive tailored guidance.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm text-slate-300">Progress rating</span>
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500">
                <option value={5}>Excellent</option>
                <option value={4}>Good</option>
                <option value={3}>Okay</option>
                <option value={2}>Slow</option>
                <option value={1}>Struggling</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Current weight (kg)</span>
              <input
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                type="number"
                step="0.1"
                placeholder="Optional"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Notes</span>
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="How did the program feel?"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          {message ? <div className="rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{message}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit check-in'}
          </button>
        </form>
      </div>
    </section>
  );
}
