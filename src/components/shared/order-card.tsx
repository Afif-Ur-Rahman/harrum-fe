"use client";

import { ReactNode } from "react";
import { ChevronDown, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MainOrder } from "@/types/orders";
import { formatPrice } from "@/utils";
import StatusBadge from "@/components/ui/statusBadge";

export const STATUS_BORDER: Record<string, string> = {
  pending:   "border-l-amber-400",
  accepted:  "border-l-blue-400",
  preparing: "border-l-orange-400",
  ready:     "border-l-emerald-400",
  served:    "border-l-violet-400",
  completed: "border-l-gray-300",
  cancelled: "border-l-red-400",
};

export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export interface OrderCardProps {
  order: MainOrder;
  isOpen: boolean;
  onToggle: () => void;
  currency?: string;
  /** Role-specific controls rendered in the header row (status buttons, add, cancel…) */
  actions?: ReactNode;
  /** Expanded body content — typically <OrderDetails> */
  children?: ReactNode;
}

export const OrderCard = ({
  order,
  isOpen,
  onToggle,
  currency = "",
  actions,
  children,
}: OrderCardProps) => {
  const borderColor = STATUS_BORDER[order.status] ?? "border-l-gray-300";
  const totalItems = order.orders.reduce((acc, o) => acc + o.subOrder.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border border-gray-100 border-l-4 ${borderColor} rounded-2xl shadow-sm overflow-hidden transition-colors ${isOpen ? "bg-gray-50" : "bg-white"}`}
    >
      {/* ── Header row ─────────────────────────────────── */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${isOpen ? "bg-gray-900" : "hover:bg-gray-50/60"}`}
        onClick={onToggle}
      >
        {/* Table / delivery icon */}
        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${isOpen ? "bg-white/10" : "bg-gray-100"}`}>
          {order.table ? (
            <>
              <span className={`text-[10px] font-medium leading-none ${isOpen ? "text-white/50" : "text-gray-400"}`}>TBL</span>
              <span className={`text-sm font-bold leading-tight ${isOpen ? "text-white" : "text-gray-800"}`}>{order.table.table}</span>
            </>
          ) : (
            <Truck className={`w-5 h-5 ${isOpen ? "text-white/70" : "text-gray-500"}`} />
          )}
        </div>

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-bold ${isOpen ? "text-white" : "text-gray-900"}`}>
              {order.table ? `Table ${order.table.table}` : order.customerName || "Delivery"}
            </p>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isOpen ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-400"}`}>
              #{order._id.slice(-6).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs ${isOpen ? "text-white/50" : "text-gray-400"}`}>{timeAgo(order.updatedAt)}</span>
            <span className={isOpen ? "text-white/20" : "text-gray-200"}>·</span>
            <span className={`text-xs ${isOpen ? "text-white/50" : "text-gray-400"}`}>
              {order.orders.length} guest{order.orders.length !== 1 ? "s" : ""}
            </span>
            <span className={isOpen ? "text-white/20" : "text-gray-200"}>·</span>
            <span className={`text-xs ${isOpen ? "text-white/50" : "text-gray-400"}`}>
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
        </div>


        {/* Total — hidden on small screens */}
        {order.totalPrice > 0 && (
          <div className="hidden md:block text-right shrink-0">
            <p className={`text-sm font-bold ${isOpen ? "text-white" : "text-gray-900"}`}>
              {formatPrice(order.totalPrice)}
            </p>
            <p className={`text-xs ${isOpen ? "text-white/50" : "text-gray-400"}`}>{currency}</p>
          </div>
        )}

        {/* Actions slot */}
        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
          <StatusBadge status={order.status} />
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-white/60" : "text-gray-400"}`}
        />
      </div>

      {/* ── Expandable body ─────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
