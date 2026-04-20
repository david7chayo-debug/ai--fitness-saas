'use client';

import { useState } from 'react';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const PAIN_POINTS = [
  {
    icon: '⏱',
    title: '6+ hours per client, every month',
    description:
      'Your team opens GA4, Google Ads, Meta — pulls numbers into a spreadsheet, builds slides, then writes the "what this means" section. Repeat for every client.',
  },
  {
    icon: '💸',
    title: "You're billing for data, not insight",
    description:
      'Clients pay for your expertise — the interpretation, the strategy, the plain-English explanation. Yet 80% of report time is copy-paste from dashboards.',
  },
  {
    icon: '🔴',
    title: 'Tools break and cost more every quarter',
    description:
      'AgencyAnalytics raised per-client fees to $20/mo. Whatagraph is $199+. And when Meta changes their API, every client dashboard goes red at once.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Connect your data sources',
    description:
      'OAuth-connect GA4, Google Ads, and Meta Ads in under 2 minutes. No CSV exports, no copy-paste, no manual refresh.',
  },
  {
    number: '02',
    title: 'Configure your report',
    description:
      'Set your agency branding, choose the metrics that matter to each client, define your report schedule (weekly or monthly), and add client context the AI should know.',
  },
  {
    number: '03',
    title: 'AI writes, you review, client receives',
    description:
      'Narratify generates a full narrative report — not just charts, but written explanations of what happened and why. Review in 5 minutes, send with one click.',
  },
];

const FEATURES = [
  {
    icon: '✍️',
    title: 'AI-Written Narrative',
    description:
      "Claude writes the actual English explanation: 'Your retargeting campaigns delivered 2.1x ROAS in March. We recommend increasing budget on Ad Set #3 by 20% in April.' Real sentences. Not just numbers.",
  },
  {
    icon: '🏷️',
    title: 'White-Label Under Your Brand',
    description:
      'Clients see your agency name, logo, and colors — never Narratify. Custom domain support so report links come from your own domain.',
  },
  {
    icon: '📅',
    title: 'Scheduled Auto-Delivery',
    description:
      'Set it once. Narratify pulls data, generates the report, and emails it to your client automatically — on the day you choose, every month or week.',
  },
  {
    icon: '📊',
    title: 'Multi-Source Intelligence',
    description:
      'GA4, Google Ads, Meta Ads in one coherent report. Narratify connects cross-channel dots that siloed dashboards miss entirely.',
  },
  {
    icon: '✏️',
    title: 'Edit Before You Send',
    description:
      'The AI draft is your starting point. Add a strategy note, tweak a recommendation, or remove a section — in a fast editor, not a word processor.',
  },
  {
    icon: '📈',
    title: 'Client Portal',
    description:
      "Every client gets a link to their report history. They read past reports and download PDFs without emailing you for last month's numbers.",
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For freelance consultants and solo practitioners',
    features: [
      'Up to 5 clients',
      'GA4 + Google Ads',
      'Monthly report schedule',
      'White-label PDF reports',
      'Email delivery',
    ],
    cta: 'Get Early Access',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$99',
    period: '/mo',
    description: 'For small agencies managing 10–20 clients',
    features: [
      'Up to 20 clients',
      'GA4 + Google Ads + Meta Ads',
      'Weekly or monthly schedule',
      'White-label + custom domain',
      'Client approval workflow',
      'Team seats (3 users)',
    ],
    cta: 'Get Early Access',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Agency',
    price: '$199',
    period: '/mo',
    description: 'For established agencies with 20+ clients',
    features: [
      'Unlimited clients',
      'All data sources',
      'Custom report templates',
      'Priority AI generation',
      'Dedicated onboarding',
      'Unlimited team seats',
    ],
    cta: 'Get Early Access',
    highlighted: false,
  },
];

