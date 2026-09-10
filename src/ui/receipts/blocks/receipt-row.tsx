"use client";

import { Banknote, Smartphone } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils";
import { Receipt } from "@/types";

export const ReceiptRow = ({ receipt }: { receipt: Receipt }) => {
  const isCash = receipt.paymentMethod === "cash";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
              isCash
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
                : "border-cyan-300/20 bg-cyan-400/10 text-cyan-300"
            }`}
          >
            {isCash ? (
              <Banknote className="h-4 w-4" />
            ) : (
              <Smartphone className="h-4 w-4" />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {receipt.paymentMethod}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatDateTime(receipt.createdAt, true)}
            </p>
          </div>
        </div>

        <span className="text-lg font-semibold text-emerald-300">
          {formatPrice(receipt.amount)}{" "}
          <span className="text-xs font-normal text-slate-400">PKR</span>
        </span>
      </div>

      {receipt.note && (
        <p className="mt-3 rounded-xl bg-black/20 px-3 py-2 text-xs text-slate-300">
          {receipt.note}
        </p>
      )}
    </div>
  );
};
