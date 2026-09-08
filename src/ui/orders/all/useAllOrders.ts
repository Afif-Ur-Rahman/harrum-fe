import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllOrders,
  claimOrderItem,
  returnOrderItem,
} from "@/api/api-call/orders";
import { showToast } from "@/utils/toast";
import { usePersistStore } from "@/store/presistStore";

const ORDERS_PER_PAGE = 30;
const SEARCH_DEBOUNCE_MS = 400;

const useAllOrders = () => {
  const {
    orders,
    ordersTotal,
    setOrders,
    appendOrders,
    updateOrderById,
    updateStockById,
  } = usePersistStore();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const requestId = useRef(0);

  const fetchOrders = useCallback(
    async (targetPage: number, searchTerm: string, append: boolean) => {
      const currentRequestId = ++requestId.current;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await getAllOrders({
        page: targetPage,
        limit: ORDERS_PER_PAGE,
        search: searchTerm || undefined,
      });

      if (currentRequestId !== requestId.current) return;

      if (res?.error) {
        showToast("error", res.error);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const data = res?.data?.data;

      const fetchedOrders = data?.orders || [];
      const fetchedTotal = data?.total || 0;

      if (append) {
        appendOrders(fetchedOrders, fetchedTotal);
      } else {
        setOrders(fetchedOrders, fetchedTotal);
      }

      setPage(data?.page || targetPage);
      setTotalPages(data?.totalPages || 1);

      setLoading(false);
      setLoadingMore(false);
    },
    [setOrders, appendOrders],
  );

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value);

      clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        requestId.current += 1;

        fetchOrders(1, value, false);
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchOrders],
  );

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
      return {
        state: false,
        error: res?.error || "Failed to claim item",
      };
    }

    updateOrderById(res.data.data);

    return {
      state: true,
      message: res.data.message,
    };
  };

  const onReturnItem = async (
    orderId: string,
    itemId: string,
    variantId: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    const res = await returnOrderItem(orderId, itemId, variantId);

    if (res?.error || !res?.data) {
      return {
        state: false,
        error: res?.error || "Failed to return item",
      };
    }

    updateOrderById(res.data.data);

    if (res.data.updatedStock) {
      updateStockById(res.data.updatedStock);
    }

    return {
      state: true,
      message: res.data.message,
    };
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
    total: ordersTotal,
    search,
    onSearchChange,
    loadMore,
    onClaimItem,
    onReturnItem,
  };
};

export { useAllOrders };
