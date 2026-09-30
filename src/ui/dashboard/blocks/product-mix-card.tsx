"use client";

import { Loader, Package } from "lucide-react";

import { EmptyState } from "@/components";
import { DashboardFilterValue, TopProductItem } from "@/types";
import { formatPrice } from "@/utils";

interface ProductMixCardProps {
  products: TopProductItem[];
  totalUnits: number;
  filter: DashboardFilterValue;
  loading?: boolean;
}

const productColorHex = ["#22d3ee", "#e879f9", "#34d399", "#fbbf24", "#fb7185"];

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getProductMixDescription = (filter: DashboardFilterValue) => {
  if (filter.filter === "today") {
    return "Product sales for today";
  }

  if (filter.filter === "last_week") {
    return "Product sales for the last 7 days";
  }

  if (filter.filter === "last_month") {
    return "Product sales for the last 30 days";
  }

  if (filter.from && filter.to) {
    return `Product sales for ${formatDate(filter.from)} – ${formatDate(filter.to)}`;
  }

  return "Product sales for the selected dates";
};

const buildGradient = (products: TopProductItem[], totalUnits: number) => {
  if (!products.length || !totalUnits) {
    return "conic-gradient(#1e293b 0 100%)";
  }

  let current = 0;

  const stops = products.map((product, index) => {
    const start = current;
    current += product.share;

    const end = index === products.length - 1 ? 100 : Math.min(current, 100);

    return `${productColorHex[index]} ${start}% ${end}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
};

export const ProductMixCard = ({
  products,
  totalUnits,
  filter,
  loading = false,
}: ProductMixCardProps) => {
  const description = getProductMixDescription(filter);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex shrink-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10">
          <Package className="h-4 w-4 text-fuchsia-300" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white">Product Mix</h2>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {loading ? (
        <div className="flex min-h-70 items-center justify-center">
          <Loader />
        </div>
      ) : !products.length ? (
        <div className="flex min-h-70 items-center justify-center">
          <EmptyState
            icon={Package}
            title="No product sales"
            description="No products were sold during this period."
            size="compact"
            showGlow={false}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-6">
          <div className="flex justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: buildGradient(products, totalUnits),
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950">
                <span className="text-2xl font-semibold text-white">{formatPrice(totalUnits)}</span>

                <span className="text-[11px] text-slate-500">Total units</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={product.stockId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: productColorHex[index],
                      }}
                    />

                    <span className="truncate text-xs font-medium text-slate-200">
                      {product.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-slate-400">
                    {product.share}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${product.share}%`,
                      backgroundColor: productColorHex[index],
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>
                    {formatPrice(product.units)} {product.size}
                  </span>

                  <span>{formatPrice(product.revenue)} PKR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
