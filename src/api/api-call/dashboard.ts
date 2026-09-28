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
