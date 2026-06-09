import { DollarSign, RotateCcw, ShoppingCart, TrendingUp } from "lucide-react";

import type {
  SalesBarItem,
  StatItem,
  StockAlertItem,
  TopProductItem,
} from "./types";

export const stats: StatItem[] = [
  {
    title: "Total Revenue",
    value: "$84.2K",
    change: "+12.4%",
    trend: "up",
    subtitle: "vs last month",
    icon: DollarSign,
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/20",
  },
  {
    title: "Sales Return",
    value: "1,248",
    change: "-3.1%",
    trend: "down",
    subtitle: "refund requests",
    icon: RotateCcw,
    accent: "from-rose-500 via-orange-500 to-amber-500",
    glow: "shadow-orange-500/20",
  },
  {
    title: "Purchases",
    value: "5,620",
    change: "+8.2%",
    trend: "up",
    subtitle: "processed orders",
    icon: ShoppingCart,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    glow: "shadow-fuchsia-500/20",
  },
  {
    title: "Net Income",
    value: "$23.9K",
    change: "+18.6%",
    trend: "up",
    subtitle: "operating profit",
    icon: TrendingUp,
    accent: "from-sky-500 via-indigo-500 to-blue-600",
    glow: "shadow-blue-500/20",
  },
];

export const salesBars: SalesBarItem[] = [
  { label: "Jan", purchase: 62, income: 85 },
  { label: "Feb", purchase: 74, income: 61 },
  { label: "Mar", purchase: 68, income: 92 },
  { label: "Apr", purchase: 84, income: 70 },
  { label: "May", purchase: 58, income: 88 },
  { label: "Jun", purchase: 79, income: 96 },
];

export const stockAlerts: StockAlertItem[] = [
  {
    id: "#ST-1021",
    date: "07 May 2026",
    quantity: "12 pcs",
    threshold: "20 pcs",
    status: "Critical",
  },
  {
    id: "#ST-1038",
    date: "07 May 2026",
    quantity: "18 pcs",
    threshold: "25 pcs",
    status: "Low",
  },
  {
    id: "#ST-1052",
    date: "06 May 2026",
    quantity: "09 pcs",
    threshold: "15 pcs",
    status: "Critical",
  },
  {
    id: "#ST-1084",
    date: "05 May 2026",
    quantity: "21 pcs",
    threshold: "30 pcs",
    status: "Moderate",
  },
];

export const topProducts: TopProductItem[] = [
  { name: "Premium Hoodie", orders: 426, revenue: "$12.4K", share: 34 },
  { name: "Oversized T-Shirt", orders: 388, revenue: "$10.1K", share: 28 },
  { name: "Slim Fit Jeans", orders: 310, revenue: "$8.7K", share: 22 },
  { name: "Casual Shirt", orders: 215, revenue: "$6.2K", share: 16 },
];

export const productColors = [
  "bg-cyan-400",
  "bg-pink-400",
  "bg-violet-400",
  "bg-amber-400",
];
