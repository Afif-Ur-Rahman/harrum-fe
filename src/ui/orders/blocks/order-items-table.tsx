"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Trash2, Package } from "lucide-react";
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
  const colorOptions =
    stock?.variants?.map((variant) => ({
      label: `${variant.color} (${variant.quantity} available)`,
      value: variant.color,
    })) || [];

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput
          field={`items.${index}.color`}
          label="Color"
          type="select"
          placeholder="Select color"
          options={colorOptions}
        />

        <FormInput
          field={`items.${index}.quantity`}
          label="Quantity"
          type="number"
          placeholder="0"
        />
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
