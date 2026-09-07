import { useEffect, useState } from "react";
import {
  getAllOrders,
  claimOrderItem,
  returnOrderItem,
} from "@/api/api-call/orders";
import { Order } from "@/types";
import { showToast } from "@/utils/toast";

const useAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrders();

    if (res?.error) {
      showToast("error", res.error);
    }

    setOrders(res?.data?.data || []);
    setLoading(false);
  };

  const onClaimItem = async (
    orderId: string,
    itemId: string,
    variantId: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    const res = await claimOrderItem(orderId, itemId, variantId);

    if (res?.error || !res?.data) {
      return { state: false, error: res?.error || "Failed to claim item" };
    }

    const updatedOrder = res.data.data;
    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? updatedOrder : order)),
    );

    return { state: true, message: res.data.message };
  };

  const onReturnItem = async (
    orderId: string,
    itemId: string,
    variantId: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    const res = await returnOrderItem(orderId, itemId, variantId);

    if (res?.error || !res?.data) {
      return { state: false, error: res?.error || "Failed to return item" };
    }

    const updatedOrder = res.data.data;
    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? updatedOrder : order)),
    );

    return { state: true, message: res.data.message };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    onClaimItem,
    onReturnItem,
    fetchOrders,
  };
};

export { useAllOrders };
