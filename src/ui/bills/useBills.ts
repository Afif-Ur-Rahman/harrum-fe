"use client";

import { useCallback, useEffect, useState } from "react";
import { createBill, getAllBills } from "@/api/api-call/bills";
import { getAllVendors } from "@/api/api-call/vendors";
import { usePersistStore } from "@/store/presistStore";
import { Bill, BillListData, BillSummary } from "@/types";
import { showToast } from "@/utils/toast";
import { BillFormType } from "./form";

const EMPTY_SUMMARY: BillSummary = {
  totalAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
};

export const useBills = (vendorId: string) => {
  const { vendors, vendorsLoaded, setVendors, updateVendorById } =
    usePersistStore();

  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<BillSummary>(EMPTY_SUMMARY);
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

  const applyBillsData = useCallback((data?: BillListData) => {
    setBills(data?.bills || []);
    setSummary({
      totalAmount: data?.totalAmount ?? 0,
      paidAmount: data?.paidAmount ?? 0,
      remainingAmount: data?.remainingAmount ?? 0,
    });
  }, []);

  const fetchBills = useCallback(async () => {
    if (!vendorId) return;

    setLoading(true);

    const res = await getAllBills(vendorId);

    if (res?.error) {
      showToast("error", res.error);
      setLoading(false);
      return;
    }

    applyBillsData(res?.data?.data);
    setLoading(false);
  }, [vendorId, applyBillsData]);

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

    applyBillsData(response.data.data);

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
    summary,
    loading,
    saving,
    open,
    setOpen,
    onSubmitBill,
  };
};
