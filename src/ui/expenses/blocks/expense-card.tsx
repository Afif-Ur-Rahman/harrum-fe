"use client";

import { Banknote, Smartphone, Tag } from "lucide-react";

import { Expense } from "@/types";
import { formatDateTime, formatPrice } from "@/utils";

export const ExpenseCard = ({ expense }: { expense: Expense }) => {
  const isCash = expense.paymentMethod === "cash";

  const createdBy =
    typeof expense.createdBy === "object" ? expense.createdBy.username : expense.createdBy;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
              isCash
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
                : "border-cyan-300/20 bg-cyan-400/10 text-cyan-300"
            }`}
          >
            {isCash ? <Banknote className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {expense.paymentMethod}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(expense.date)}</p>
          </div>
        </div>

        <span className="shrink-0 text-lg font-semibold text-rose-300">
          {formatPrice(expense.amount)}{" "}
          <span className="text-xs font-normal text-slate-400">PKR</span>
        </span>
      </div>

      <p className="rounded-xl bg-black/20 px-3 py-2 text-sm text-slate-300">{expense.note}</p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
          <Tag className="h-3 w-3 text-cyan-300" />
          {expense.category}
        </span>

        {createdBy && <span className="text-xs text-slate-500">by {createdBy}</span>}
      </div>
    </div>
  );
};
