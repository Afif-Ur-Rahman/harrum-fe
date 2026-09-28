import { useEffect, useState } from "react";

import { getDashboardStats } from "@/api/api-call/dashboard";
import { DashboardStat } from "@/types";
import { showToast } from "@/utils/toast";

export const useDashboard = () => {
  const statusOptions = [
    { value: "Today", label: "Today" },
    { value: "Current week", label: "Current week" },
    { value: "Current Month", label: "Current Month" },
    { value: "custom", label: "Custom" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("Current Month");
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);

      const res = await getDashboardStats();

      if (res?.error) {
        showToast("error", res.error);
        setStatsLoading(false);
        return;
      }

      setStats(res?.data?.data?.stats || []);
      setStatsLoading(false);
    };

    fetchStats();
  }, []);

  return {
    statusOptions,
    selectedStatus,
    setSelectedStatus,
    stats,
    statsLoading,
  };
};
