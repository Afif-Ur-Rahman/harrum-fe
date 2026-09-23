"use client";

import { Wallet, FileText, Tag, Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { FormInput } from "@/components";

import { useExpenseForm } from "./form";
import { EXPENSE_CATEGORY_OPTIONS, ExpenseFormType } from "./schema";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

const DEFAULTS: ExpenseFormType = {
  amount: "",
  note: "",
  category: "Misc",
  paymentMethod: "cash",
};

export const ExpenseForm = ({
  onSubmitExpense,
  loading,
}: {
  onSubmitExpense: (data: ExpenseFormType) => Promise<boolean>;
  loading: boolean;
}) => {
  const form = useExpenseForm(DEFAULTS);

  const handleSubmit = form.handleSubmit(async data => {
    const success = await onSubmitExpense(data);
    if (success) form.reset(DEFAULTS);
  });

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-5">
        <FormInput
          field="amount"
          label="Amount"
          type="number"
          placeholder="0"
          icon={Wallet}
          required
        />

        <FormInput
          field="category"
          label="Category"
          type="select"
          placeholder="Select category"
          options={[...EXPENSE_CATEGORY_OPTIONS]}
          icon={Tag}
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
          label="Note"
          type="textarea"
          placeholder="What was this expense for?"
          icon={FileText}
          required
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving…" : "Add Expense"}
        </button>
      </div>
    </FormProvider>
  );
};