const FAQS = [
  {
    q: 'How good is the AI-written narrative?',
    a: "We use Claude (Anthropic's latest model) with deep prompting built around marketing KPIs. In beta tests, agency owners said the narrative needed 'light editing' — not a full rewrite. The goal is 90% done. You always review before sending.",
  },
  {
    q: 'Can my clients tell it was written by AI?',
    a: 'Only if you tell them. The report comes from your domain, under your logo, in your brand colors. The writing is plain English — not robotically formal.',
  },
  {
    q: 'What data sources do you support at launch?',
    a: 'Launch: GA4 (Google Analytics 4), Google Ads, Meta Ads Manager. Roadmap: Google Search Console, LinkedIn Ads, HubSpot, and Shopify revenue data.',
  },
  {
    q: "What if I don't like what the AI wrote?",
    a: 'Every report goes through a fast editor before delivery. You can regenerate specific sections, edit the text directly, or add your own commentary. Nothing goes to your client without your review.',
  },
  {
    q: 'How is this different from AgencyAnalytics or Whatagraph?',
    a: "Those tools show dashboards and charts. Narratify writes the explanation of those charts in English — the part that takes you hours. We also cost significantly less: AgencyAnalytics charges $59 base + $20/client, so 10 clients = $259/mo. Narratify Growth covers 20 clients for $99/mo.",
  },
];

function WaitlistForm({ size = 'default' }: { size?: 'default' | 'large' }) {
  const [email, setEmail] = useState('');
  const [agencySize, setAgencySize] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, agency_size: agencySize, source: 'hero' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage("You're on the list! We'll be in touch within 24 hours.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl px-5 py-4 ${size === 'large' ? 'text-lg' : ''}`}
        style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}
      >
        <span className="text-2xl">🎉</span>
        <p className="text-emerald-300 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="you@youragency.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`flex-1 rounded-xl px-4 outline-none transition-colors ${size === 'large' ? 'py-4 text-lg' : 'py-3'}`}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#e2e8f0',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`rounded-xl font-semibold transition-opacity whitespace-nowrap ${size === 'large' ? 'px-7 py-4 text-lg' : 'px-5 py-3'}`}
          style={{
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            color: '#fff',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        >
          {status === 'loading' ? '...' : 'Get Early Access'}
        </button>
      </div>
      <select
        value={agencySize}
        onChange={(e) => setAgencySize(e.target.value)}
        className="rounded-xl px-4 py-2 text-sm"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: agencySize ? '#e2e8f0' : '#94a3b8',
        }}
      >
        <option value="" disabled>How many clients do you manage? (optional)</option>
        <option value="1-5">1–5 clients</option>
        <option value="6-15">6–15 clients</option>
        <option value="16-30">16–30 clients</option>
        <option value="30+">30+ clients</option>
      </select>
      {status === 'error' && <p className="text-rose-400 text-sm">{message}</p>}
      <p className="text-slate-500 text-xs">No spam. No credit card. Unsubscribe anytime.</p>
    </form>
  );
}

