import { salesBars } from "../data";

export const SalesAnalyticsCard = () => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
            Sales Analytics
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Purchase vs Income Trend
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            Purchase
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full bg-fuchsia-400" />
            Income
          </div>
        </div>
      </div>

      <div className="grid h-80 grid-cols-6 items-end gap-3 sm:gap-4">
        {salesBars.map((item) => (
          <div key={item.label} className="flex h-full flex-col justify-end">
            <div className="flex h-full items-end justify-center gap-2">
              <div className="flex w-full max-w-7 flex-col justify-end rounded-full bg-slate-800/80">
                <div
                  className="rounded-full bg-linear-to-t from-cyan-600 to-cyan-300"
                  style={{ height: `${item.purchase}%` }}
                />
              </div>

              <div className="flex w-full max-w-7 flex-col justify-end rounded-full bg-slate-800/80">
                <div
                  className="rounded-full bg-linear-to-t from-fuchsia-700 to-fuchsia-300"
                  style={{ height: `${item.income}%` }}
                />
              </div>
            </div>

            <span className="mt-3 text-center text-xs font-medium text-slate-400 sm:text-sm">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
