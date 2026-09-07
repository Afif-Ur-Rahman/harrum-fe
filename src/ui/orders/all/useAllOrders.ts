import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllOrders,
  claimOrderItem,
  returnOrderItem,
} from "@/api/api-call/orders";
import { Order } from "@/types";
import { showToast } from "@/utils/toast";

const ORDERS_PER_PAGE = 30;
const SEARCH_DEBOUNCE_MS = 400;

const useAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const requestId = useRef(0);

  const fetchOrders = useCallback(
    async (targetPage: number, searchTerm: string, append: boolean) => {
      const currentRequestId = ++requestId.current;

      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await getAllOrders({
        page: targetPage,
        limit: ORDERS_PER_PAGE,
        search: searchTerm || undefined,
      });

      // Ignore stale responses (e.g. a fast follow-up search overtaking a slow one)
      if (currentRequestId !== requestId.current) return;

      if (res?.error) {
        showToast("error", res.error);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const data = res?.data?.data;

      setOrders((prev) =>
        append ? [...prev, ...(data?.orders || [])] : data?.orders || [],
      );
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
      setTotal(data?.total || 0);
      setLoading(false);
      setLoadingMore(false);
    },
    [],
  );

  const onSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchOrders(1, value, false);
    }, SEARCH_DEBOUNCE_MS);
  };

  const loadMore = useCallback(() => {
    if (loading || loadingMore) return;
    if (page >= totalPages) return;

    fetchOrders(page + 1, search, true);
  }, [loading, loadingMore, page, totalPages, search, fetchOrders]);

  const hasMore = page < totalPages;

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
    const loadInitialOrders = async () => {
      await fetchOrders(1, "", false);
    };

    loadInitialOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    loadingMore,
    hasMore,
    total,
    search,
    onSearchChange,
    loadMore,
    onClaimItem,
    onReturnItem,
  };
};

export { useAllOrders };
