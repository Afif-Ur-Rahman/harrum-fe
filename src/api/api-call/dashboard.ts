import { DashboardStatsParams, ResponseForDashboardStats } from "@/types";

import { serverAction } from "../server-action";

export const getDashboardStats = async (params?: DashboardStatsParams) => {
  try {
    const query = new URLSearchParams();

    if (params?.filter) query.set("filter", params.filter);

    if (params?.filter === "custom") {
      if (params.from) query.set("from", params.from);
      if (params.to) query.set("to", params.to);
    }

    const queryString = query.toString();

    const response = await serverAction({
      url: `/dashboard/stats${queryString ? `?${queryString}` : ""}`,
      method: "GET",
    });
    return response as ResponseForDashboardStats;
  } catch (error) {
    console.error("Failed to get dashboard stats:", (error as Error).message);
    return null;
  }
};

export const dismissStockAlert = async (stockId: string, variantId?: string) => {
  try {
    const response = await serverAction({
      url: `/dashboard/stock-alerts/${stockId}`,
      method: "PATCH",
      body: { variantId },
    });
    return response as { state: boolean; data?: { message: string }; error?: string };
  } catch (error) {
    console.error("Failed to dismiss stock alert:", (error as Error).message);
    return null;
  }
};
