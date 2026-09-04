"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OrderFormType, OrderItemFormType } from "../../form";
import { Stock } from "@/types";
import { ItemRow } from "./item-row";

interface ItemsTableProps {
  items: OrderItemFormType[];
  stocks: Stock[];
  removeItem: (index: number) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
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
          <ItemRow
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
