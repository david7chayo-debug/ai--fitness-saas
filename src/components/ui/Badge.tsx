import { ReactNode } from "react";

type BadgeVariant = "green" | "yellow" | "red" | "blue" | "gray";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  gray: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}
