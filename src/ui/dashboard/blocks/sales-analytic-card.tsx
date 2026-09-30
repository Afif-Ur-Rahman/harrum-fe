"use client";

import { LineChart } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { DashboardFilterValue, SalesAnalyticsPoint } from "@/types";
import { formatPrice } from "@/utils";

import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SeriesKey = "revenue" | "orders" | "netIncome";

interface SeriesConfig {
  key: SeriesKey;
  name: string;
  color: string;
  axis: "money" | "count";
  format: (value: number) => string;
}

const SERIES: SeriesConfig[] = [
  {
    key: "revenue",
    name: "Total Revenue",
    color: "#22d3ee",
    axis: "money",
    format: value => `${formatPrice(value) || 0} PKR`,
  },
  {
    key: "orders",
    name: "Orders",
    color: "#e879f9",
    axis: "count",
    format: value => String(value),
  },
  {
    key: "netIncome",
    name: "Net Income",
    color: "#34d399",
    axis: "money",
    format: value => `${formatPrice(value) || 0} PKR`,
  },
];

const AXIS_LABEL_STYLE = {
  colors: "#94a3b8",
  fontSize: "11px",
};

const MAX_X_AXIS_TICKS = 30;

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getChartDescription = (filter: DashboardFilterValue) => {
  if (filter.filter === "today") {
    return "Hourly trend for today";
  }

  if (filter.filter === "last_week") {
    return "Daily trend for the last 7 days";
  }

  if (filter.filter === "last_month") {
    return "Daily trend for the last 30 days";
  }

  if (filter.from && filter.to) {
    return `Daily trend for ${formatDate(filter.from)} – ${formatDate(filter.to)}`;
  }

  return "Daily trend for the selected dates";
};

interface SalesAnalyticsCardProps {
  data: SalesAnalyticsPoint[];
  filter: DashboardFilterValue;
  loading?: boolean;
}

export const SalesAnalyticsCard = ({ data, filter, loading = false }: SalesAnalyticsCardProps) => {
  const [hidden, setHidden] = useState<SeriesKey[]>([]);

  const visible = SERIES.filter(series => !hidden.includes(series.key));

  const toggle = (key: SeriesKey) => {
    setHidden(prev => {
      if (prev.includes(key)) {
        return prev.filter(item => item !== key);
      }

      if (prev.length >= SERIES.length - 1) {
        return prev;
      }

      return [...prev, key];
    });
  };

  const chartSeries = useMemo(
    () =>
      visible.map(series => ({
        name: series.name,
        data: data.map(point => point[series.key]),
      })),
    [visible, data],
  );

  const chartDescription = useMemo(() => getChartDescription(filter), [filter]);

  const options = useMemo<ApexOptions>(() => {
    const netVisible = visible.some(series => series.key === "netIncome");

    const hasNegativeNet = netVisible && data.some(point => point.netIncome < 0);

    const yaxis: Record<string, unknown>[] = [];

    let moneyAnchor: string | null = null;

    visible.forEach(series => {
      if (series.axis === "money") {
        if (!moneyAnchor) {
          moneyAnchor = series.name;

          yaxis.push({
            seriesName: series.name,
            min: hasNegativeNet ? undefined : 0,
            labels: {
              style: AXIS_LABEL_STYLE,
              formatter: (value: number) => formatCompact(value),
            },
          });
        } else {
          yaxis.push({
            seriesName: moneyAnchor,
            show: false,
          });
        }

        return;
      }

      yaxis.push({
        seriesName: series.name,
        opposite: true,
        min: 0,
        forceNiceScale: true,
        labels: {
          style: AXIS_LABEL_STYLE,
          formatter: (value: number) => String(Math.round(value)),
        },
      });
    });

    return {
      chart: {
        type: "line",
        height: 320,
        background: "transparent",
        fontFamily: "inherit",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },

      theme: {
        mode: "dark",
      },

      colors: visible.map(series => series.color),

      stroke: {
        curve: "smooth",
        width: 3,
      },

      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },

      grid: {
        borderColor: "rgba(255,255,255,0.06)",
        strokeDashArray: 4,
      },

      xaxis: {
        categories: data.map(point => point.label),

        tickAmount: data.length > 1 ? Math.min(MAX_X_AXIS_TICKS, data.length - 1) : 1,

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        tooltip: {
          enabled: false,
        },

        labels: {
          rotate: 0,
          hideOverlappingLabels: true,
          style: AXIS_LABEL_STYLE,
        },
      },

      yaxis: yaxis as ApexOptions["yaxis"],

      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,

        x: {
          formatter: (value, opts) => data[opts?.dataPointIndex ?? -1]?.date ?? String(value),
        },

        y: visible.map(series => ({
          formatter: (value: number) => series.format(value),
        })),
      },
    };
  }, [visible, data]);

  return (
    <section className="flex min-h-0 flex-col rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <LineChart className="h-4 w-4 text-cyan-300" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">Sales Analytics</h2>

            <p className="mt-1 text-xs text-slate-500">{chartDescription}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SERIES.map(series => {
            const isHidden = hidden.includes(series.key);
            const isLastVisible = !isHidden && visible.length === 1;

            return (
              <button
                key={series.key}
                type="button"
                onClick={() => toggle(series.key)}
                aria-pressed={!isHidden}
                disabled={isLastVisible}
                title={isLastVisible ? "At least one line must stay visible" : undefined}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition active:scale-[0.98] disabled:cursor-not-allowed ${
                  isHidden
                    ? "border-white/10 bg-transparent text-slate-500 line-through hover:text-slate-300"
                    : "border-white/10 bg-white/8 text-slate-200 hover:bg-white/12"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: isHidden ? "#475569" : series.color,
                  }}
                />

                {series.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
      ) : (
        <Chart
          key={visible.map(series => series.key).join("-")}
          type="line"
          height={320}
          options={options}
          series={chartSeries}
        />
      )}
    </section>
  );
};
