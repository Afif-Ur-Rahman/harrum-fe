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

export interface StockAlertItem {
  id: string;
  stockId: string;
  variantId?: string;
  name: string;
  brand: string;
  color?: string;
  date: string;
  quantity: string;
  threshold: string;
  status: "Critical" | "Low" | "Moderate";
}

export interface TopProductItem {
  stockId: string;
  name: string;
  size?: string;
  units: number;
  revenue: number;
  share: number;
}

export interface SalesAnalyticsPoint {
  label: string;
  date: string;
  revenue: number;
  orders: number;
  netIncome: number;
}

export interface DashboardStatsResponse {
  message: string;
  data: {
    hero: DashboardHero;
    stats: DashboardStat[];
    stockAlerts: StockAlertItem[];
    topProducts: { products: TopProductItem[]; totalUnits: number };
    salesAnalytics: SalesAnalyticsPoint[];
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
