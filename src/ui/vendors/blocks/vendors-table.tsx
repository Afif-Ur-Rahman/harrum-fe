"use client";

import { useRouter } from "next/navigation";
import { ReuseableDialog, Table } from "@/components";
import { Vendor } from "@/types";
import { formatPrice } from "@/utils";
import { Actions } from "./actions";
import { useState } from "react";
import { ReceiptForm, ReceiptHistory } from "@/ui/receipts";

interface VendorTableProps {
  filtered: Vendor[];
  loading: boolean;
  onEdit: (vendor: Vendor) => void;
  onVendorUpdated: (vendor: Vendor) => void;
}

export const VendorTable: React.FC<VendorTableProps> = ({
  filtered,
  loading,
  onEdit,
  onVendorUpdated,
}) => {
  const router = useRouter();
  const [paymentVendor, setPaymentVendor] = useState<Vendor | null>(null);
  const [historyVendor, setHistoryVendor] = useState<Vendor | null>(null);

  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (row: Vendor) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">{row.name}</span>
        </div>
      ),
    },
    {
      key: "phone" as const,
      header: "Phone",
      render: (row: Vendor) => (
        <span className="text-slate-300">{row.phone}</span>
      ),
    },
    {
      key: "email" as const,
      header: "Email",
      render: (row: Vendor) => (
        <span className="text-slate-300">{row.email || "—"}</span>
      ),
    },
    {
      key: "remainingAmount" as const,
      header: "Remaining (PKR)",
      render: (row: Vendor) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
            row.remainingAmount > 0
              ? "border-rose-300/20 bg-rose-400/10 text-rose-300"
              : "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {formatPrice(row.remainingAmount) || 0}
        </span>
      ),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: Vendor) => (
        <Actions
          vendor={row}
          onEdit={onEdit}
          onRecordPayment={setPaymentVendor}
          onPaymentHistory={setHistoryVendor}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        title="Vendors"
        data={filtered}
        columns={columns}
        isLoading={loading}
        onRowClick={(vendor) =>
          router.push(`/super-admin/vendors/${vendor._id}/bills`)
        }
        getRowClassName={() => "bg-cyan-400/5 hover:bg-cyan-400/10"}
      />

      <ReuseableDialog
        title="Record Payment"
        open={!!paymentVendor}
        setOpen={(open) => {
          if (!open) {
            setPaymentVendor(null);
          }
        }}
        content={
          paymentVendor ? (
            <ReceiptForm
              party={paymentVendor}
              type="Vendor"
              onPaymentRecorded={onVendorUpdated}
              onSuccess={() => setPaymentVendor(null)}
            />
          ) : null
        }
      />

      <ReuseableDialog
        title={historyVendor ? `${historyVendor.name} — Payments` : "Payments"}
        open={!!historyVendor}
        setOpen={(open) => {
          if (!open) {
            setHistoryVendor(null);
          }
        }}
        content={
          historyVendor ? (
            <ReceiptHistory partyId={historyVendor._id} type="Vendor" />
          ) : null
        }
      />
    </>
  );
};
