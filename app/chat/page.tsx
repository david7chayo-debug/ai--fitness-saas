'use client';

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello! I am your AI coach. Ask me anything about your plan, meals, or workouts.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', text: input }];
    setMessages(nextMessages);
    setInput('');

    const token = localStorage.getItem('token');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'I could not connect to the coach service right now.' }]);
      return;
    }

    setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 text-slate-100 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">AI chat coach</h1>
        <p className="mt-3 text-slate-400">Ask questions, get coaching, and refine your plan with conversational guidance.</p>

        <div className="mt-8 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          {messages.map((message, index) => (
            <div key={index} className={`rounded-3xl p-4 ${message.role === 'assistant' ? 'bg-slate-800 text-slate-200' : 'bg-cyan-500/10 text-slate-100'}`}>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{message.role === 'assistant' ? 'Coach' : 'You'}</p>
              <p className="mt-2 whitespace-pre-line text-slate-100">{message.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="mt-6 flex gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask your coach..."
            className="min-w-0 flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
