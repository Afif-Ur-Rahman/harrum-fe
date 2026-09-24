"use client";

import { User, Calendar, BadgeDollarSign, Printer } from "lucide-react";

import { Order } from "@/types";
import { formatDateTime, formatPrice, printOrder } from "@/utils";

import { ItemDetails } from "./item-details";

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-cyan-300" />
          <span className="text-xs text-slate-400">{formatDateTime(order.createdAt, true)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase ${
              order.isPaid
                ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/30 ring-inset"
                : "bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/30 ring-inset"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          <button
            type="button"
            onClick={() => printOrder(order)}
            aria-label="Print invoice"
            title="Print invoice"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 hover:text-cyan-300 active:scale-[0.98]"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 shrink-0 text-slate-400" />

          <span className="truncate text-sm text-slate-300">
            Salesman:{" "}
            <span className="font-medium text-white">{order.salesman?.username || "—"}</span>
          </span>
        </div>

        {order.items.map(item => (
          <ItemDetails key={item._id} item={item} />
        ))}

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <BadgeDollarSign className="h-3.5 w-3.5" />

            <span className="text-xs">Discount: {formatPrice(order.discount) || 0}</span>
          </div>

          <span className="text-lg font-semibold text-cyan-300">
            {formatPrice(order.totalPrice)}{" "}
            <span className="text-xs font-normal text-slate-400">PKR</span>
          </span>
        </div>
      </div>
    </div>
  );
};
