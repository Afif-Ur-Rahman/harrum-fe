"use client";

import { Receipt as ReceiptIcon } from "lucide-react";
import Loader from "@/components/ui/loader";
import { EmptyState } from "@/components";
import { useReceipts } from "../useReceipts";
import { ReceiptRow } from "./receipt-row";

export const ReceiptHistory = ({ customerId }: { customerId: string }) => {
  const { receipts, loading } = useReceipts(customerId, { autoFetch: true });

  if (loading) {
    return <Loader label="payments" />;
  }

  if (receipts.length === 0) {
    return (
      <EmptyState
        icon={ReceiptIcon}
        title="No payments yet"
        description="This customer hasn't made any payments."
        showGlow={false}
        className="border-none! bg-transparent! shadow-none! backdrop-blur-none!"
      />
    );
  }

  return (
    <div className="space-y-3">
      {receipts.map((receipt) => (
        <ReceiptRow key={receipt._id} receipt={receipt} />
      ))}
    </div>
  );
};
