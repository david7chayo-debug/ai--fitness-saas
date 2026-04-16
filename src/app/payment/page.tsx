"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type Network = "TRON" | "ETHEREUM";

interface PaymentDetails {
  id: string;
  reference: string;
  amount: number;
  network: Network;
  toAddress: string;
  expiresAt: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [network, setNetwork] = useState<Network>("TRON");
  const [step, setStep] = useState<"select" | "pay" | "verify" | "done">("select");
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function initiatePayment() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network, planMonths: 1 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); return; }
      setPayment(data.payment);
      setStep("pay");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment() {
    if (!payment) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.id, txHash: txHash || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "No verificado"); return; }
      if (data.verified || data.status === "already_confirmed") {
        setStep("done");
      } else {
        setError(data.error || "Pago no encontrado aún. Espera unos minutos.");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  function copyAddress() {
    if (payment) {
      navigator.clipboard.writeText(payment.toAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (step === "done") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">✅</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">¡Pago confirmado!</h1>
            <p className="text-zinc-400 text-sm">Tu suscripción está activa. Ya puedes generar tu plan.</p>
          </div>
          <Button className="w-full" size="lg" onClick={() => router.push("/dashboard")}>
            Ir al Dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-green-400 font-bold text-xl">AI<span className="text-white">Fit</span></Link>
          <h1 className="text-xl font-bold mt-4 mb-1">Activar suscripción</h1>
          <p className="text-zinc-500 text-sm">$29.99 USDT / mes · Sin renovación automática</p>
        </div>

        {/* Select network */}
        {step === "select" && (
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm text-center mb-4">Selecciona la red de pago</p>
            {(["TRON", "ETHEREUM"] as Network[]).map((net) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  network === net
                    ? "border-green-500 bg-green-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  net === "TRON" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                  {net === "TRON" ? "₮" : "Ξ"}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">
                    USDT {net === "TRON" ? "TRC20" : "ERC20"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {net === "TRON" ? "Red Tron · Comisiones bajas" : "Red Ethereum · Gas fees aplican"}
                  </p>
                </div>
                {network === net && (
                  <div className="ml-auto w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button className="w-full" size="lg" loading={loading} onClick={initiatePayment}>
              Continuar con {network === "TRON" ? "TRC20" : "ERC20"}
            </Button>
          </div>
        )}

        {/* Pay step */}
        {step === "pay" && payment && (
          <div className="space-y-5">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Monto exacto</span>
                  <span className="text-green-400 font-bold text-xl">{payment.amount} USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Red</span>
                  <Badge variant={payment.network === "TRON" ? "red" : "blue"}>
                    {payment.network === "TRON" ? "TRC20" : "ERC20"}
                  </Badge>
                </div>
                <div>
                  <span className="text-zinc-400 text-sm block mb-2">Dirección de pago</span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-zinc-800 text-xs text-zinc-300 px-3 py-2 rounded-lg break-all font-mono">
                      {payment.toAddress}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="shrink-0 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs rounded-lg px-3 py-2">
                  ⚠️ Envía exactamente <strong>{payment.amount} USDT</strong> a esta dirección.
                  Tienes 2 horas para completar el pago.
                </div>
              </div>
            </Card>

            <Button
              className="w-full"
              size="lg"
              variant="secondary"
              onClick={() => setStep("verify")}
            >
              Ya envié el pago →
            </Button>
          </div>
        )}

        {/* Verify step */}
        {step === "verify" && payment && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">Verificar pago</h2>
              <p className="text-zinc-400 text-sm">
                Pega el hash de tu transacción (opcional en modo demo)
              </p>
            </div>

            <Input
              label="Hash de transacción (txHash)"
              placeholder="ej. abc123def456..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              hint="Puedes dejarlo vacío en modo demo para simular el pago"
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button className="w-full" size="lg" loading={loading} onClick={verifyPayment}>
              Verificar pago
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep("pay")}
            >
              ← Volver
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
