"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-zinc-900 border ${
            error ? "border-red-500 focus:ring-red-500" : "border-zinc-700 focus:ring-green-500"
          } text-white rounded-xl px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:border-transparent transition-all
          disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
