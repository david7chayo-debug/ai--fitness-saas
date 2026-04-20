export const metadata = {
  title: 'Terms of Service — Narratify',
};

export default function TermsPage() {
  return (
    <div style={{ background: '#08091a', minHeight: '100vh', color: '#e2e8f0' }}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <a href="/" className="text-violet-400 text-sm hover:text-violet-300 mb-8 block">← Back to Narratify</a>
        <h1 className="text-4xl font-bold mb-2 text-white">Terms of Service</h1>
        <p className="text-slate-500 mb-10">Last updated: April 20, 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance</h2>
            <p>By using Narratify you agree to these terms. If you are using Narratify on behalf of an agency or company, you represent that you have authority to bind that entity to these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. The Service</h2>
            <p>Narratify provides automated, AI-generated marketing report drafts by connecting to third-party marketing platforms (Google Analytics, Google Ads, Meta Ads). All generated content is a draft for your review. You are responsible for reviewing reports before delivering them to your clients.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Your Data and Permissions</h2>
            <p>By connecting your marketing accounts, you grant Narratify read-only access to retrieve data necessary to generate reports. You represent that you have the right to grant this access. You can revoke access at any time from your account settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Subscriptions and Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Subscriptions are billed monthly or annually in advance.</li>
              <li>You may cancel at any time. Cancellation takes effect at the end of the current billing period — no partial refunds for unused time, except as required by law.</li>
              <li>We reserve the right to change pricing with 30 days notice. Founding member pricing (locked at signup) is exempt from price increases for 24 months.</li>
              <li>Failed payments will be retried over 7 days. Access is suspended if payment is not recovered after that period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p>You may not use Narratify to: violate any law, deceive clients with materially falsified data, access accounts you do not have permission to access, or attempt to reverse-engineer the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. AI-Generated Content Disclaimer</h2>
            <p>Narratify uses AI to generate report narratives. AI-generated content may contain errors, misinterpretations, or hallucinations. You are solely responsible for reviewing and verifying the accuracy of reports before sharing them with clients. Narratify is not liable for decisions made based on AI-generated report content.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Narratify&apos;s liability is limited to the amount you paid in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Delaware, USA. Disputes will be resolved by binding arbitration under AAA rules, except for injunctive relief claims.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>We will notify you by email of material changes at least 30 days before they take effect. Continued use after the effective date constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>Legal questions: hello@narratify.app</p>
          </section>
        </div>
      </div>
    </div>
  );
}
