import { Sparkles } from "lucide-react";

const heroStats = [
  {
    label: "Live Orders",
    value: "1,284",
    valueClassName: "text-white",
    className: "bg-black/20",
  },
  {
    label: "Pending Alerts",
    value: "16",
    valueClassName: "text-amber-300",
    className: "bg-black/20",
  },
  {
    label: "Growth Score",
    value: "92%",
    valueClassName: "text-white",
    className:
      "col-span-2 bg-linear-to-r from-cyan-500/20 to-fuchsia-500/20 sm:col-span-1",
  },
];

export const DashboardHero = () => {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)] lg:block" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Performance Overview
          </div>

          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl xl:text-5xl">
            Welcome Back,
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Monitor revenue, stock pressure, product demand, and purchase
            momentum from one responsive dashboard built for desktop, tablet,
            and mobile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:min-w-105">
          {heroStats.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-white/10 p-4 ${item.className}`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p
                className={`mt-2 text-2xl font-semibold ${item.valueClassName}`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
