import { useEffect, useState } from "react";

import { dismissStockAlert, getDashboardStats } from "@/api/api-call";
import { DashboardStat, StockAlertItem, TopProductItem } from "@/types";
import { showToast } from "@/utils/toast";

export const useDashboard = () => {
  const statusOptions = [
    { value: "Today", label: "Today" },
    { value: "Current week", label: "Current week" },
    { value: "Current Month", label: "Current Month" },
    { value: "custom", label: "Custom" },
  ];

  const [selectedStatus, setSelectedStatus] = useState("Current Month");

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

  const [statsLoading, setStatsLoading] = useState(true);

  const onDismissAlert = async (alert: StockAlertItem) => {
    const previous = stockAlerts;

    setStockAlerts(prev => prev.filter(item => item.id !== alert.id));

    const res = await dismissStockAlert(alert.stockId, alert.variantId);

    if (!res || res.error) {
      setStockAlerts(previous);
      showToast("error", res?.error || "Failed to dismiss alert");
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);

      const res = await getDashboardStats();

      if (res?.error) {
        showToast("error", res.error);
        setStatsLoading(false);
        return;
      }

      const data = res?.data?.data;

      setStats(data?.stats || []);

      setHero(
        data?.hero || {
          totalOrders: 0,
          orderGrowth: 0,
        },
      );

      setStockAlerts(data?.stockAlerts || []);

      setTopProducts(data?.topProducts || { products: [], totalUnits: 0 });

      setStatsLoading(false);
    };

    fetchStats();
  }, []);

  return {
    statusOptions,
    selectedStatus,
    setSelectedStatus,
    stats,
    hero,
    stockAlerts,
    topProducts,
    statsLoading,
    onDismissAlert,
  };
};
