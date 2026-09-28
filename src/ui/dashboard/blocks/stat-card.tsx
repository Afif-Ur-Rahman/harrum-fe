import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { StatItem } from "@/types";

interface StatCardProps {
  item: StatItem;
}

export const StatCard = ({ item }: StatCardProps) => {
  const Icon = item.icon;
  const isPositive = item.trend === "up";

  return (
    <div
      className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl ${item.glow} backdrop-blur-xl transition duration-300 hover:-translate-y-1`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${item.accent}`} />

      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 blur-2xl transition duration-300 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-300">{item.title}</p>

          <p className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-2xl">
            {item.value}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-xl bg-linear-to-br ${item.accent} p-2.5 text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-2">
        <div
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            isPositive ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}

          {item.change}
        </div>

        <span className="truncate text-[11px] text-slate-400">{item.subtitle}</span>
      </div>
    </div>
  );
};
