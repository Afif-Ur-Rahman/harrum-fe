"use client";

import { Loader2, User, Phone } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components";
import { Customer } from "@/types";
import { formatPrice } from "@/utils";
import { useReceiptForm } from "../form";
import { useReceipts } from "../useReceipts";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

export const ReceiptForm = ({
  customer,
  onPaymentRecorded,
  onSuccess,
}: {
  customer: Customer;
  onPaymentRecorded?: (customer: Customer) => void;
  onSuccess?: () => void;
}) => {
  const defaults = { amount: "", note: "", paymentMethod: "cash" as const };
  const form = useReceiptForm(defaults);

  const { submitting, onSubmitReceipt } = useReceipts(customer._id, {
    onPaymentRecorded,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const success = await onSubmitReceipt(data);
    if (success) {
      form.reset(defaults);
      onSuccess?.();
    }
  });

  const hasBalance = customer.remainingAmount > 0;

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <User className="h-4 w-4 text-cyan-300" />
            <span className="font-semibold text-white">{customer.name}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <Phone className="h-3.5 w-3.5" />
            {customer.phone}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
            <span className="text-xs text-slate-400">Remaining Amount</span>
            <span
              className={`text-sm font-semibold ${
                hasBalance ? "text-rose-300" : "text-emerald-300"
              }`}
            >
              {formatPrice(customer.remainingAmount)} PKR
            </span>
          </div>
        </div>

        <FormInput
          field="amount"
          label="Amount Received"
          type="number"
          placeholder="0"
          max={customer.remainingAmount}
          required
        />

        <FormInput
          field="paymentMethod"
          label="Payment Method"
          type="select"
          placeholder="Select payment method"
          options={PAYMENT_METHOD_OPTIONS}
          required
        />

        <FormInput
          field="note"
          label="Note (optional)"
          type="textarea"
          placeholder="Add a note..."
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !hasBalance}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? "Recording…"
            : hasBalance
              ? "Record Payment"
              : "No Balance Due"}
        </button>
      </div>
    </FormProvider>
  );
};
