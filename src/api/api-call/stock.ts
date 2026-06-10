import { AddStockPayload, ResponseForMultipleStocks } from "@/types";
import { serverAction } from "../server-action";
import { StockFormType } from "@/ui/stock/form/schema";

export const getAllStocks = async () => {
  try {
    const response = await serverAction({
      url: `/stock`,
      method: "GET",
    });
    return response as ResponseForMultipleStocks;
  } catch (error) {
    console.error("Failed to get all products:", error);
    return null;
  }
};

export const createStock = async (data: StockFormType) => {
  try {
    const response = await serverAction({
      url: "/stock",
      method: "POST",
      body: data,
    });
    return response as ResponseForMultipleStocks;
  } catch (error) {
    console.error("Failed to create stock:", error);
    return null;
  }
};
export const getStockHistory = async (params: {
  from?: string;
  to?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const query = new URLSearchParams();
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    if (params.type && params.type !== "all") query.set("type", params.type);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const response = await serverAction({
      url: `/stock/history?${query.toString()}`,
      method: "GET",
    });
    return response as {
      state: boolean;
      data?: {
        message: string;
        data: {
          entries: {
            stockId: string;
            stockName: string;
            unit: string;
            quantity: number;
            price: number;
            type: "stock-in" | "wastage" | "order";
            reason?: string;
            date: string;
            createdByName: string;
            historyId: string;
          }[];
          total: number;
          page: number;
          totalPages: number;
        };
      };
    };
  } catch (error) {
    console.error("Failed to get stock history:", error);
    return null;
  }
};

export const addStockQuantity = async (
  stockId: string,
  payload: AddStockPayload,
) => {
  try {
    const response = await serverAction({
      url: `/stock/${stockId}/add`,
      method: "POST",
      body: payload,
    });
    return { data: response.data };
  } catch (error) {
    return {
      error:
        (error as unknown as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to add stock",
    };
  }
};
