import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Narratify — AI-Narrated Marketing Reports for Agencies',
  description: 'Connect GA4, Google Ads, and Meta Ads. Narratify writes the narrative client report your team would have spent 6 hours on. White-labeled, scheduled, and delivered automatically.',
  openGraph: {
    title: 'Narratify — AI Marketing Reports for Agencies',
    description: 'Turn 6 hours of reporting into 5 minutes. AI-written narrative reports, white-labeled under your agency brand.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
