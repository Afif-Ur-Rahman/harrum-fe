"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { FormInput, ReuseableDialog } from "@/components";

import { FilterMultiSelect } from "./filter-multi-select";

import { PRICE_TYPE_OPTIONS, STOCK_TYPE_OPTIONS, type PriceFilterType } from "../constants";

export interface StockFilters {
  brands: string[];
  types: string[];
  priceType: PriceFilterType;
  minPrice: string;
  maxPrice: string;
}

export const EMPTY_STOCK_FILTERS: StockFilters = {
  brands: [],
  types: [],
  priceType: "sale",
  minPrice: "",
  maxPrice: "",
};

interface FilterFormProps {
  filters: StockFilters;
  brands: string[];
  onApply: (filters: StockFilters) => void;
  onClose: () => void;
}

const FilterForm = ({ filters, brands, onApply, onClose }: FilterFormProps) => {
  const form = useForm<StockFilters>({
    defaultValues: filters,
  });

  const brandOptions = brands.map(brand => ({ label: brand, value: brand }));

  const handleApply = form.handleSubmit(values => {
    const minPrice = String(values.minPrice ?? "").trim();
    const maxPrice = String(values.maxPrice ?? "").trim();

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      form.setError("maxPrice", {
        type: "validate",
        message: "Max price must be greater than or equal to min price",
      });
      return;
    }

    onApply({
      brands: values.brands ?? [],
      types: values.types ?? [],
      priceType: values.priceType,
      minPrice,
      maxPrice,
    });
    onClose();
  });

  const handleClear = () => {
    onApply(EMPTY_STOCK_FILTERS);
    onClose();
  };

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-2">
        <Controller
          name="brands"
          control={form.control}
          render={({ field }) => (
            <FilterMultiSelect
              label="Brand"
              placeholder="Select brands"
              options={brandOptions}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="types"
          control={form.control}
          render={({ field }) => (
            <FilterMultiSelect
              label="Type"
              placeholder="Select types"
              options={STOCK_TYPE_OPTIONS}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />

        <FormInput
          field="priceType"
          label="Price Type"
          type="select"
          placeholder="Select price type"
          options={[...PRICE_TYPE_OPTIONS]}
          compact
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput field="minPrice" label="Min Price" type="number" placeholder="0" compact />

          <FormInput field="maxPrice" label="Max Price" type="number" placeholder="Any" compact />
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

interface StockFilterDialogProps {
  filters: StockFilters;
  brands: string[];
  activeCount: number;
  onApply: (filters: StockFilters) => void;
}

export const StockFilterDialog = ({
  filters,
  brands,
  activeCount,
  onApply,
}: StockFilterDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ReuseableDialog
      title="Filter Stocks"
      open={open}
      setOpen={setOpen}
      triggerButton={
        <button
          type="button"
          aria-label="Filter stocks"
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
      content={
        <FilterForm
          filters={filters}
          brands={brands}
          onApply={onApply}
          onClose={() => setOpen(false)}
        />
      }
    />
  );
};
