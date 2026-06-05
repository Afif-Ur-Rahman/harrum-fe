import { Chart } from "@/types";
import { MainOrder } from "@/types/orders";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Stat = {
  label: string;
  value: string;
};

const useDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Total Revenue", value: "Loading..." },
    { label: "Pending Revenue", value: "Loading..." },
    { label: "Total Orders", value: "Loading..." },
  ]);
  const [recentOrders, setRecentOrders] = useState<MainOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const statusOptions = [
    { value: "Today", label: "Today" },
    { value: "Current week", label: "Current week" },
    { value: "Current Month", label: "Current Month" },
    { value: "custom", label: "Custom" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("Current Month");
  const [chart, setChart] = useState<Chart | null>(null);
  const form = useForm<{ from: string; to: string }>({
    defaultValues: {
      from: "",
      to: "",
    },
  });
  const { from, to } = form.watch();

  // const getStats = async (status?: string, from?: string, to?: string) => {
  //   const response = await getDashboardStats(status, from, to);
  //   const data = response?.data?.data;
  //   setLoading(false);
  //   if (!data) return;

  //   setStats([
  //     {
  //       label: "Total Revenue",
  //       value: data?.totalOrdersPrice ? `${data.totalOrdersPrice}` : "0",
  //     },
  //     {
  //       label: "Pending Revenue",
  //       value: data?.pendingOrdersPrice ? `${data.pendingOrdersPrice}` : "0",
  //     },
  //     {
  //       label: "Total Orders",
  //       value: data?.totalOrdersCount?.toString() || "0",
  //     },
  //   ]);
  //   setChart(data?.chart || null);
  //   setRecentOrders(data?.recentOrders || []);
  // };

  useEffect(() => {
    if (selectedStatus === "custom") {
      if (!from || !to) return;

      // getStats(selectedStatus, from, to);
      return;
    }
    if (selectedStatus !== "custom") {
      form.reset({ from: "", to: "" });
    }
    // getStats(selectedStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, from, to]);

  return {
    stats,
    recentOrders,
    statusOptions,
    selectedStatus,
    setSelectedStatus,
    chart,
    form,
    loading,
  };
};

export { useDashboard };
