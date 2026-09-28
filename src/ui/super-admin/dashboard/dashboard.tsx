"use client";

import {
  DashboardHero,
  ProductMixCard,
  SalesAnalyticsCard,
  StatCard,
  StockAlertCard,
} from "./blocks";
import { statStyles } from "./constants";
import { useDashboard } from "./useDashboard";

export const SuperAdminDashboard = () => {
  const { stats, statsLoading } = useDashboard();

  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute top-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <DashboardHero />

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-[26px] border border-white/10 bg-white/8"
                  />
                ))
              : stats.map(stat => (
                  <StatCard key={stat.key} item={{ ...stat, ...statStyles[stat.key] }} />
                ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <StockAlertCard />
            <ProductMixCard />
          </section>

          <section className="">
            <SalesAnalyticsCard />
          </section>
        </div>
      </div>
    </div>
  );
};
