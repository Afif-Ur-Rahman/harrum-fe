import type { ElementType } from "react";

export type Trend = "up" | "down";

export type StatKey = "revenue" | "salesReturn" | "expenses" | "netIncome";

export interface DashboardHero {
  totalOrders: number;
  orderGrowth: number;
}

export interface DashboardStat {
  key: StatKey;
  title: string;
  value: string;
  change: string;
  trend: Trend;
  subtitle: string;
}

export interface DashboardStatsResponse {
  message: string;
  data: {
    hero: DashboardHero;
    stats: DashboardStat[];
  };
}

export interface ResponseForDashboardStats {
  state: boolean;
  data?: DashboardStatsResponse;
  error?: string;
}

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  subtitle: string;
  icon: ElementType;
  accent: string;
  glow: string;
  invertTrendColor?: boolean;
}

export interface SalesBarItem {
  label: string;
  purchase: number;
  income: number;
}

export interface StockAlertItem {
  id: string;
  date: string;
  quantity: string;
  threshold: string;
  status: "Critical" | "Low" | "Moderate";
}

export interface TopProductItem {
  name: string;
  orders: number;
  revenue: string;
  share: number;
}
