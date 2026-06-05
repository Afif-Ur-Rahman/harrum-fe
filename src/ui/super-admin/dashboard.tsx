"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  PackageCheck,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$84.2K",
    change: "+12.4%",
    trend: "up",
    subtitle: "vs last month",
    icon: DollarSign,
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/20",
  },
  {
    title: "Sales Return",
    value: "1,248",
    change: "-3.1%",
    trend: "down",
    subtitle: "refund requests",
    icon: RotateCcw,
    accent: "from-rose-500 via-orange-500 to-amber-500",
    glow: "shadow-orange-500/20",
  },
  {
    title: "Purchases",
    value: "5,620",
    change: "+8.2%",
    trend: "up",
    subtitle: "processed orders",
    icon: ShoppingCart,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    glow: "shadow-fuchsia-500/20",
  },
  {
    title: "Net Income",
    value: "$23.9K",
    change: "+18.6%",
    trend: "up",
    subtitle: "operating profit",
    icon: TrendingUp,
    accent: "from-sky-500 via-indigo-500 to-blue-600",
    glow: "shadow-blue-500/20",
  },
];

const salesBars = [
  { label: "Jan", purchase: 62, income: 85 },
  { label: "Feb", purchase: 74, income: 61 },
  { label: "Mar", purchase: 68, income: 92 },
  { label: "Apr", purchase: 84, income: 70 },
  { label: "May", purchase: 58, income: 88 },
  { label: "Jun", purchase: 79, income: 96 },
];

const stockAlerts = [
  {
    id: "#ST-1021",
    date: "07 May 2026",
    quantity: "12 pcs",
    threshold: "20 pcs",
    status: "Critical",
  },
  {
    id: "#ST-1038",
    date: "07 May 2026",
    quantity: "18 pcs",
    threshold: "25 pcs",
    status: "Low",
  },
  {
    id: "#ST-1052",
    date: "06 May 2026",
    quantity: "09 pcs",
    threshold: "15 pcs",
    status: "Critical",
  },
  {
    id: "#ST-1084",
    date: "05 May 2026",
    quantity: "21 pcs",
    threshold: "30 pcs",
    status: "Moderate",
  },
];

const topProducts = [
  { name: "Premium Hoodie", orders: 426, revenue: "$12.4K", share: 34 },
  { name: "Oversized T-Shirt", orders: 388, revenue: "$10.1K", share: 28 },
  { name: "Slim Fit Jeans", orders: 310, revenue: "$8.7K", share: 22 },
  { name: "Casual Shirt", orders: 215, revenue: "$6.2K", share: 16 },
];

function getStatusStyles(status: string) {
  if (status === "Critical") {
    return "bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-400/30";
  }

  if (status === "Low") {
    return "bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-300/30";
  }

  return "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30";
}

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.16),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_55%)] lg:block" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Performance Overview
                </div>

                <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl xl:text-5xl">
                  Welcome back, Super Admin
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor revenue, stock pressure, product demand, and purchase
                  momentum from one responsive dashboard built for desktop,
                  tablet, and mobile.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:min-w-[420px]">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Live Orders
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">1,284</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Pending Alerts
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-amber-300">16</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 p-4 sm:col-span-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    Growth Score
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">92%</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              const isPositive = item.trend === "up";

              return (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl ${item.glow} backdrop-blur-xl transition duration-300 hover:-translate-y-1`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`}
                  />
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-2xl transition duration-300 group-hover:scale-125" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        {item.title}
                      </p>
                      <p className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {item.value}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl bg-gradient-to-br ${item.accent} p-3 text-white shadow-lg`}
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
            })}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
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

              <div className="grid h-[320px] grid-cols-6 items-end gap-3 sm:gap-4">
                {salesBars.map((item) => (
                  <div key={item.label} className="flex h-full flex-col justify-end">
                    <div className="flex h-full items-end justify-center gap-2">
                      <div className="flex w-full max-w-[28px] flex-col justify-end rounded-full bg-slate-800/80">
                        <div
                          className="rounded-full bg-gradient-to-t from-cyan-600 to-cyan-300"
                          style={{ height: `${item.purchase}%` }}
                        />
                      </div>
                      <div className="flex w-full max-w-[28px] flex-col justify-end rounded-full bg-slate-800/80">
                        <div
                          className="rounded-full bg-gradient-to-t from-fuchsia-700 to-fuchsia-300"
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
                  const dots = [
                    "bg-cyan-400",
                    "bg-pink-400",
                    "bg-violet-400",
                    "bg-amber-400",
                  ];

                  return (
                    <div key={product.name} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-3 w-3 rounded-full ${dots[index]}`}
                          />
                          <span className="truncate text-sm font-medium text-slate-200">
                            {product.name}
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">
                          {product.share}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div
                          className={`h-2 rounded-full ${dots[index]}`}
                          style={{ width: `${product.share}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
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
                  <TriangleAlert className="h-4 w-4" />
                  6 urgent products need attention
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
                        <td className="px-5 py-4 font-medium text-white">
                          {item.id}
                        </td>
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
                        <p className="text-base font-semibold text-white">
                          {item.id}
                        </p>
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
                      <div className="h-12 w-24 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/20 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
