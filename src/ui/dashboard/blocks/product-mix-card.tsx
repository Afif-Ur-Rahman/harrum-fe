import { PackageCheck } from "lucide-react";

import { TopProductItem } from "@/types";
import { formatPrice } from "@/utils";

import { productColorHex, productColors } from "../constants";

interface ProductMixCardProps {
  products: TopProductItem[];
  totalUnits: number;
  loading?: boolean;
}

const buildGradient = (products: TopProductItem[], totalUnits: number) => {
  if (!products.length || !totalUnits) return "conic-gradient(#1e293b 0 100%)";

  let acc = 0;

  const stops = products.map((product, index) => {
    const start = acc;
    acc += (product.units / totalUnits) * 100;
    const end = index === products.length - 1 ? 100 : acc;

    return `${productColorHex[index]} ${start}% ${end}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
};

export const ProductMixCard = ({ products, totalUnits, loading = false }: ProductMixCardProps) => {
  return (
    <section className="flex min-h-0 flex-col rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-white">Top Selling Products</h2>
          <p className="mt-1 text-xs text-slate-500">Top 5 this month</p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10">
          <PackageCheck className="h-4 w-4 text-fuchsia-300" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-5">
            <div className="mx-auto h-52 w-52 animate-pulse rounded-full bg-white/5 sm:h-56 sm:w-56" />

            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="relative h-52 w-52 sm:h-56 sm:w-56">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: buildGradient(products, totalUnits) }}
                />
                <div className="absolute inset-[24%] rounded-full bg-slate-950/95 shadow-inner shadow-black/50" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                    Sold Units
                  </span>

                  <span className="mt-1 text-2xl font-bold text-white">
                    {formatPrice(totalUnits) || 0}
                  </span>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="mt-6 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-white/10">
                <p className="text-xs text-slate-500">No sales this month</p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {products.map((product, index) => (
                  <div key={product.stockId} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${productColors[index]}`}
                        />

                        <span className="truncate text-xs font-medium text-white">
                          {product.name}
                        </span>
                      </div>

                      <span className="shrink-0 text-xs text-slate-500">
                        {formatPrice(product.units)} {product.size} · {product.share}%
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div
                        className={`h-1.5 rounded-full ${productColors[index]}`}
                        style={{ width: `${product.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
