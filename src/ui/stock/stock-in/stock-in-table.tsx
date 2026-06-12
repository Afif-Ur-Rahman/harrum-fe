"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { StockItemType } from "../form/schema";
import { Plus, Trash2, Package, Palette } from "lucide-react";
import { StockFormType } from "../form";
import { FormInput } from "@/components";
import { STOCK_ITEM_FIELDS, VARIANT_FIELDS } from "../constants";

interface StockInTableProps {
  stockData: StockItemType[];
  removeField: (id: string | number) => void;
}

const StockRow = ({
  row,
  idx,
  removeField,
  isLast,
}: {
  row: StockItemType;
  idx: number;
  removeField: (id: string | number) => void;
  isLast: boolean;
}) => {
  const { control } = useFormContext<StockFormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `stockItems.${idx}.variants`,
  });

  return (
    <div
      className={`relative px-4 py-5 ${
        !isLast ? "border-b border-white/10" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8">
              <Package className="h-4 w-4 text-cyan-300" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Item Details
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeField(row._id || idx)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98]"
            aria-label="Remove stock item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {STOCK_ITEM_FIELDS.map(({ name, label, type, placeholder, icon }) => (
            <FormInput
              key={name}
              field={`stockItems.${idx}.${name}`}
              label={label}
              type={type}
              placeholder={placeholder}
              icon={icon}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[1fr_140px_44px] gap-3 border-b border-white/10 bg-white/8 px-4 py-3 max-sm:grid-cols-1">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-cyan-300" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Color Variants
            </p>
          </div>

          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400 max-sm:hidden">
            Quantity
          </p>

          <span className="max-sm:hidden" />
        </div>

        <div className="divide-y divide-white/10">
          {fields.map((field, variantIdx) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_140px_44px] items-start gap-3 bg-white/3 px-4 py-4 transition hover:bg-white/5 max-sm:grid-cols-1"
            >
              {VARIANT_FIELDS.map(
                ({ name, label, type, placeholder, icon }) => (
                  <FormInput
                    key={name}
                    field={`stockItems.${idx}.variants.${variantIdx}.${name}`}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    icon={icon}
                  />
                ),
              )}

              <button
                type="button"
                onClick={() => remove(variantIdx)}
                disabled={fields.length === 1}
                className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 max-sm:mt-0 max-sm:w-full"
                aria-label="Remove color variant"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ color: "", quantity: "" })}
          className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-cyan-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another color
        </button>
      </div>
    </div>
  );
};

export const StockInTable: React.FC<StockInTableProps> = ({
  stockData,
  removeField,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

      <div className="relative z-10">
        <div className="hidden grid-cols-[1fr_44px] gap-5 border-b border-white/10 bg-white/8 px-4 py-3 xl:grid">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Stock Items
          </p>

          <span />
        </div>

        {stockData.map((row, idx) => (
          <StockRow
            key={row._id || idx}
            row={row}
            idx={idx}
            removeField={removeField}
            isLast={idx === stockData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
