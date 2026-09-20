"use client";

import { Package, PackageSearch } from "lucide-react";
import { EmptyState } from "@/components";
import { Loader } from "@/components/ui/loader";
import { VendorStockItem } from "@/types";
import { formatDateTime, formatPrice } from "@/utils";
import { useVendorStocks } from "../useVendorStocks";

const StockItemCard = ({ item }: { item: VendorStockItem }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
          <Package className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{item.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {item.brand} · {item.type.replaceAll("_", " ")} · {item.size}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-rose-300">
          {formatPrice(item.purchasedAmount)}{" "}
          <span className="text-xs font-normal text-slate-400">PKR</span>
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {item.purchasedQuantity} purchased · {item.inStock} in stock
        </p>
      </div>
    </div>

    {item.variants.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.variants.map((variant) => (
          <span
            key={variant.color}
            className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[11px] text-slate-300"
          >
            {variant.color} · {variant.quantity}
          </span>
        ))}
      </div>
    )}

    {item.purchases.length > 0 && (
      <div className="mt-3 space-y-1.5 rounded-xl bg-black/20 p-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Purchases
        </p>

        {item.purchases.map((purchase) => (
          <div
            key={purchase._id}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="text-slate-400">
              {formatDateTime(purchase.date, true)}
            </span>

            <span className="text-slate-300">
              {purchase.quantity} × {formatPrice(purchase.purchasePrice)}
            </span>

            <span className="font-semibold text-slate-200">
              {formatPrice(purchase.totalAmount)}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const VendorStocks = ({ vendorId }: { vendorId: string }) => {
  const { items, totals, loading } = useVendorStocks(vendorId, {
    autoFetch: true,
  });

  if (loading) {
    return <Loader label="stock items" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No stock items yet"
        description="No stock has been purchased from this vendor."
        showGlow={false}
        className="border-none! bg-transparent! shadow-none! backdrop-blur-none!"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Items", value: String(totals.itemsCount) },
          { label: "Quantity", value: String(totals.totalQuantity) },
          { label: "Total (PKR)", value: formatPrice(totals.totalAmount) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {stat.label}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {items.map((item) => (
        <StockItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};
