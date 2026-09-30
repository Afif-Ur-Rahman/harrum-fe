import { useCallback, useEffect, useRef, useState } from "react";

import { dismissStockAlert, getDashboardStats } from "@/api/api-call";
import {
  DashboardFilter,
  DashboardFilterValue,
  DashboardStat,
  SalesAnalyticsPoint,
  StockAlertItem,
  TopProductItem,
} from "@/types";
import { showToast } from "@/utils/toast";

export const DASHBOARD_FILTER_OPTIONS: { value: DashboardFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last_week", label: "Last week" },
  { value: "last_month", label: "Last month" },
  { value: "custom", label: "Custom" },
];

const DEFAULT_FILTER: DashboardFilterValue = {
  filter: "last_week",
  from: "",
  to: "",
};

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getPeriodLabel = ({ filter, from, to }: DashboardFilterValue) => {
  if (filter === "today") return "today";
  if (filter === "last_week") return "the last 7 days";
  if (filter === "last_month") return "the last 30 days";

  return from && to ? `${formatDate(from)} – ${formatDate(to)}` : "the selected dates";
};

export const useDashboard = () => {
  const [filter, setFilter] = useState<DashboardFilterValue>(DEFAULT_FILTER);

  const [hero, setHero] = useState({
    totalOrders: 0,
    orderGrowth: 0,
  });

  const [stats, setStats] = useState<DashboardStat[]>([]);

  const [stockAlerts, setStockAlerts] = useState<StockAlertItem[]>([]);

  const [topProducts, setTopProducts] = useState<{
    products: TopProductItem[];
    totalUnits: number;
  }>({ products: [], totalUnits: 0 });

  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalyticsPoint[]>([]);

  const [statsLoading, setStatsLoading] = useState(true);

  // Only the latest request is allowed to update state
  const requestId = useRef(0);

  const fetchStats = useCallback(async (value: DashboardFilterValue) => {
    const currentRequest = ++requestId.current;

    setStatsLoading(true);

    const res = await getDashboardStats({
      filter: value.filter,
      from: value.from || undefined,
      to: value.to || undefined,
    });

    if (currentRequest !== requestId.current) return;

    if (!res || res.error) {
      showToast("error", res?.error || "Failed to load dashboard stats");
      setStatsLoading(false);
      return;
    }

    const data = res.data?.data;

    setHero(
      data?.hero || {
        totalOrders: 0,
        orderGrowth: 0,
      },
    );
    setStats(data?.stats || []);
    setStockAlerts(data?.stockAlerts || []);
    setTopProducts(data?.topProducts || { products: [], totalUnits: 0 });
    setSalesAnalytics(data?.salesAnalytics || []);

    setStatsLoading(false);
  }, []);

  useEffect(() => {
    (() => fetchStats(filter))();
  }, [filter, fetchStats]);

  const onFilterChange = (value: DashboardFilterValue) => {
    setFilter(prev =>
      prev.filter === value.filter && prev.from === value.from && prev.to === value.to
        ? prev
        : value,
    );
  };

  const onDismissAlert = async (alert: StockAlertItem) => {
    const previous = stockAlerts;

    setStockAlerts(prev => prev.filter(item => item.id !== alert.id));

    const res = await dismissStockAlert(alert.stockId, alert.variantId);

    if (!res || res.error) {
      setStockAlerts(previous);
      showToast("error", res?.error || "Failed to dismiss alert");
    }
  };

  return {
    filter,
    onFilterChange,
    periodLabel: getPeriodLabel(filter),
    hero,
    stats,
    stockAlerts,
    topProducts,
    salesAnalytics,
    statsLoading,
    onDismissAlert,
  };
};
