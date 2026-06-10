"use client";

import { Package, TrendingUp, AlertTriangle } from "lucide-react";

const formatCurrency = (value: number) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const StockStats = ({
  totalStocks,
  totalValue,
  outOfStock,
}: {
  totalStocks: number;
  totalValue: number;
  outOfStock: number;
}) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%)]" />

        <div className="relative z-10">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <Package className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Total Items
          </p>

          <p className="text-2xl font-bold text-cyan-300">{totalStocks}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_32%)]" />

        <div className="relative z-10">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <TrendingUp className="h-4 w-4 text-blue-300" />
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Total Sale Value
          </p>

          <p className="text-2xl font-bold text-blue-300">
            {formatCurrency(totalValue)}
            <span className="ml-1 text-sm font-normal text-slate-400">PKR</span>
          </p>
        </div>
      </div>

      <div className="relative col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:col-span-1">
        <div
          className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.14),transparent_32%)]`}
        />

        <div className="relative z-10">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <AlertTriangle className={`h-4 w-4 text-red-300`} />
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Out of Stock
          </p>

          <p className={`text-2xl font-bold text-red-300`}>{outOfStock}</p>
        </div>
      </div>
    </div>
  );
};
