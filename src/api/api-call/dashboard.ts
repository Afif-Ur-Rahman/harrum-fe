import { ResponseForDashboardStats } from "@/types";

import { serverAction } from "../server-action";

export const getDashboardStats = async () => {
  try {
    const response = await serverAction({
      url: "/dashboard/stats",
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
