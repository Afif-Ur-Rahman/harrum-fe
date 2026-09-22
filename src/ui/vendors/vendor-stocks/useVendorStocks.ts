"use client";

import { useCallback, useEffect, useState } from "react";

import { getVendorStocks } from "@/api/api-call/vendors";
import { Stock } from "@/types";
import { showToast } from "@/utils/toast";

const useVendorStocks = (vendorId: string) => {
  const [vendorStocks, setVendorStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVendorStocks = useCallback(async (vendorId: string) => {
    if (!vendorId) {
      setVendorStocks([]);
      return;
    }

    setLoading(true);

    const response = await getVendorStocks(vendorId);

    if (response?.error) {
      showToast("error", response.error);
      setVendorStocks([]);
      setLoading(false);
      return;
    }

    setVendorStocks(response?.data?.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    (() => fetchVendorStocks(vendorId))();
  }, [vendorId, fetchVendorStocks]);

  return {
    vendorStocks,
    loading,
  };
};

export { useVendorStocks };
