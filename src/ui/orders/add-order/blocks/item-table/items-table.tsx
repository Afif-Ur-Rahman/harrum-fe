"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import { Stock } from "@/types";

import { ItemRow } from "./item-row";

import { OrderFormType, OrderItemFormType } from "../../form";

interface ItemsTableProps {
  items: OrderItemFormType[];
  stocks: Stock[];
  removeItem: (index: number) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({ items, stocks, removeItem }) => {
  useFormContext<OrderFormType>();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

      <div className="relative">
        <div className="border-b border-white/10 bg-white/8 px-3 py-2">
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Order Items
          </p>
          <span />
        </div>

        <div className="columns-1 gap-2 p-2 sm:columns-2 lg:columns-3">
          {items.map((item, idx) => (
            <div key={item.stockId || idx} className="mb-2 break-inside-avoid">
              <ItemRow
                item={item}
                index={idx}
                stock={stocks.find(s => s._id === item.stockId)}
                removeItem={removeItem}
                showBorder={(idx + 1) % 3}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
