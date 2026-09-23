"use client";

import { Plus, Trash2, Package, Palette, X } from "lucide-react";
import React, { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { FormInput } from "@/components";
import { usePersistStore } from "@/store/presistStore";

import { NO_COLOR_VARIANT_TYPES, STOCK_ITEM_FIELDS, VARIANT_FIELDS } from "../constants";
import { StockFormType } from "../form";
import { StockItemType } from "../form/schema";

interface VendorOption {
  label: string;
  value: string;
}

interface StockInTableProps {
  stockData: StockItemType[];
  removeField: (id: string | number) => void;
  vendorOptions?: VendorOption[];
}

const existingQtyPlaceholder = (current: number | string | undefined | null, fallback: string) => {
  if (current === undefined || current === null || current === "") {
    return fallback;
  }

  return String(current);
};

const StockRow = ({
  row,
  idx,
  removeField,
  vendorOptions = [],
}: {
  row: StockItemType;
  idx: number;
  removeField: (id: string | number) => void;
  vendorOptions?: VendorOption[];
}) => {
  const { control, setValue } = useFormContext<StockFormType>();
  const { stocks } = usePersistStore();

  const existingStock = row._id ? stocks.find(stock => stock._id === row._id) : undefined;

  const { fields, append, remove } = useFieldArray({
    control,
    name: `stockItems.${idx}.variants`,
  });

  const type = useWatch({
    control,
    name: `stockItems.${idx}.type`,
  });

  const hasColorVariants = !NO_COLOR_VARIANT_TYPES.includes(type);

  useEffect(() => {
    if (!hasColorVariants && fields.length > 0) {
      setValue(`stockItems.${idx}.variants`, [], {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasColorVariants]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/8 px-3 py-2">
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-cyan-300" />
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Item Details
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeField(row._id || idx)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98]"
          aria-label="Remove stock item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
        {STOCK_ITEM_FIELDS.map(item => {
          const shouldShow =
            !item.showWhen ||
            item.showWhen({
              type: type ?? "",
            });

          if (!shouldShow) return null;

          const options =
            item.name === "vendor" ? vendorOptions : "options" in item ? item.options : [];

          const placeholder =
            item.name === "quantity"
              ? existingQtyPlaceholder(existingStock?.quantity, item.placeholder)
              : item.placeholder;

          return (
            <FormInput
              key={item.name}
              field={`stockItems.${idx}.${item.name}`}
              type={item.type}
              placeholder={placeholder}
              icon={item.icon}
              options={options}
              required={item.required}
              borderRounded={item.border}
              compact
            />
          );
        })}
      </div>

      {hasColorVariants && (
        <div className="border-t border-white/10">
          <div className="grid grid-cols-[1fr_130px_40px] gap-2 border-b border-white/10 bg-white/8 px-3 py-2 max-sm:grid-cols-1">
            <div className="flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-cyan-300" />
              <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Colors
              </p>
            </div>

            <p className="text-center text-[10px] font-semibold tracking-widest text-slate-400 uppercase max-sm:hidden">
              Qty
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {fields.map((field, variantIdx) => {
              const existingVariantQty = field.color
                ? existingStock?.variants?.find(variant => variant.color === field.color)?.quantity
                : undefined;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_130px_40px] items-center gap-2 bg-white/3 px-3 py-2 transition hover:bg-white/5 max-sm:grid-cols-1"
                >
                  {VARIANT_FIELDS.map(({ name, type, placeholder, icon, border }) => (
                    <FormInput
                      key={name}
                      field={`stockItems.${idx}.variants.${variantIdx}.${name}`}
                      type={type}
                      placeholder={
                        name === "quantity"
                          ? existingQtyPlaceholder(existingVariantQty, placeholder)
                          : placeholder
                      }
                      icon={icon}
                      borderRounded={border}
                      compact
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => remove(variantIdx)}
                    disabled={fields.length === 1}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-white/5 text-red-300 transition hover:bg-red-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 max-sm:w-full"
                    aria-label="Remove color variant"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => append({ color: "", quantity: "" })}
            className="flex w-full items-center justify-center gap-1.5 border-t border-white/10 px-3 py-2 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-cyan-200"
          >
            <Plus className="h-3 w-3" />
            Add another color
          </button>
        </div>
      )}
    </div>
  );
};

export const StockInTable: React.FC<StockInTableProps> = ({
  stockData,
  removeField,
  vendorOptions = [],
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

      <div className="relative">
        <div className="border-b border-white/10 bg-white/8 px-3 py-2">
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Stock Items
          </p>
        </div>

        <div className="columns-1 gap-2 p-2 sm:columns-2 lg:columns-3">
          {stockData.map((row, idx) => (
            <div key={row._id || idx} className="mb-2 break-inside-avoid">
              <StockRow
                row={row}
                idx={idx}
                removeField={removeField}
                vendorOptions={vendorOptions}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
