"use client";

import { Stats } from "./blocks";
import { useDashboard } from "./useDashboard";
import { usePersistStore } from "@/store/presistStore";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { DatePicker } from "@/components";
import { ArrowRight, ClipboardList } from "lucide-react";

const DATE_OPTIONS = [
  { value: "Today", label: "Today" },
  { value: "Current week", label: "This Week" },
  { value: "Current Month", label: "This Month" },
  { value: "custom", label: "Custom" },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const Dashboard = () => {
  const {
    chart,
    stats,
    recentOrders,
    selectedStatus,
    setSelectedStatus,
    form,
    loading,
  } = useDashboard();
  const { user } = usePersistStore();

  return (
    <div className="pb-12 mt-12.5 md:mt-6.25 lg:mt-7.5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {greeting()}
            {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedStatus === "custom" && (
            <FormProvider {...form}>
              <div className="flex gap-2">
                <DatePicker name="from" placeholder="From" className="w-32" />
                <DatePicker name="to" placeholder="To" className="w-32" />
              </div>
            </FormProvider>
          )}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === opt.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <Stats stats={stats} />

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-xl">
              <ClipboardList className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Recent Orders
              </p>
              <p className="text-xs text-gray-400">
                Latest {Math.min(recentOrders.length, 5)} orders
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
