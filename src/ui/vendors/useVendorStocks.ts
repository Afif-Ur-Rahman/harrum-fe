"use client";

import { useCallback, useEffect, useState } from "react";
import { getVendorStocks } from "@/api/api-call/vendors";
import { VendorStockItem, VendorStocksTotals } from "@/types";
import { showToast } from "@/utils/toast";

const emptyTotals: VendorStocksTotals = {
  itemsCount: 0,
  purchasesCount: 0,
  totalQuantity: 0,
  totalAmount: 0,
};

export const useVendorStocks = (
  vendorId: string,
  options: { autoFetch?: boolean } = {},
) => {
  const { autoFetch = false } = options;

  const [items, setItems] = useState<VendorStockItem[]>([]);
  const [totals, setTotals] = useState<VendorStocksTotals>(emptyTotals);
  const [loading, setLoading] = useState(false);

  const fetchVendorStocks = useCallback(async () => {
    if (!vendorId) return;

    setLoading(true);

    const res = await getVendorStocks(vendorId);

    if (res?.error || !res?.data) {
      showToast("error", res?.error || "Failed to fetch vendor stock items");
      setLoading(false);
      return;
    }

    setItems(res.data.data?.items || []);
    setTotals(res.data.data?.totals || emptyTotals);
    setLoading(false);
  }, [vendorId]);

  useEffect(() => {
    if (autoFetch) (() => fetchVendorStocks())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, vendorId]);

  return { items, totals, loading, fetchVendorStocks };
};
