import { Sparkles } from "lucide-react";

import type { DashboardFilterValue } from "@/types";

import { DashboardFilterBar } from "./dashboard-filter";

interface DashboardHeroProps {
  totalOrders: number;
  orderGrowth: number;
  loading?: boolean;
  filter: DashboardFilterValue;
  onFilterChange: (value: DashboardFilterValue) => void;
}

export const DashboardHero = ({
  totalOrders,
  orderGrowth,
  loading = false,
  filter,
  onFilterChange,
}: DashboardHeroProps) => {
  const heroStats = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      valueClassName: "text-white",
      className: "col-span-2 bg-black/20 sm:col-span-1",
    },
    {
      label: "Order Growth",
      value: `${orderGrowth >= 0 ? "+" : ""}${orderGrowth.toFixed(1)}%`,
      valueClassName: orderGrowth >= 0 ? "text-emerald-300" : "text-rose-300",
      className: "col-span-2 bg-linear-to-r from-cyan-500/20 to-fuchsia-500/20 sm:col-span-1",
    },
  ];

  return (
    <section className="relative rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)] lg:block" />
      </div>

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-cyan-200 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Performance Overview
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Welcome Back,</h1>

          <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-400">
            Monitor revenue, stock pressure, product demand, and purchase momentum from one
            responsive dashboard built for desktop, tablet, and mobile.
          </p>

          <div className="mt-4">
            <DashboardFilterBar value={filter} onChange={onFilterChange} disabled={loading} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-22 w-32 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))
            : heroStats.map(item => (
                <div
                  key={item.label}
                  className={`rounded-2xl border border-white/10 p-4 ${item.className}`}
                >
                  <p className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                    {item.label}
                  </p>

                  <p className={`text-2xl font-bold ${item.valueClassName}`}>{item.value}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};
