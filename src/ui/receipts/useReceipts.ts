"use client";

import { useCallback, useEffect, useState } from "react";
import { createReceipt, getAllReceipts } from "@/api/api-call/receipts";
import { showToast } from "@/utils/toast";
import { Customer, Receipt } from "@/types";
import { ReceiptFormType } from "./form";

interface UseReceiptsOptions {
  autoFetch?: boolean;
  onPaymentRecorded?: (customer: Customer) => void;
}

export const useReceipts = (
  customerId: string,
  options: UseReceiptsOptions = {},
) => {
  const { autoFetch = false, onPaymentRecorded } = options;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReceipts = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);

    const res = await getAllReceipts({ customer: customerId, limit: 100 });

    if (res?.error) {
      showToast("error", res.error);
      setLoading(false);
      return;
    }

    setReceipts(res?.data?.data?.receipts || []);
    setLoading(false);
  }, [customerId]);

  useEffect(() => {
    if (autoFetch) (() => fetchReceipts())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, customerId]);

  const onSubmitReceipt = async (data: ReceiptFormType) => {
    setSubmitting(true);

    const response = await createReceipt({
      customer: customerId,
      amount: Number(data.amount),
      note: data.note || undefined,
      paymentMethod: data.paymentMethod,
    });

    setSubmitting(false);

    if (response?.error || !response?.data) {
      showToast("error", response?.error || "Failed to record payment");
      return false;
    }

    showToast(
      "success",
      response.data.message || "Payment recorded successfully",
    );

    setReceipts((prev) => [response.data!.data, ...prev]);

    if (response.data.updatedCustomer && onPaymentRecorded) {
      onPaymentRecorded(response.data.updatedCustomer);
    }

    return true;
  };

  return { receipts, loading, submitting, fetchReceipts, onSubmitReceipt };
};
