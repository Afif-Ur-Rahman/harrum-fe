"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2, Package, Plus, Palette, X } from "lucide-react";
import { OrderFormType, OrderItemFormType } from "../form";
import { FormInput } from "@/components";
import { Stock } from "@/types";

interface OrderItemRowProps {
  item: OrderItemFormType;
  index: number;
  stock?: Stock;
  removeItem: (index: number) => void;
  isLast: boolean;
}

const OrderItemRow = ({
  item,
  index,
  stock,
  removeItem,
  isLast,
}: OrderItemRowProps) => {
  const { control, watch } = useFormContext<OrderFormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.variants`,
  });

  const selectedVariants = watch(`items.${index}.variants`) || [];

  const getColorOptions = (variantIdx: number) => {
    const currentColor = selectedVariants[variantIdx]?.color;

    return (
      stock?.variants
        ?.filter((variant) => {
          const alreadyUsed = selectedVariants.some(
            (v, i) => i !== variantIdx && v.color === variant.color,
          );
          return !alreadyUsed || variant.color === currentColor;
        })
        .map((variant) => ({
          label: `${variant.color} (${variant.quantity} ${stock.size})`,
          value: variant.color,
        })) || []
    );
  };

  const getMaxQuantity = (variantIdx: number) => {
    const color = selectedVariants[variantIdx]?.color;
    return stock?.variants?.find((v) => v.color === color)?.quantity;
  };

  const canAddMoreColors = fields.length < (stock?.variants?.length || 0);

  return (
    <div
      className={`relative px-4 py-5 ${!isLast ? "border-b border-white/10" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8">
            <Package className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="truncate text-sm font-semibold text-white">
            {item.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeItem(index)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98]"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[1fr_140px_44px] gap-3 border-b border-white/10 bg-white/8 px-4 py-3 max-sm:grid-cols-1">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-cyan-300" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Colors
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
              className="grid grid-cols-[1fr_140px_44px] items-center gap-3 bg-white/3 px-4 py-4 transition hover:bg-white/5 max-sm:grid-cols-1"
            >
              <FormInput
                field={`items.${index}.variants.${variantIdx}.color`}
                type="select"
                placeholder="Select color"
                options={getColorOptions(variantIdx)}
              />

              <FormInput
                field={`items.${index}.variants.${variantIdx}.quantity`}
                type="number"
                placeholder="0"
                max={getMaxQuantity(variantIdx)}
              />

              <button
                type="button"
                onClick={() => remove(variantIdx)}
                disabled={fields.length === 1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-white/5 text-red-300 transition hover:bg-red-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 max-sm:w-full"
                aria-label="Remove color"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ color: "", quantity: "" })}
          disabled={!canAddMoreColors}
          className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
          {canAddMoreColors ? "Add color" : "All available colors added"}
        </button>
      </div>
    </div>
  );
};

interface OrderItemsTableProps {
  items: OrderItemFormType[];
  stocks: Stock[];
  removeItem: (index: number) => void;
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({
  items,
  stocks,
  removeItem,
}) => {
  useFormContext<OrderFormType>();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

      <div className="relative z-10">
        <div className="hidden grid-cols-[1fr_44px] gap-5 border-b border-white/10 bg-white/8 px-4 py-3 xl:grid">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Order Items
          </p>
          <span />
        </div>

        {items.map((item, idx) => (
          <OrderItemRow
            key={item.stockId || idx}
            item={item}
            index={idx}
            stock={stocks.find((s) => s._id === item.stockId)}
            removeItem={removeItem}
            isLast={idx === items.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
