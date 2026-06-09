import { PackageCheck } from "lucide-react";

import { productColors, topProducts } from "../data";

export const ProductMixCard = () => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-200">
            Product Mix
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Top Selling Products
          </h2>
        </div>

        <PackageCheck className="h-6 w-6 text-slate-300" />
      </div>

      <div className="mt-8 flex justify-center">
        <div className="relative h-64 w-64 sm:h-72 sm:w-72">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(#22d3ee 0 34%, #f472b6 34% 62%, #a78bfa 62% 84%, #f59e0b 84% 100%)",
            }}
          />
          <div className="absolute inset-[22%] rounded-full bg-slate-950/95 shadow-inner shadow-black/50" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Sold Units
            </span>
            <span className="mt-2 text-4xl font-semibold text-white">
              1,339
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {topProducts.map((product, index) => {
          const colorClass = productColors[index];

          return (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${colorClass}`} />
                  <span className="truncate text-sm font-medium text-slate-200">
                    {product.name}
                  </span>
                </div>

                <span className="text-sm text-slate-400">{product.share}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className={`h-2 rounded-full ${colorClass}`}
                  style={{ width: `${product.share}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
