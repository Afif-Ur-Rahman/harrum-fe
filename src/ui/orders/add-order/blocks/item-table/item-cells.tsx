"use client";

import { Plus, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FormInput } from "@/components";
import { Stock } from "@/types";
import { NO_COLOR_VARIANT_TYPES } from "@/ui/stock/constants";

import { VariantRow } from "./variant-row";

import { getUnitPrice, PriceSelector, PriceType } from "../price-selector";

import { OrderFormType, OrderItemFormType } from "../../form";

interface ItemCellsProps {
  item: OrderItemFormType;
  index: number;
  stock?: Stock;
  mode: "price" | "quantity";
}

export const ItemCells = ({ index, stock, mode }: ItemCellsProps) => {
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

  useEffect(() => {
    if (!isNoColorType) return;
    const unitPrice = getUnitPrice(stock, priceType, customPrice);
    const qty = Number(itemQuantity) || 0;
    setValue(`items.${index}.price`, String(unitPrice * qty), { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNoColorType, quantitiesKey, priceType, customPrice, stock, index]);

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

  // ---------- PRICE CELL ----------
  if (mode === "price") {
    return (
      <PriceSelector
        stock={stock}
        totalQuantity={totalQuantity}
        value={priceType}
        customPrice={customPrice}
        onChange={value => setValue(`items.${index}.priceType`, value, { shouldValidate: true })}
        onCustomPriceChange={setCustomPrice}
      />
    );
  }

  // ---------- QUANTITY / COLORS CELL ----------
  if (isNoColorType) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-cyan-300" />
            Qty
          </span>
          <span>
            {stock?.quantity} {stock?.size}
          </span>
        </div>
        <FormInput
          field={`items.${index}.quantity`}
          type="number"
          placeholder="0"
          max={stock?.quantity}
          compact
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
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

      {canAddMoreColors && (
        <button
          type="button"
          onClick={() => append({ color: "", quantity: "", price: "0" })}
          disabled={!canAddMoreColors}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Add color"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
