"use client";

import { Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { FormInput } from "@/components";

import { useExpenseForm } from "./form";
import { ExpenseFormType } from "./schema";

import { DEFAULT_EXPENSE_FORM, EXPENSE_FIELDS } from "../constants";

export const ExpenseForm = ({
  onSubmitExpense,
  loading,
}: {
  onSubmitExpense: (data: ExpenseFormType) => Promise<boolean>;
  loading: boolean;
}) => {
  const form = useExpenseForm(DEFAULT_EXPENSE_FORM);

  const handleSubmit = form.handleSubmit(async data => {
    const success = await onSubmitExpense(data);
    if (success) form.reset(DEFAULT_EXPENSE_FORM);
  });

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-5">
        {EXPENSE_FIELDS.map(field => (
          <FormInput
            key={field.name}
            field={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            icon={field.icon}
            options={field.options ? [...field.options] : undefined}
            required={field.required}
          />
        ))}

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
