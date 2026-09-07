"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ClipboardList } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useAllOrders } from "./useAllOrders";
import { OrdersTable, OrdersSearch } from "./blocks";

export const AllOrders = () => {
  const {
    orders,
    loading,
    loadingMore,
    hasMore,
    total,
    search,
    onSearchChange,
    loadMore,
    onClaimItem,
    onReturnItem,
  } = useAllOrders();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="pb-12 md:mt-6.25 lg:mt-7.5">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
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
                {total} order{total !== 1 ? "s" : ""} placed
              </p>
            </div>
          </div>
        </div>

        <OrdersSearch value={search} onChange={onSearchChange} />
      </div>

      <OrdersTable
        orders={orders}
        loading={loading}
        onClaimItem={onClaimItem}
        onReturnItem={onReturnItem}
      />

      {!loading && hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loadingMore && <Loader label="more orders" />}
        </div>
      )}
    </div>
  );
};
