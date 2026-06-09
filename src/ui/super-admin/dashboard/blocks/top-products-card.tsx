import { topProducts } from "../data";

export const TopProductsCard = () => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
          Best Performers
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Top Selling Products
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {topProducts.map((product, index) => (
          <div
            key={product.name}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">
                  {index + 1}. {product.name}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {product.orders} orders
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
                {product.share}% share
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Revenue
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {product.revenue}
                </p>
              </div>

              <div className="h-12 w-24 rounded-2xl bg-linear-to-r from-emerald-500/30 via-cyan-500/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
