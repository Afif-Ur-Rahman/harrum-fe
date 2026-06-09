import { TriangleAlert } from "lucide-react";

import { stockAlerts } from "../data";
import { getStatusStyles } from "../utils";

export const StockAlertCard = () => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-200">
            Inventory Watch
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Stock Alert
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1.5 text-sm text-rose-100">
          <TriangleAlert className="h-4 w-4" />6 urgent products need attention
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
        <table className="min-w-full text-left">
          <thead className="bg-white/5 text-sm uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Quantity</th>
              <th className="px-5 py-4">Alert Amt.</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {stockAlerts.map((item) => (
              <tr
                key={item.id}
                className="border-t border-white/10 text-sm text-slate-200"
              >
                <td className="px-5 py-4 font-medium text-white">{item.id}</td>
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4">{item.quantity}</td>
                <td className="px-5 py-4">{item.threshold}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {stockAlerts.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-white">{item.id}</p>
                <p className="mt-1 text-sm text-slate-400">{item.date}</p>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                  item.status,
                )}`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-slate-400">Quantity</p>
                <p className="mt-1 font-medium text-slate-100">
                  {item.quantity}
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-slate-400">Alert Amt.</p>
                <p className="mt-1 font-medium text-slate-100">
                  {item.threshold}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
