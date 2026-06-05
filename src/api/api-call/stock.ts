import { ResponseForMultipleStocks, ResponseForSingleStock } from "@/types";
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

export const updateStockHistory = async (
  data: { quantity: number; price: number },
  id: string,
  historyId: string,
) => {
  try {
    const response = await serverAction({
      url: `/stock/${id}/${historyId}`,
      method: "PUT",
      body: { quantity: String(data.quantity), price: String(data.price) },
    });
    return response as ResponseForSingleStock;
  } catch (error) {
    console.error("Failed to update stock:", error);
    return null;
  }
};

export const deleteStock = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/stock/${id}`,
      method: "DELETE",
    });
    return response as ResponseForSingleStock;
  } catch (error) {
    console.error("Failed to delete stock:", error);
    return null;
  }
};

export const deleteStockHistory = async (
  stockId: string,
  historyId: string,
) => {
  try {
    const response = await serverAction({
      url: `/stock/${stockId}/${historyId}`,
      method: "DELETE",
    });
    return response as ResponseForSingleStock;
  } catch (error) {
    console.error("Failed to delete stock:", error);
    return null;
  }
};

export const stockOut = async (data: {
  stockItems: { _id: string; newQuantity: string }[];
  reason?: string;
}) => {
  try {
    const response = await serverAction({
      url: "/stock/out",
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

export const orderStockOut = async (data: {
  stockItems: { _id: string; newQuantity: string }[];
  orderId: string;
  tableNumber?: number | null;
}) => {
  try {
    const shortId = data.orderId.slice(-6);
    const reason =
      data.tableNumber != null
        ? `Dine In #${data.tableNumber} · ${shortId}`
        : `Delivery · ${shortId}`;
    const response = await serverAction({
      url: "/stock/out",
      method: "POST",
      body: {
        stockItems: data.stockItems,
        reason,
      },
    });
    return response as ResponseForMultipleStocks;
  } catch (error) {
    console.error("Failed to deduct stock for order:", error);
    return null;
  }
};
