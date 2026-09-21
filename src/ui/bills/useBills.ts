"use client";

import { useCallback, useEffect, useState } from "react";
import { createBill, getAllBills } from "@/api/api-call/bills";
import { getAllVendors } from "@/api/api-call/vendors";
import { usePersistStore } from "@/store/presistStore";
import { Bill } from "@/types";
import { showToast } from "@/utils/toast";
import { BillFormType } from "./form";

export const useBills = (vendorId: string) => {
  const { vendors, vendorsLoaded, setVendors, updateVendorById } =
    usePersistStore();

  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const vendor = vendors.find((item) => item._id === vendorId) ?? null;

  useEffect(() => {
    if (vendorsLoaded) return;

    const loadVendors = async () => {
      const res = await getAllVendors();

      if (res?.error) {
        showToast("error", res.error);
        return;
      }

      setVendors(res?.data?.data || []);
    };

    loadVendors();
  }, [vendorsLoaded, setVendors]);

  const fetchBills = useCallback(async () => {
    if (!vendorId) return;

    setLoading(true);

    const res = await getAllBills({ vendor: vendorId, limit: 100 });

    if (res?.error) {
      showToast("error", res.error);
      setLoading(false);
      return;
    }

    setBills(res?.data?.data?.bills || []);
    setLoading(false);
  }, [vendorId]);

  useEffect(() => {
    (() => fetchBills())();
  }, [fetchBills]);

  const onSubmitBill = async (data: BillFormType) => {
    setSaving(true);

    const response = await createBill({
      vendor: vendorId,
      billId: data.billId.trim(),
      amount: Number(data.amount),
      note: data.note?.trim() || undefined,
    });

    setSaving(false);

    if (response?.error || !response?.data) {
      showToast("error", response?.error || "Failed to create bill");
      return false;
    }

    setBills((prev) => [response.data!.data, ...prev]);

    if (response.data.updatedVendor) {
      updateVendorById(response.data.updatedVendor);
    }

    showToast("success", response.data.message || "Bill created successfully");
    setOpen(false);

    return true;
  };

  return {
    vendor,
    bills,
    loading,
    saving,
    open,
    setOpen,
    onSubmitBill,
  };
};
