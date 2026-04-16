import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Fitness Coach — Tu coach personal de nutrición y entrenamiento",
  description: "Plan personalizado de nutrición y entrenamiento con IA. Ajustes semanales automáticos. Pago en USDT.",
  keywords: ["fitness", "nutrición", "entrenamiento", "IA", "coach", "plan personalizado"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
