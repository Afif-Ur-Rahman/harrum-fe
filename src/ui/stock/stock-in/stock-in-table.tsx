"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { StockItemType } from "../form/schema";
import { Plus, Trash2 } from "lucide-react";
import { StockFormType } from "../form";

interface StockInTableProps {
  stockData: StockItemType[];
  removeField: (id: string) => void;
}

const StockRow = ({
  row,
  idx,
  removeField,
  isLast,
}: {
  row: StockItemType;
  idx: number;
  removeField: (id: string) => void;
  isLast: boolean;
}) => {
  const { register, control } = useFormContext<StockFormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `stockItems.${idx}.variants`,
  });

  return (
    <div className={`px-4 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="grid grid-cols-[1fr_120px_120px_36px] gap-3 items-start">
        <div className="min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Name"
              {...register(`stockItems.${idx}.name`)}
              className="text-black h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 transition"
            />

            <input
              type="text"
              placeholder="Brand"
              {...register(`stockItems.${idx}.brand`)}
              className="text-black h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 transition"
            />

            <input
              type="text"
              placeholder="Article"
              {...register(`stockItems.${idx}.article`)}
              className="text-black h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <input
            type="text"
            placeholder="Size e.g. meter(s)"
            {...register(`stockItems.${idx}.size`)}
            className="text-black mt-2 h-9 w-full px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 transition"
          />
        </div>

        <div>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Wholesale"
            {...register(`stockItems.${idx}.wholesalePrice`)}
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
            className="text-black w-full h-9 px-2 rounded-lg border border-gray-200 text-sm font-medium text-center focus:outline-none focus:border-emerald-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Sale"
            {...register(`stockItems.${idx}.salePrice`)}
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
            className="text-black w-full h-9 px-2 rounded-lg border border-gray-200 text-sm font-medium text-center focus:outline-none focus:border-emerald-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <button
          type="button"
          onClick={() => removeField(row._id)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_36px] gap-3 px-3 py-2 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Color
          </p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center">
            Quantity
          </p>
          <span />
        </div>

        <div className="divide-y divide-gray-100">
          {fields.map((field, variantIdx) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_120px_36px] gap-3 px-3 py-2 items-center bg-white"
            >
              <input
                type="text"
                placeholder="Color"
                {...register(`stockItems.${idx}.variants.${variantIdx}.color`)}
                className="text-black w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 transition"
              />

              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                {...register(
                  `stockItems.${idx}.variants.${variantIdx}.quantity`,
                )}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                className="text-black w-full h-9 px-2 rounded-lg border border-gray-200 text-sm font-medium text-center focus:outline-none focus:border-emerald-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                type="button"
                onClick={() => remove(variantIdx)}
                disabled={fields.length === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ color: "", quantity: "" })}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition"
        >
          <Plus className="w-3.5 h-3.5" />
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1fr_120px_120px_36px] gap-3 px-4 py-2 bg-gray-50 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Item Details
        </p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center">
          Wholesale
        </p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center">
          Sale
        </p>
        <span />
      </div>

      {stockData.map((row, idx) => (
        <StockRow
          key={row._id}
          row={row}
          idx={idx}
          removeField={removeField}
          isLast={idx === stockData.length - 1}
        />
      ))}
    </div>
  );
};