export default function Home() {
  return (
    <div style={{ background: '#08091a', minHeight: '100vh', color: '#e2e8f0' }}>

      {/* NAV */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(8,9,26,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
      >
        <span className="text-xl font-bold tracking-tight gradient-text">Narratify</span>
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#waitlist"
          className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
        >
          Get Early Access
        </a>
      </nav>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-20 text-center"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(129,140,248,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.1) 0%, transparent 60%)
          `,
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: '#a5b4fc' }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Now in early access — founding member pricing available
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Client Reports Written<br />
            <span className="gradient-text">by AI in 90 Seconds</span>
          </h1>

          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect GA4, Google Ads, and Meta Ads. Narratify generates the narrative report
            your team would have spent{' '}
            <strong className="text-slate-300">6 hours writing</strong> —
            white-labeled under your agency brand, delivered on schedule.
          </p>

          <div className="mt-10 flex justify-center" id="waitlist">
            <WaitlistForm size="large" />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No setup fee</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 14-day free trial</span>
          </div>
        </div>

        {/* Report preview mockup */}
        <div
          className="mt-16 mx-auto max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: '1px solid rgba(129,140,248,0.2)', background: 'rgba(15,23,42,0.9)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-3 text-xs text-slate-500">March 2026 Report — Acme Digital</span>
          </div>
          <div className="p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider">ACME DIGITAL</p>
                <h3 className="text-lg font-semibold text-white mt-0.5">Monthly Performance — March 2026</h3>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
              >
                AI Generated
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Organic Sessions', value: '12,847', delta: '+23%', up: true },
                { label: 'Paid Conversions', value: '342', delta: '+34%', up: true },
                { label: 'ROAS', value: '2.8x', delta: '-0.2x', up: false },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                  <p className="text-xl font-bold text-white">{m.value}</p>
                  <p className={`text-xs font-medium ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>{m.delta} vs last month</p>
                </div>
              ))}
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}
            >
              <p className="text-xs text-violet-400 font-semibold mb-2 uppercase tracking-wide">✍️ AI Narrative</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                March was your strongest month for organic traffic in 2026, driven by the blog content published in February now ranking on page 1 for three target keywords. Paid search conversions jumped 34% — the retargeting campaigns launched on March 12th delivered a 2.4x ROAS, above the account average.{' '}
                <span className="text-violet-300 font-medium">
                  We recommend scaling budget on Ad Set #3 by 20% in April, which is producing your lowest cost-per-acquisition at $18.40...
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">The Problem</p>
          <h2 className="text-center text-4xl font-bold mb-4">
            Reporting Is Stealing <span className="gradient-text">Your Best Hours</span>
          </h2>
          <p className="text-center text-slate-400 max-w-xl mx-auto mb-12">
            Every month, agencies lose 40–80 person-hours to a task that delivers zero strategic value and impresses no one.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="card-glow p-6">
                <span className="text-3xl mb-4 block">{p.icon}</span>
                <h3 className="text-lg font-semibold mb-2 text-white">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="px-6 py-20"
        style={{ background: 'rgba(129,140,248,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">How It Works</p>
          <h2 className="text-center text-4xl font-bold mb-14">
            From Data to Delivered Report<br />
            <span className="gradient-text">in Three Steps</span>
          </h2>
          <div className="flex flex-col gap-10">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                  style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)', color: '#a5b4fc' }}
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">Features</p>
          <h2 className="text-center text-4xl font-bold mb-4">
            Everything Your Agency <span className="gradient-text">Actually Needs</span>
          </h2>
          <p className="text-center text-slate-400 max-w-xl mx-auto mb-12">
            No bloat. No enterprise complexity. Built for independent agencies who bill for strategy, not spreadsheets.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-glow p-5">
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="px-6 py-20"
        style={{ background: 'rgba(129,140,248,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">Pricing</p>
          <h2 className="text-center text-4xl font-bold mb-4">
            Simple Pricing, <span className="gradient-text">No Per-Client Fees</span>
          </h2>
          <p className="text-center text-slate-400 max-w-xl mx-auto mb-3">
            AgencyAnalytics charges $20 per client per month. We don&apos;t. One flat price covers all your clients.
          </p>
          <p className="text-center text-sm text-violet-300 mb-12">
            ✦ Early access members lock in these prices forever
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: plan.highlighted ? 'rgba(129,140,248,0.1)' : 'rgba(15,23,42,0.8)',
                  border: plan.highlighted ? '2px solid rgba(129,140,248,0.5)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
                  >
                    {plan.badge}
                  </span>
                )}
                <p className="text-lg font-semibold text-white">{plan.name}</p>
                <p className="text-slate-400 text-sm mt-1 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-violet-400 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#waitlist"
                  className="block text-center rounded-xl py-3 font-semibold transition-opacity hover:opacity-90"
                  style={
                    plan.highlighted
                      ? { background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">FAQ</p>
          <h2 className="text-center text-4xl font-bold mb-12">
            Common <span className="gradient-text">Questions</span>
          </h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((item) => (
              <div key={item.q} className="card-glow p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        className="px-6 py-24 text-center"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(129,140,248,0.12) 0%, transparent 70%),
            rgba(8,9,26,1)
          `,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stop Spending Fridays<br />
            <span className="gradient-text">on Reports</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join the early access list. Founding members lock in current pricing and get onboarded first.
          </p>
          <div className="flex justify-center">
            <WaitlistForm size="large" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-lg font-bold gradient-text">Narratify</p>
          <p className="text-slate-500 text-sm">© 2026 Narratify. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="/legal/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="/legal/terms" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="mailto:hello@narratify.app" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
