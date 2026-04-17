'use client';

import { useState } from 'react';

export default function PaymentPage() {
  const [amount, setAmount] = useState(9.99);
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('Authentication required. Please login first.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount, currency: 'USDT', walletAddress }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus(data?.error || 'Payment failed.');
      return;
    }

    const details = [data?.message];
    if (data?.payment?.txHash) {
      details.push(`TX: ${data.payment.txHash}`);
    }
    setStatus(details.filter(Boolean).join(' '));
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 text-slate-100 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">Mock payment</h1>
        <p className="mt-3 text-slate-400">Simulate a USDT checkout flow and upgrade to premium coaching.</p>

        <form onSubmit={handlePayment} className="mt-8 space-y-6">
          <label className="block">
            <span className="text-sm text-slate-300">Amount</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Wallet address</span>
            <input
              type="text"
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
              placeholder="0x123..."
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>

          {status ? <div className="rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{status}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Processing...' : 'Pay with USDT'}
          </button>
        </form>
      </div>
    </section>
  );
}
