import { serverAction } from "../server-action";
import { OrderFormType } from "@/ui/orders/add-order/form/schema";
import { ResponseForMultipleOrders, ResponseForOrder } from "@/types";

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.customerId) query.set("customerId", params.customerId);

    const response = await serverAction({
      url: `/orders?${query.toString()}`,
      method: "GET",
    });
    return response as ResponseForMultipleOrders;
  } catch (error) {
    console.error("Failed to get all orders:", (error as Error).message);
    return null;
  }
};

export const createOrder = async (data: OrderFormType) => {
  try {
    const response = await serverAction({
      url: "/orders",
      method: "POST",
      body: data,
    });
    return response as ResponseForOrder;
  } catch (error) {
    console.error("Failed to create order:", (error as Error).message);
    return null;
  }
};

export const returnOrderItem = async (
  orderId: string,
  itemId: string,
  variantId: string,
) => {
  try {
    const response = await serverAction({
      url: `/orders/return/${orderId}/${itemId}/${variantId}`,
      method: "PUT",
    });
    return response as ResponseForOrder;
  } catch (error) {
    console.error("Failed to return order item:", (error as Error).message);
    return null;
  }
};

export const claimOrderItem = async (
  orderId: string,
  itemId: string,
  variantId: string,
) => {
  try {
    const response = await serverAction({
      url: `/orders/claim/${orderId}/${itemId}/${variantId}`,
      method: "PUT",
    });
    return response as ResponseForOrder;
  } catch (error) {
    console.error("Failed to claim order item:", (error as Error).message);
    return null;
  }
};
