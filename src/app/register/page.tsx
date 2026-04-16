"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          Array.isArray(data.error)
            ? data.error[0]?.message || "Error al registrar"
            : data.error || "Error al registrar"
        );
        return;
      }

      router.push("/onboarding");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-green-400 font-bold text-2xl">
            AI<span className="text-white">Fit</span>
          </Link>
          <h1 className="text-xl font-bold text-white mt-4 mb-1">Crea tu cuenta</h1>
          <p className="text-zinc-500 text-sm">Gratis — activas con pago en USDT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la contraseña"
            value={form.confirm}
            onChange={(e) => update("confirm", e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
