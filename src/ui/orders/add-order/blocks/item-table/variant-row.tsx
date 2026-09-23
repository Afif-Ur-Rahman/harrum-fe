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
    <div className="relative flex items-center gap-1.5 border-r-3 border-white/10 pr-3 last:border-r-0 last:pr-0">
      <div className="w-fit min-w-48">
        <FormInput
          field={`items.${itemIndex}.variants.${variantIndex}.color`}
          type="select"
          placeholder="Color"
          options={colorOptions}
          compact
          borderRounded="rounded-lg"
        />
      </div>

      <div className="w-16">
        <FormInput
          field={`items.${itemIndex}.variants.${variantIndex}.quantity`}
          type="number"
          placeholder="0"
          max={maxQuantity}
          compact
          borderRounded="rounded-lg"
        />
      </div>

      {!removeDisabled && (
        <button
          type="button"
          onClick={onRemove}
          disabled={removeDisabled}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-red-300/30 bg-slate-950 text-red-300 shadow-sm transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Remove color"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
};
