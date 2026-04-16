import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-screen-sm mx-auto">
        <span className="text-green-400 font-bold text-xl">
          AI<span className="text-white">Fit</span>
        </span>
        <div className="flex gap-3">
          <Link href="/login" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="bg-green-500 hover:bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Empezar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 max-w-screen-sm mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          IA + Nutrición + Entrenamiento
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
          Tu coach personal
          <br />
          <span className="text-green-400">de fitness real</span>
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          Plan de nutrición y entrenamiento calculado con ciencia real.
          La IA solo explica — los números los hace el sistema.
          Ajustes semanales automáticos según tu progreso.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-green-500/20"
        >
          Comenzar ahora — $29.99 USDT/mes
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="text-zinc-600 text-xs mt-3">Pago en USDT TRC20 o ERC20 · Sin tarjeta · Sin suscripción oculta</p>
      </section>

      {/* Features */}
      <section className="px-6 pb-16 max-w-screen-sm mx-auto">
        <div className="grid gap-4">
          {[
            {
              icon: "🔬",
              title: "Cálculo real, no magia",
              desc: "BMR, TDEE y macros calculados con Mifflin-St Jeor. Sin estimaciones genéricas.",
            },
            {
              icon: "📈",
              title: "Ajuste semanal automático",
              desc: "Cada check-in recalibra tu plan. Sin estancamientos.",
            },
            {
              icon: "🤖",
              title: "Coach IA disponible 24/7",
              desc: "Pregunta lo que quieras. Respuestas basadas en tu plan real.",
            },
            {
              icon: "₮",
              title: "Pago en cripto, privacidad total",
              desc: "Solo USDT. Sin bancos, sin datos de tarjeta.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-start gap-4"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-6 pb-16 max-w-screen-sm mx-auto text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">¿Listo para empezar?</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Completa tu perfil en 2 minutos y recibe tu plan hoy mismo.
          </p>
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-all"
          >
            Crear cuenta gratuita
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-6 text-center text-zinc-600 text-xs">
        © {new Date().getFullYear()} AIFit — Todos los derechos reservados
      </footer>
    </main>
  );
}
