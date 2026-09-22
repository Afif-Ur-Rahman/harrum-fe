"use client";

import { Trash2, Plus, Palette, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FormInput } from "@/components";
import { Stock } from "@/types";
import { NO_COLOR_VARIANT_TYPES } from "@/ui/stock/constants";

import { VariantRow } from "./variant-row";

import { getUnitPrice, PriceSelector, PriceType } from "../price-selector";

import { OrderFormType, OrderItemFormType } from "../../form";

interface ItemRowProps {
  item: OrderItemFormType;
  index: number;
  stock?: Stock;
  removeItem: (index: number) => void;
  showBorder: number;
}

export const ItemRow = ({ item, index, stock, removeItem, showBorder }: ItemRowProps) => {
  const { control, watch, setValue } = useFormContext<OrderFormType>();

  const [customPrice, setCustomPrice] = useState("");

  const isNoColorType = stock ? NO_COLOR_VARIANT_TYPES.includes(stock.type) : false;

  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.variants`,
  });

  const selectedVariants = watch(`items.${index}.variants`) || [];
  const itemQuantity = watch(`items.${index}.quantity`) || "";
  const priceType = (watch(`items.${index}.priceType`) || "sale") as PriceType;

  const totalQuantity = isNoColorType
    ? Number(itemQuantity) || 0
    : selectedVariants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);

  const quantitiesKey = isNoColorType
    ? itemQuantity
    : selectedVariants.map(v => v.quantity).join("|");

  // No-color stock: compute price at the item level
  useEffect(() => {
    if (!isNoColorType) return;

    const unitPrice = getUnitPrice(stock, priceType, customPrice);
    const qty = Number(itemQuantity) || 0;
    const computedPrice = String(unitPrice * qty);

    setValue(`items.${index}.price`, computedPrice, { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNoColorType, quantitiesKey, priceType, customPrice, stock, index]);

  // Color-variant stock: compute price per variant
  useEffect(() => {
    if (isNoColorType) return;

    const unitPrice = getUnitPrice(stock, priceType, customPrice);

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
  }, [isNoColorType, quantitiesKey, priceType, customPrice, stock, index]);

  const getColorOptions = (variantIdx: number) => {
    const currentColor = selectedVariants[variantIdx]?.color;

    return (
      stock?.variants
        ?.filter(variant => {
          const alreadyUsed = selectedVariants.some(
            (v, i) => i !== variantIdx && v.color === variant.color,
          );
          return !alreadyUsed || variant.color === currentColor;
        })
        .map(variant => ({
          label: `${variant.color} (${variant.quantity} ${stock.size})`,
          value: variant.color,
        })) || []
    );
  };

  const getMaxQuantity = (variantIdx: number) => {
    const color = selectedVariants[variantIdx]?.color;
    return stock?.variants?.find(v => v.color === color)?.quantity;
  };

  const canAddMoreColors = fields.length < (stock?.variants?.length || 0);

  return (
    <div className={`${showBorder ? "sm:border-r sm:border-white/10 sm:pr-2" : ""}`}>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-white">{item.name}</p>

        <div className="flex flex-1 items-center justify-between gap-2 sm:flex-0 sm:justify-center">
          <PriceSelector
            stock={stock}
            totalQuantity={totalQuantity}
            value={priceType}
            customPrice={customPrice}
            onChange={value =>
              setValue(`items.${index}.priceType`, value, {
                shouldValidate: true,
              })
            }
            onCustomPriceChange={setCustomPrice}
          />

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-300 transition hover:bg-red-400/15 hover:text-red-200 active:scale-[0.98]"
            aria-label="Remove item"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isNoColorType ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/8 px-3 py-2">
            <div className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Quantity
              </span>
            </div>
            <span className="text-[11px]">
              {stock?.quantity} {stock?.size}
            </span>
          </div>

          <div className="px-3 py-2.5">
            <FormInput
              field={`items.${index}.quantity`}
              type="number"
              placeholder="0"
              max={stock?.quantity}
              compact
            />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
            className="flex w-full items-center justify-center gap-1.5 border-t border-white/10 px-3 py-2 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-3 w-3" />
            {canAddMoreColors ? "Add color" : "All colors added"}
          </button>
        </div>
      )}
    </div>
  );
};
