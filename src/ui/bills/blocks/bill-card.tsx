"use client";

import { formatDateTime, formatPrice } from "@/utils";
import { Bill } from "@/types";

export const BillCard = ({ bill }: { bill: Bill }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {bill.billId}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatDateTime(bill.createdAt, true)}
            </p>
          </div>
        </div>

        <span className="shrink-0 text-lg font-semibold text-rose-300">
          {formatPrice(bill.amount)}{" "}
          <span className="text-xs font-normal text-slate-400">PKR</span>
        </span>
      </div>

      {bill.note && (
        <p className="mt-3 rounded-xl bg-black/20 px-3 py-2 text-xs text-slate-300">
          {bill.note}
        </p>
      )}
    </div>
  );
};
