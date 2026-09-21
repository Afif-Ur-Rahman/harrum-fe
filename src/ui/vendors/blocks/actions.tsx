"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@radix-ui/themes";
import {
  MoreVertical,
  Pen,
  Wallet,
  Receipt as ReceiptIcon,
  PackageSearch,
  FileText,
} from "lucide-react";
import { ReuseableDialog } from "@/components";
import { Vendor } from "@/types";
import { ReceiptForm, ReceiptHistory } from "@/ui/receipts";

interface ActionsProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onVendorUpdated: (vendor: Vendor) => void;
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
  onVendorUpdated,
}) => {
  const router = useRouter();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const hasBalance = vendor.remainingAmount > 0;

  const actionButtons: ActionButton[] = [
    {
      label: "Edit Vendor",
      icon: Pen,
      disabled: false,
      onSelect: () => onEdit(vendor),
      hoverClass:
        "data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!",
    },
    {
      label: "View Bills",
      icon: FileText,
      disabled: false,
      onSelect: () => router.push(`/super-admin/vendors/${vendor._id}/bills`),
      hoverClass:
        "data-highlighted:bg-rose-400/20! data-highlighted:text-rose-200!",
    },
    {
      label: "Record Payment",
      icon: Wallet,
      disabled: !hasBalance,
      onSelect: () => setPaymentOpen(true),
      hoverClass:
        "data-highlighted:bg-emerald-400/20! data-highlighted:text-emerald-200!",
    },
    {
      label: "Payment History",
      icon: ReceiptIcon,
      disabled: false,
      onSelect: () => setHistoryOpen(true),
      hoverClass:
        "data-highlighted:bg-amber-400/20! data-highlighted:text-amber-200!",
    },
    {
      label: "View Stocks",
      icon: PackageSearch,
      disabled: false,
      onSelect: () => router.push(`/super-admin/vendors/${vendor._id}`),
      hoverClass:
        "data-highlighted:bg-fuchsia-400/20! data-highlighted:text-fuchsia-200!",
    },
  ];

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            aria-label="Vendor actions"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="end"
          className="rounded-2xl! border! border-white/10! bg-slate-900/95! backdrop-blur-xl! shadow-2xl! shadow-black/40!"
        >
          {actionButtons.map((action) => {
            const Icon = action.icon;

            return (
              <DropdownMenu.Item
                key={action.label}
                disabled={action.disabled}
                onSelect={action.onSelect}
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

      <ReuseableDialog
        title="Record Payment"
        open={paymentOpen}
        setOpen={setPaymentOpen}
        content={
          <ReceiptForm
            party={vendor}
            type="Vendor"
            onPaymentRecorded={onVendorUpdated}
            onSuccess={() => setPaymentOpen(false)}
          />
        }
      />

      <ReuseableDialog
        title={`${vendor.name} — Payments`}
        open={historyOpen}
        setOpen={setHistoryOpen}
        content={<ReceiptHistory partyId={vendor._id} type="Vendor" />}
      />
    </>
  );
};
