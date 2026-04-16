"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-zinc-900 border ${
            error ? "border-red-500 focus:ring-red-500" : "border-zinc-700 focus:ring-green-500"
          } text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:border-transparent transition-all
          disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
