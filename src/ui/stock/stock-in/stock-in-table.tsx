"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { StockItemType } from "../form/schema";
import { Trash2 } from "lucide-react";
import { usePersistStore } from "@/store/presistStore";

interface StockInTableProps {
  stockData: StockItemType[];
  unitOptions: { label: string; value: string }[];
  removeField: (name: string) => void;
}

const UNITS = ["KG", "L", "Pcs"];

const StockRow = ({
  row,
  idx,
  currency,
  removeField,
  isLast,
}: {
  row: StockItemType;
  idx: number;
  currency: string;
  removeField: (name: string) => void;
  isLast: boolean;
}) => {
  const { register } = useFormContext();

  return (
    <div className={`grid grid-cols-[1fr_80px_80px_100px_36px] gap-3 items-center px-4 py-3 ${!isLast ? "border-b border-gray-100" : ""}`}>
      {/* Name + current stock */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{row.name}</p>
        <p className="text-xs text-gray-400">
          Stock: {row.remainingQuantity} {row.unit}
        </p>
      </div>

      {/* Add Qty */}
      <input
        type="number"
        min="0"
        step="any"
        placeholder="0"
        {...register(`stockItems.${idx}.newQuantity`)}
        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
        onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
        className="w-full h-8 px-2 rounded-lg border border-gray-200 text-sm font-medium text-center focus:outline-none focus:border-emerald-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {/* Unit */}
      {row.unit ? (
        <div className="h-8 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-600">{row.unit}</span>
        </div>
      ) : (
        <select
          {...register(`stockItems.${idx}.unit`)}
          className="w-full h-8 px-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-400 transition bg-white"
        >
          <option value="">—</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      )}

      {/* Price */}
      <div>
        <input
          type="number"
          min="0"
          step="any"
          placeholder="0"
          {...register(`stockItems.${idx}.newPrice`)}
          onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          className="w-full h-8 px-2 rounded-lg border border-gray-200 text-sm font-medium text-center focus:outline-none focus:border-emerald-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {Number(row.oldPrice) > 0 && (
          <p className="text-[10px] text-gray-400 mt-0.5 text-center">
            prev {Number(row.oldPrice).toFixed(2)}
          </p>
        )}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => removeField(row.name)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const StockInTable: React.FC<StockInTableProps> = ({
  stockData,
  removeField,
}) => {
  const { user } = usePersistStore();
  const currency = user?.currency || user?.restaurant?.currency || "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px_100px_36px] gap-3 px-4 py-2 bg-gray-50 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Item</p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center">Qty</p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center">Unit</p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center">
          Price {currency ? `(${currency})` : ""}
        </p>
        <span />
      </div>

      {/* Rows */}
      {stockData.map((row, idx) => (
        <StockRow
          key={row._id || row.name}
          row={row}
          idx={idx}
          currency={currency}
          removeField={removeField}
          isLast={idx === stockData.length - 1}
        />
      ))}
    </div>
  );
};
