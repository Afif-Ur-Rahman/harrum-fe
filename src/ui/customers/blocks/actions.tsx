"use client";

import { useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import {
  MoreVertical,
  Pen,
  Wallet,
  Receipt as ReceiptIcon,
  Eye,
} from "lucide-react";
import { ReuseableDialog } from "@/components";
import { Customer } from "@/types";
import { ReceiptForm, ReceiptHistory } from "@/ui/receipts";
import { CustomerOrders } from "./customer-orders";

interface ActionsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onCustomerUpdated: (customer: Customer) => void;
}

type ActionButton = {
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  onSelect: () => void;
  hoverClass: string;
};

export const Actions: React.FC<ActionsProps> = ({
  customer,
  onEdit,
  onCustomerUpdated,
}) => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const hasBalance = customer.remainingAmount > 0;

  const actionButtons: ActionButton[] = [
    {
      label: "Edit Customer",
      icon: Pen,
      disabled: false,
      onSelect: () => onEdit(customer),
      hoverClass:
        "data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!",
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
      label: "View Orders",
      icon: Eye,
      disabled: false,
      onSelect: () => setOrdersOpen(true),
      hoverClass:
        "data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!",
    },
  ];

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            aria-label="Customer actions"
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
            customer={customer}
            onPaymentRecorded={onCustomerUpdated}
            onSuccess={() => setPaymentOpen(false)}
          />
        }
      />

      <ReuseableDialog
        title={`${customer.name} — Payments`}
        open={historyOpen}
        setOpen={setHistoryOpen}
        content={<ReceiptHistory customerId={customer._id} />}
      />

      <ReuseableDialog
        title={`${customer.name} — Orders`}
        open={ordersOpen}
        setOpen={setOrdersOpen}
        content={<CustomerOrders customerId={customer._id} />}
        contentStyle="max-w-2xl!"
      />
    </>
  );
};
