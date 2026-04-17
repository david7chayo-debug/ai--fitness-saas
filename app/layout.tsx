import './globals.css';
import type { Metadata } from 'next';
import TopNav from '../components/TopNav';

export const metadata: Metadata = {
  title: 'AI Fitness Coach',
  description: 'Fitness and nutrition planning with AI-powered coaching.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
