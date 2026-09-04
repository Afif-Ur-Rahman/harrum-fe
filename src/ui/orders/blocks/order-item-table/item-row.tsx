"use client";

import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2, Package, Plus, Palette } from "lucide-react";
import { Stock } from "@/types";
import { VariantRow } from "./variant-row";
import { OrderFormType, OrderItemFormType } from "../../form";
import {
  getUnitPrice,
  ItemPriceSelector,
  PriceType,
} from "../item-price-selector";

interface ItemRowProps {
  item: OrderItemFormType;
  index: number;
  stock?: Stock;
  removeItem: (index: number) => void;
  isLast: boolean;
}

export const ItemRow = ({
  item,
  index,
  stock,
  removeItem,
  isLast,
}: ItemRowProps) => {
  const { control, watch, setValue } = useFormContext<OrderFormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.variants`,
  });

  const selectedVariants = watch(`items.${index}.variants`) || [];
  const priceType = (watch(`items.${index}.priceType`) || "sale") as PriceType;

  const totalQuantity = selectedVariants.reduce(
    (sum, v) => sum + (Number(v.quantity) || 0),
    0,
  );

  const quantitiesKey = selectedVariants.map((v) => v.quantity).join("|");

  useEffect(() => {
    const unitPrice = getUnitPrice(stock, priceType);

    selectedVariants.forEach((variant, variantIdx) => {
      const qty = Number(variant.quantity) || 0;
      const computedPrice = String(unitPrice * qty);

      if (variant.price !== computedPrice) {
        setValue(`items.${index}.variants.${variantIdx}.price`, computedPrice, {
          shouldDirty: true,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantitiesKey, priceType, stock, index]);

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8">
            <Package className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="truncate text-sm font-semibold text-white">
            {item.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ItemPriceSelector
            stock={stock}
            totalQuantity={totalQuantity}
            value={priceType}
            onChange={(value) =>
              setValue(`items.${index}.priceType`, value, {
                shouldValidate: true,
              })
            }
          />

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98]"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
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
            <VariantRow
              key={field.id}
              itemIndex={index}
              variantIndex={variantIdx}
              colorOptions={getColorOptions(variantIdx)}
              maxQuantity={getMaxQuantity(variantIdx)}
              onRemove={() => remove(variantIdx)}
              removeDisabled={fields.length === 1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ color: "", quantity: "", price: "0" })}
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
