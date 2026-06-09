import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { StatItem } from "../types";

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
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${item.accent}`}
      />
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-2xl transition duration-300 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">{item.title}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {item.value}
          </p>
        </div>

        <div
          className={`rounded-2xl bg-linear-to-br ${item.accent} p-3 text-white shadow-lg`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between gap-3">
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            isPositive
              ? "bg-emerald-500/15 text-emerald-200"
              : "bg-rose-500/15 text-rose-200"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {item.change}
        </div>

        <span className="text-xs text-slate-400">{item.subtitle}</span>
      </div>
    </div>
  );
};
