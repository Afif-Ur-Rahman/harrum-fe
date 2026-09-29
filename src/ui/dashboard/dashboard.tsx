"use client";

import { PageLayout } from "@/components/layout";

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
  const { stats, hero, stockAlerts, statsLoading, onDismissAlert } = useDashboard();

  return (
    <PageLayout>
      <DashboardHero
        totalOrders={hero.totalOrders}
        orderGrowth={hero.orderGrowth}
        loading={statsLoading}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[26px] border border-white/10 bg-white/8"
              />
            ))
          : stats.map(stat => (
              <StatCard
                key={stat.key}
                item={{
                  ...stat,
                  ...statStyles[stat.key],
                }}
              />
            ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:h-165 xl:min-h-0 xl:grid-cols-[1.7fr_1fr]">
        <StockAlertCard alerts={stockAlerts} loading={statsLoading} onDismiss={onDismissAlert} />
        <ProductMixCard />
      </section>

      <section>
        <SalesAnalyticsCard />
      </section>
    </PageLayout>
  );
};
