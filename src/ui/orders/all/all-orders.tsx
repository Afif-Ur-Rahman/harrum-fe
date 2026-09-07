"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useAllOrders } from "./useAllOrders";
import { OrdersTable } from "./blocks";

export const AllOrders = () => {
  const { orders, loading, onClaimItem, onReturnItem } = useAllOrders();

  return (
    <div className="pb-12 md:mt-6.25 lg:mt-7.5">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/super-admin/orders"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          aria-label="Back to orders"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
            <ClipboardList className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              All Orders
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
        </div>
      </div>

      <OrdersTable
        orders={orders}
        loading={loading}
        onClaimItem={onClaimItem}
        onReturnItem={onReturnItem}
      />
    </div>
  );
};
