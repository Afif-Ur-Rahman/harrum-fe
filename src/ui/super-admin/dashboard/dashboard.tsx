"use client";

import {
  DashboardHero,
  ProductMixCard,
  SalesAnalyticsCard,
  StatCard,
  StockAlertCard,
  TopProductsCard,
} from "./blocks";
import { stats } from "./data";

export const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <DashboardHero />

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <SalesAnalyticsCard />
            <ProductMixCard />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
            <StockAlertCard />
            <TopProductsCard />
          </section>
        </div>
      </div>
    </div>
  );
};
