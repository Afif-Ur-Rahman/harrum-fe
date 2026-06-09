import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getSuperAdminStats,
  restaurantStatusUpdate,
  subscriptionStatusUpdate,
} from "@/api/api-call/dashboard-api";
import {
  ReportedRestaurants,
  SuperAdminRestaurant,
  SuperAdminSubscriptionStat,
} from "@/types/super-admin";

type Chart = {
  categories: string[];
  series: { name: string; data: number[] }[];
};

type Stat = {
  label: string;
  value: string | number;
};

export function useDashboard() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Total Restaurants", value: "Loading..." },
    { label: "Active Subscriptions", value: "Loading..." },
    // { label: "Reported Restaurants", value: "Loading..." },
  ]);

  const statusOptions = [
    { value: "Today", label: "Today" },
    { value: "Current week", label: "Current week" },
    { value: "Current Month", label: "Current Month" },
    { value: "custom", label: "Custom" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("Current Month");

  const form = useForm<{ from: string; to: string }>({
    defaultValues: {
      from: "",
      to: "",
    },
  });
  const { from, to } = form.watch();

  const [totalRestaurants, setTotalRestaurants] = useState<
    SuperAdminRestaurant[]
  >([]);
  const [reportedRestaurants, setReportedRestaurants] = useState<
    ReportedRestaurants[]
  >([]);
  const [subscriptionStats, setSubscriptionStats] = useState<
    SuperAdminSubscriptionStat[]
  >([]);
  const [chart, setChart] = useState<Chart | null>(null);

  const handleStatusToggle = async (
    restaurantId: string,
    currentStatus: boolean,
  ) => {
    const updatedStatus = !currentStatus;

    setTotalRestaurants((prev) =>
      prev.map((r) =>
        r._id === restaurantId ? { ...r, isVerified: updatedStatus } : r,
      ),
    );

    const res = await restaurantStatusUpdate(restaurantId, updatedStatus);

    if (!res) {
      setTotalRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId ? { ...r, isVerified: currentStatus } : r,
        ),
      );
    }
  };

  const handleSubscriptionStatusToggle = async (
    subscriptionId: string,
    currentStatus: "active" | "cancelled" | "pending" | "expired",
  ) => {
    const nextStatus = currentStatus === "pending" ? "active" : currentStatus;

    setSubscriptionStats((prev) =>
      prev.map((s) =>
        s._id === subscriptionId ? { ...s, status: nextStatus } : s,
      ),
    );

    const res = await subscriptionStatusUpdate(subscriptionId, nextStatus);

    if (!res) {
      setSubscriptionStats((prev) =>
        prev.map((s) =>
          s._id === subscriptionId ? { ...s, status: currentStatus } : s,
        ),
      );
    }
  };

  // Fetch stats based on selected status and optional date range
  const getStats = async (
    status: string,
    fromDate?: string,
    toDate?: string,
  ) => {
    const response = await getSuperAdminStats(status, fromDate, toDate);
    if (!response?.data) return;
    setStats([
      {
        label: "Total Restaurants",
        value: response.data?.counts?.restaurantCount ?? 0,
      },
      {
        label: "Active Subscriptions",
        value: response.data?.counts?.subscriptionCount ?? 0,
      },
      // {
      //   label: "Reported Restaurants",
      //   value: response.data?.counts?.reportedCount ?? 0,
      // },
    ]);
    setTotalRestaurants(response.data?.data?.totalRestaurants || []);
    setReportedRestaurants(response.data?.data?.reportedRestaurants || []);
    setSubscriptionStats(response.data?.data?.subscriptionStats || []);
    if (response.data?.data?.chart) {
      setChart(response.data.data.chart);
    } else if ((response as { chart?: Chart }).chart) {
      const chartValue = (response as { chart?: Chart }).chart;
      setChart(chartValue ?? null);
    } else {
      setChart(null);
    }
  };

  useEffect(() => {
    if (selectedStatus === "custom") {
      if (!from || !to) return;

      getStats(selectedStatus, from, to);
      return;
    }
    if (selectedStatus !== "custom") {
      form.reset({ from: "", to: "" });
    }
    getStats(selectedStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, from, to]);

  return {
    stats,
    statusOptions,
    selectedStatus,
    setSelectedStatus,
    form,
    chart,
    totalRestaurants,
    reportedRestaurants,
    subscriptionStats,
    handleStatusToggle,
    handleSubscriptionStatusToggle,
  };
}
