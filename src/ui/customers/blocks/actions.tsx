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

export const Actions: React.FC<ActionsProps> = ({
  customer,
  onEdit,
  onCustomerUpdated,
}) => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const hasBalance = customer.remainingAmount > 0;

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
          <DropdownMenu.Item
            onSelect={() => onEdit(customer)}
            className="cursor-pointer! gap-2! rounded-xl! text-white transition-colors! data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!"
          >
            <Pen className="h-3.5 w-3.5" />
            Edit Customer
          </DropdownMenu.Item>

          <DropdownMenu.Item
            disabled={!hasBalance}
            onSelect={() => setPaymentOpen(true)}
            className="cursor-pointer! gap-2! rounded-xl! text-white transition-colors! data-highlighted:bg-emerald-400/20! data-highlighted:text-emerald-200!"
          >
            <Wallet className="h-3.5 w-3.5" />
            Record Payment
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => setHistoryOpen(true)}
            className="cursor-pointer! gap-2! rounded-xl! text-white transition-colors! data-highlighted:bg-white/10!"
          >
            <ReceiptIcon className="h-3.5 w-3.5" />
            Payment History
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => setOrdersOpen(true)}
            className="cursor-pointer! gap-2! rounded-xl! text-white transition-colors! data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!"
          >
            <Eye className="h-3.5 w-3.5" />
            View Orders
          </DropdownMenu.Item>
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
