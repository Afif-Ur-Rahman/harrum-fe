"use client";

import { CheckCircle2, Hourglass, Receipt } from "lucide-react";
import { BillSummary } from "@/types";
import { formatPrice } from "@/utils";

const getCards = (summary: BillSummary) => [
  {
    label: "Total Amount",
    value: summary.totalAmount,
    icon: Receipt,
    iconClass: "text-cyan-300",
    valueClass: "text-cyan-300",
    glow: "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%)]",
    className: "",
  },
  {
    label: "Paid Amount",
    value: summary.paidAmount,
    icon: CheckCircle2,
    iconClass: "text-emerald-300",
    valueClass: "text-emerald-300",
    glow: "bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_32%)]",
    className: "",
  },
  {
    label: "Remaining Amount",
    value: summary.remainingAmount,
    icon: Hourglass,
    iconClass: "text-rose-300",
    valueClass: "text-rose-300",
    glow: "bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.14),transparent_32%)]",
    className: "col-span-2 sm:col-span-1",
  },
];

export const BillsSummary = ({ summary }: { summary: BillSummary }) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {getCards(summary).map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 ${card.className}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 ${card.glow}`}
            />

            <div className="relative z-10">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Icon className={`h-4 w-4 ${card.iconClass}`} />
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {card.label}
              </p>

              <p className={`text-2xl font-bold ${card.valueClass}`}>
                {formatPrice(card.value) || 0}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  PKR
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
