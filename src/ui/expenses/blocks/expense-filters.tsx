"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { ReuseableDialog } from "@/components";
import { FormInput } from "@/components";
import { MultiSelect } from "@/components/inputs/multi-select";

import { EXPENSE_CATEGORY_OPTIONS } from "../form/schema";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

export interface ExpenseFilters {
  categories: string[];
  paymentMethods: string[];
  from: string;
  to: string;
}

export const EMPTY_EXPENSE_FILTERS: ExpenseFilters = {
  categories: [],
  paymentMethods: [],
  from: "",
  to: "",
};

interface FilterFormProps {
  filters: ExpenseFilters;
  onApply: (filters: ExpenseFilters) => void;
  onClose: () => void;
}

const FilterForm = ({ filters, onApply, onClose }: FilterFormProps) => {
  const form = useForm<ExpenseFilters>({
    defaultValues: filters,
  });

  const categoryOptions = EXPENSE_CATEGORY_OPTIONS.map(option => ({
    label: option.label,
    value: option.value,
  }));

  const handleApply = form.handleSubmit(values => {
    const from = String(values.from ?? "").trim();
    const to = String(values.to ?? "").trim();

    if (from && to && new Date(from) > new Date(to)) {
      form.setError("to", {
        type: "validate",
        message: "End date must be after start date",
      });
      return;
    }

    onApply({
      categories: values.categories ?? [],
      paymentMethods: values.paymentMethods ?? [],
      from,
      to,
    });
    onClose();
  });

  const handleClear = () => {
    onApply(EMPTY_EXPENSE_FILTERS);
    onClose();
  };

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-2">
        <Controller
          name="categories"
          control={form.control}
          render={({ field }) => (
            <MultiSelect
              label="Category"
              placeholder="Select categories"
              options={categoryOptions}
              value={field.value ?? []}
              onChange={value => form.setValue("categories", value)}
            />
          )}
        />
        <Controller
          name="paymentMethods"
          control={form.control}
          render={({ field }) => (
            <MultiSelect
              label="Payment Method"
              placeholder="Select payment methods"
              options={PAYMENT_METHOD_OPTIONS}
              value={field.value ?? []}
              onChange={value => form.setValue("paymentMethods", value)}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput field="from" label="From" type="date" placeholder="Start date" compact />

          <FormInput field="to" label="To" type="date" placeholder="End date" compact />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleClear}
            className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-[0.98] sm:flex-1"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:opacity-95 active:scale-[0.98] sm:flex-1"
          >
            Apply filters
          </button>
        </div>
      </div>
    </FormProvider>
  );
};

interface ExpenseFilterDialogProps {
  filters: ExpenseFilters;
  activeCount: number;
  onApply: (filters: ExpenseFilters) => void;
}

export const ExpenseFilterDialog = ({
  filters,
  activeCount,
  onApply,
}: ExpenseFilterDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ReuseableDialog
      title="Filter Expenses"
      open={open}
      setOpen={setOpen}
      triggerButton={
        <button
          type="button"
          aria-label="Filter expenses"
          className="relative flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
        >
          <SlidersHorizontal className="h-4 w-4" />

          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-slate-950">
              {activeCount}
            </span>
          )}
        </button>
      }
      content={<FilterForm filters={filters} onApply={onApply} onClose={() => setOpen(false)} />}
    />
  );
};
