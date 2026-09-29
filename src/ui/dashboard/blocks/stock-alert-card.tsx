import { AlertTriangle, X } from "lucide-react";

import { StockAlertItem } from "@/types";

interface StockAlertCardProps {
  alerts: StockAlertItem[];
  loading?: boolean;
  onDismiss: (alert: StockAlertItem) => void;
}

export const StockAlertCard = ({ alerts, loading = false, onDismiss }: StockAlertCardProps) => {
  const lowStockCount = alerts.filter(alert => alert.status === "Low").length;
  const criticalStockCount = alerts.filter(alert => alert.status === "Critical").length;

  return (
    <section className="flex min-h-0 flex-col rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold whitespace-nowrap text-white">Stock Alerts</h2>

            {!loading && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-amber-300">
                  {lowStockCount} Low
                </span>

                <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-rose-300">
                  {criticalStockCount} Critical
                </span>
              </div>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">Products that need attention</p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto pt-2 pr-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-white/10">
            <p className="text-xs text-slate-500">No stock alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={`${alert.id}-${index}`}
                className="relative flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-3"
              >
                <button
                  type="button"
                  onClick={() => onDismiss(alert)}
                  aria-label={`Dismiss alert for ${alert.name}`}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-400 shadow-md transition hover:bg-rose-500/20 hover:text-rose-200 active:scale-95"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{alert.name}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    {alert.brand}
                    {alert.color ? ` • ${alert.color}` : ""}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`text-xs font-semibold ${
                      alert.status === "Critical"
                        ? "text-rose-300"
                        : alert.status === "Low"
                          ? "text-amber-300"
                          : "text-slate-300"
                    }`}
                  >
                    {alert.status}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {alert.quantity} / {alert.threshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
