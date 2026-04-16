"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Mi Plan" },
  { href: "/checkin", label: "Check-in" },
  { href: "/chat", label: "Coach IA" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-screen-sm mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-green-400 font-bold text-lg tracking-tight">
          AI<span className="text-white">Fit</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === item.href
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
