import { SuperAdminStatsResponse } from "@/types/super-admin";
import { serverAction } from "../server-action";
import { ResponseForDashboard } from "@/types";

// export const restaurantStatusUpdate = async (
//   restaurantId: string,
//   isVerified: boolean,
// ) => {
//   try {
//     const response = await serverAction({
//       url: `/dashboard/restaurant/${restaurantId}`,
//       method: "PUT",
//       body: { isVerified },
//     });
//     return response;
//   } catch (error) {
//     console.error("Failed to update restaurant status:", error);
//     return null;
//   }
// };

// export const subscriptionStatusUpdate = async (
//   subscriptionId: string,
//   status: "active" | "cancelled" | "pending" | "expired",
// ) => {
//   try {
//     const response = await serverAction({
//       url: `/dashboard/subscription/${subscriptionId}`,
//       method: "PUT",
//       body: { status },
//     });
//     return response;
//   } catch (error) {
//     console.error("Failed to update subscription status:", error);
//     return null;
//   }
// };

// export const setPriceSubscription = async (data: {
//   plan: string;
//   price: number;
// }) => {
//   try {
//     const response = await serverAction({
//       url: `/dashboard/plan-price`,
//       method: "POST",
//       body: data,
//     });
//     return response;
//   } catch (error) {
//     console.error("Failed to set subscription price:", error);
//     return null;
//   }
// };

// export const getSubscriptionPrices = async () => {
//   try {
//     const response = await serverAction({
//       url: "/dashboard/plan-prices",
//       method: "GET",
//     });

//     return response?.data;
//   } catch (error) {
//     console.error("Failed to fetch subscription prices:", error);
//     return { basic: 0, pro: 0, premium: 0 };
//   }
// };


