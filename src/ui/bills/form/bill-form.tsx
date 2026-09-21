"use client";

import { FileText, Hash, Loader2, Wallet } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components";
import { useBillForm } from "./form";
import { BillFormType } from "./schema";

const DEFAULTS: BillFormType = { billId: "", amount: "", note: "" };

export const BillForm = ({
  onSubmitBill,
  loading,
}: {
  onSubmitBill: (data: BillFormType) => Promise<boolean>;
  loading: boolean;
}) => {
  const form = useBillForm(DEFAULTS);

  const handleSubmit = form.handleSubmit(async (data) => {
    const success = await onSubmitBill(data);
    if (success) form.reset(DEFAULTS);
  });

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-5">
        <FormInput
          field="billId"
          label="Bill ID"
          type="text"
          placeholder="INV-001"
          icon={Hash}
          capitalizeFirst={false}
          required
        />

        <FormInput
          field="amount"
          label="Amount"
          type="number"
          placeholder="0"
          icon={Wallet}
          required
        />

        <FormInput
          field="note"
          label="Note (optional)"
          type="textarea"
          placeholder="Add a note..."
          icon={FileText}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving…" : "Add Bill"}
        </button>
      </div>
    </FormProvider>
  );
};
