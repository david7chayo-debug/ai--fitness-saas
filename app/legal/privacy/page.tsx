export const metadata = {
  title: 'Privacy Policy — Narratify',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: '#08091a', minHeight: '100vh', color: '#e2e8f0' }}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <a href="/" className="text-violet-400 text-sm hover:text-violet-300 mb-8 block">← Back to Narratify</a>
        <h1 className="text-4xl font-bold mb-2 text-white">Privacy Policy</h1>
        <p className="text-slate-500 mb-10">Last updated: April 20, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Who We Are</h2>
            <p>Narratify (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the Narratify marketing reporting service. Our contact email is hello@narratify.app.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account data</strong>: email address, agency name, billing information (processed by Stripe — we never store card numbers).</li>
              <li><strong>Marketing data</strong>: we access your Google Analytics, Google Ads, and Meta Ads data solely to generate reports on your behalf. We do not store your raw marketing data beyond what is needed to generate the current report.</li>
              <li><strong>Usage data</strong>: pages visited, features used, error logs. Used to improve the product.</li>
              <li><strong>Communications</strong>: emails you send to us for support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To deliver the Narratify service (generate and deliver your reports)</li>
              <li>To process payments via Stripe</li>
              <li>To send transactional emails (account confirmations, report delivery, invoices)</li>
              <li>To improve the product based on aggregated, anonymized usage patterns</li>
            </ul>
            <p className="mt-3">We do not sell your data. We do not use your marketing data to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Processors</h2>
            <p>We use the following third-party processors:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — database hosting (EU/US regions)</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Anthropic</strong> — AI report generation (your marketing data is sent to Anthropic&apos;s API to generate narrative text; Anthropic does not train on API data per their policy)</li>
              <li><strong>Vercel</strong> — application hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Generated reports are stored for 12 months. You can request deletion of all your data at any time by emailing hello@narratify.app — we will complete deletion within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. GDPR Rights (EU/UK Users)</h2>
            <p>If you are in the EU or UK, you have the right to: access your personal data, correct inaccurate data, request deletion, restrict processing, and data portability. To exercise any right, email hello@narratify.app.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>We use only essential cookies for session management. We use privacy-friendly analytics (no cross-site tracking). You can disable cookies in your browser without losing core functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p>We will notify you by email of material changes to this policy at least 30 days before they take effect.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>Questions about this policy: hello@narratify.app</p>
          </section>
        </div>
      </div>
    </div>
  );
}
