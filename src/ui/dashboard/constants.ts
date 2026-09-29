import { DollarSign, RotateCcw, TrendingUp, Wallet2 } from "lucide-react";

import type { StatItem, StatKey, StockAlertItem } from "@/types";

export const statStyles: Record<
  StatKey,
  Pick<StatItem, "icon" | "accent" | "glow" | "invertTrendColor">
> = {
  revenue: {
    icon: DollarSign,
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/20",
  },
  salesReturn: {
    icon: RotateCcw,
    accent: "from-rose-500 via-orange-500 to-amber-500",
    glow: "shadow-orange-500/20",
  },
  expenses: {
    icon: Wallet2,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    glow: "shadow-fuchsia-500/20",
    invertTrendColor: true,
  },
  netIncome: {
    icon: TrendingUp,
    accent: "from-sky-500 via-indigo-500 to-blue-600",
    glow: "shadow-blue-500/20",
  },
};

export const getStatusStyles = (status: StockAlertItem["status"]) => {
  if (status === "Critical") {
    return "bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-400/30";
  }

  if (status === "Low") {
    return "bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-300/30";
  }

  return "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30";
};

export const productColors = [
  "bg-cyan-400",
  "bg-pink-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-emerald-400",
];

export const productColorHex = ["#22d3ee", "#f472b6", "#a78bfa", "#f59e0b", "#34d399"];

export const salesBars: any[] = [
  { label: "Jan", purchase: 62, income: 85 },
  { label: "Feb", purchase: 74, income: 61 },
  { label: "Mar", purchase: 68, income: 92 },
  { label: "Apr", purchase: 84, income: 70 },
  { label: "May", purchase: 58, income: 88 },
  { label: "Jun", purchase: 79, income: 96 },
];
