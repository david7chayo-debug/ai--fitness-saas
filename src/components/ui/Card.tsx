import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddings = { sm: "p-4", md: "p-5", lg: "p-6" };
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
