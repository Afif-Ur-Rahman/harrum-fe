"use client";

import { Hourglass, Loader2 } from "lucide-react";

import { formatPrice } from "@/utils";

interface DueAmountPillProps {
  amount: number;
  loading?: boolean;
  className?: string;
}

export const DueAmountPill = ({ amount, loading = false, className = "" }: DueAmountPillProps) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm whitespace-nowrap shadow-lg shadow-black/10 ${className}`}
    >
      <Hourglass className="h-4 w-4 shrink-0 text-rose-300" />
      <span className="font-medium text-slate-400">Due Amount:</span>

      <span className="flex items-center font-bold text-rose-300">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-rose-300" />
        ) : (
          formatPrice(amount) || 0
        )}
        <span className="ml-1 text-xs font-normal text-slate-400">PKR</span>
      </span>
    </div>
  );
};
