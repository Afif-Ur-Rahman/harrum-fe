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
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 bg-white/3 px-4 py-2 transition hover:bg-white/5">
      <div className="col-span-1 min-w-0">
        <FormInput
          field={`items.${itemIndex}.variants.${variantIndex}.color`}
          type="select"
          placeholder="Select color"
          options={colorOptions}
          compact
        />
      </div>

      <div className="w-24">
        <FormInput
          field={`items.${itemIndex}.variants.${variantIndex}.quantity`}
          type="number"
          placeholder="0"
          max={maxQuantity}
          compact
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          disabled={removeDisabled}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-red-300/20 bg-white/5 text-red-300 transition hover:bg-red-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Remove color"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
