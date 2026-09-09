"use client";

import { Palette, RotateCcw, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/utils";
import { OrderItem } from "@/types";

interface ItemDetailsProps {
  item: OrderItem;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  return (
    <div className="rounded-lg border border-white/5 bg-white/5 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{item.name}</p>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
            {item.priceType || "Sale"}
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-cyan-300">
          {formatPrice(
            item.variants.reduce(
              (sum, variant) => sum + Number(variant.price || 0),
              0,
            ),
          )}{" "}
          <span className="text-[10px] font-normal text-slate-500">PKR</span>
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {item.variants.map((variant) => (
          <div
            key={variant._id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-black/20 px-2.5 py-2"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-slate-500" />

              <span className="text-xs text-slate-300">
                {variant.color || "No color"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {variant.quantity} pcs
              </span>

              <span className="text-xs font-medium text-slate-300">
                {formatPrice(variant.price)} PKR
              </span>
            </div>
          </div>
        ))}
      </div>

      {item.variants.some((variant) => variant.isReturned) && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-300">
          <RotateCcw className="h-3 w-3" />
          Item has been returned
        </div>
      )}

      {item.variants.some((variant) => variant.isClaimed) && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-violet-300">
          <ShieldCheck className="h-3 w-3" />
          Sent for company claim
        </div>
      )}
    </div>
  );
};
