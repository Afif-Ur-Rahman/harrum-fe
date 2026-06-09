import type { ElementType } from "react";

export type Trend = "up" | "down";

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  subtitle: string;
  icon: ElementType;
  accent: string;
  glow: string;
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
