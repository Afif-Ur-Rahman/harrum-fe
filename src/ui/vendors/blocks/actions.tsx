"use client";

import { DropdownMenu } from "@radix-ui/themes";
import {
  MoreVertical,
  Pen,
  Wallet,
  Receipt as ReceiptIcon,
  PackageSearch,
  FileBarChart,
} from "lucide-react";
import { useState } from "react";

import { getAllBills, getAllReceipts } from "@/api/api-call";
import { useNavigation } from "@/lib/useNavigation";
import { Vendor } from "@/types";
import { formatDateTime } from "@/utils";
import { printStatement } from "@/utils/print-statement";

interface ActionsProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onRecordPayment: (vendor: Vendor) => void;
  onPaymentHistory: (vendor: Vendor) => void;
}

type ActionButton = {
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  onSelect: () => void;
  hoverClass: string;
};

export const Actions: React.FC<ActionsProps> = ({
  vendor,
  onEdit,
  onRecordPayment,
  onPaymentHistory,
}) => {
  const router = useNavigation();
  const [printing, setPrinting] = useState(false);
  const hasBalance = vendor.remainingAmount > 0;

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const handlePrintStatement = async () => {
    setPrinting(true);

    const [receiptsRes, billsRes] = await Promise.all([
      getAllReceipts({ party: vendor._id, type: "Vendor", limit: 500 }),
      getAllBills(vendor._id),
    ]);

    const payments = (receiptsRes?.data?.data?.receipts || []).map(r => ({
      date: formatDateTime(r.createdAt, true),
      amount: r.amount,
      method: r.paymentMethod,
      note: r.note,
    }));

    const bills = (billsRes?.data?.data || []).map(b => ({
      billId: b.billId,
      date: formatDateTime(b.createdAt, true),
      note: b.note,
      amount: b.amount,
    }));

    await printStatement({
      partyType: "Vendor",
      partyName: vendor.name,
      phone: vendor.phone,
      email: vendor.email,
      remainingAmount: vendor.remainingAmount,
      payments,
      bills,
    });

    setPrinting(false);
  };

  const actionButtons: ActionButton[] = [
    {
      label: "Edit Vendor",
      icon: Pen,
      disabled: false,
      onSelect: () => onEdit(vendor),
      hoverClass: "data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!",
    },
    {
      label: "Record Payment",
      icon: Wallet,
      disabled: !hasBalance,
      onSelect: () => onRecordPayment(vendor),
      hoverClass: "data-highlighted:bg-emerald-400/20! data-highlighted:text-emerald-200!",
    },
    {
      label: "Payment History",
      icon: ReceiptIcon,
      disabled: false,
      onSelect: () => onPaymentHistory(vendor),
      hoverClass: "data-highlighted:bg-amber-400/20! data-highlighted:text-amber-200!",
    },
    {
      label: "View Stocks",
      icon: PackageSearch,
      disabled: false,
      onSelect: () => router.push(`/super-admin/vendors/${vendor._id}/stocks`),
      hoverClass: "data-highlighted:bg-fuchsia-400/20! data-highlighted:text-fuchsia-200!",
    },
    {
      label: "Print Statement",
      icon: FileBarChart,
      disabled: printing,
      onSelect: handlePrintStatement,
      hoverClass: "data-highlighted:bg-fuchsia-400/20! data-highlighted:text-fuchsia-200!",
    },
  ];

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            aria-label="Vendor actions"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="end"
          onPointerDown={stopPropagation}
          onClick={stopPropagation}
          className="rounded-2xl! border! border-white/10! bg-slate-900/95! shadow-2xl! shadow-black/40! backdrop-blur-xl!"
        >
          {actionButtons.map(action => {
            const Icon = action.icon;

            return (
              <DropdownMenu.Item
                key={action.label}
                disabled={action.disabled}
                onSelect={e => {
                  e.stopPropagation();
                  action.onSelect();
                }}
                className={`gap-2! rounded-xl! transition-colors! ${
                  action.disabled
                    ? "cursor-not-allowed! text-slate-300! opacity-50!"
                    : `cursor-pointer! text-white! ${action.hoverClass}`
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
