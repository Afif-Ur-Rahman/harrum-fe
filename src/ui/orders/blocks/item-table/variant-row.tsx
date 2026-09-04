"use client";

import { X } from "lucide-react";
import { FormInput } from "@/components";

interface ColorOption {
  label: string;
  value: string;
}

interface VariantRowProps {
  itemIndex: number;
  variantIndex: number;
  colorOptions: ColorOption[];
  maxQuantity?: number;
  onRemove: () => void;
  removeDisabled: boolean;
}

export const VariantRow = ({
  itemIndex,
  variantIndex,
  colorOptions,
  maxQuantity,
  onRemove,
  removeDisabled,
}: VariantRowProps) => {
  return (
    <div className="grid grid-cols-[1fr_140px_44px] items-center gap-3 bg-white/3 px-4 py-4 transition hover:bg-white/5 max-sm:grid-cols-1">
      <FormInput
        field={`items.${itemIndex}.variants.${variantIndex}.color`}
        type="select"
        placeholder="Select color"
        options={colorOptions}
      />

      <FormInput
        field={`items.${itemIndex}.variants.${variantIndex}.quantity`}
        type="number"
        placeholder="0"
        max={maxQuantity}
      />

      <button
        type="button"
        onClick={onRemove}
        disabled={removeDisabled}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-white/5 text-red-300 transition hover:bg-red-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 max-sm:w-full"
        aria-label="Remove color"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
