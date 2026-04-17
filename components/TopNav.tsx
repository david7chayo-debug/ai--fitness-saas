'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/plan', label: 'Plan' },
  { href: '/checkin', label: 'Check-in' },
  { href: '/chat', label: 'Coach' },
  { href: '/payment', label: 'Payment' },
];

export default function TopNav() {
  const pathname = usePathname();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="font-semibold text-white">
          AI Fitness Coach
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          {token && navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 transition ${pathname === item.href ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/80'}`}>
              {item.label}
            </Link>
          ))}
          {token ? (
            <button
              className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-3 py-2 hover:bg-slate-800/80">
                Login
              </Link>
              <Link href="/register" className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
