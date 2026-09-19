"use client";

import { useCallback, useEffect, useState } from "react";
import { createReceipt, getAllReceipts } from "@/api/api-call/receipts";
import { showToast } from "@/utils/toast";
import { Receipt, ReceiptParty, ReceiptPartyType } from "@/types";
import { ReceiptFormType } from "./form";

interface UseReceiptsOptions<T extends ReceiptParty> {
  autoFetch?: boolean;
  onPaymentRecorded?: (party: T) => void;
}

export const useReceipts = <T extends ReceiptParty = ReceiptParty>(
  partyId: string,
  type: ReceiptPartyType,
  options: UseReceiptsOptions<T> = {},
) => {
  const { autoFetch = false, onPaymentRecorded } = options;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReceipts = useCallback(async () => {
    if (!partyId) return;

    setLoading(true);

    const res = await getAllReceipts({ party: partyId, type, limit: 100 });

    if (res?.error) {
      showToast("error", res.error);
      setLoading(false);
      return;
    }

    setReceipts(res?.data?.data?.receipts || []);
    setLoading(false);
  }, [partyId, type]);

  useEffect(() => {
    if (autoFetch) (() => fetchReceipts())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, partyId, type]);

  const onSubmitReceipt = async (data: ReceiptFormType) => {
    setSubmitting(true);

    const response = await createReceipt({
      party: partyId,
      type,
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

    if (response.data.updatedParty && onPaymentRecorded) {
      onPaymentRecorded(response.data.updatedParty as T);
    }

    return true;
  };

  return { receipts, loading, submitting, fetchReceipts, onSubmitReceipt };
};
