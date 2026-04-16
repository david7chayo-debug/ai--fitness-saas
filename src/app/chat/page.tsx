"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/chat")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setMessages(data.messages || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "USER",
      content: text,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar mensaje");
        setMessages((m) => m.filter((msg) => msg.id !== userMsg.id));
        return;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ASSISTANT",
        content: data.reply,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      setError("Error de conexión");
      setMessages((m) => m.filter((msg) => msg.id !== userMsg.id));
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const QUICK_QUESTIONS = [
    "¿Cuánta proteína necesito?",
    "¿Puedo hacer cardio hoy?",
    "Tengo hambre entre comidas",
    "¿Cómo evitar el estancamiento?",
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-screen-sm mx-auto w-full pt-14">
        {/* Header */}
        <div className="px-4 py-4 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Alex · Coach IA</p>
              <p className="text-xs text-zinc-500">Responde en español · disponible 24/7</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-36">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-white font-semibold mb-1">Hola, soy Alex</p>
              <p className="text-zinc-400 text-sm mb-6">
                Tu coach de fitness y nutrición. Pregúntame lo que necesites.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="text-left p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 hover:border-zinc-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ASSISTANT" && (
                <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <span className="text-sm">🤖</span>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "USER"
                    ? "bg-green-500 text-black font-medium rounded-br-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center mr-2 mt-0.5">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 text-center">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-md border-t border-zinc-900 px-4 py-3">
          <div className="max-w-screen-sm mx-auto flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregúntale a Alex..."
              rows={1}
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none max-h-32"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              loading={sending}
              className="shrink-0 h-12 w-12 p-0 rounded-xl"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
