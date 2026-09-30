"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

import type { DashboardFilter, DashboardFilterValue } from "@/types";
import { toYMD } from "@/utils";

import { DASHBOARD_FILTER_OPTIONS } from "../useDashboard";

interface DashboardFilterProps {
  value: DashboardFilterValue;
  onChange: (value: DashboardFilterValue) => void;
  disabled?: boolean;
}

export const DashboardFilterBar = ({ value, onChange, disabled = false }: DashboardFilterProps) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(value.from);
  const [draftTo, setDraftTo] = useState(value.to);
  const [dateError, setDateError] = useState("");

  const activeFilter: DashboardFilter = isCustomOpen ? "custom" : value.filter;

  const handleOpenChange = (open: boolean) => {
    if (disabled) return;

    if (open) {
      setDraftFrom(value.from);
      setDraftTo(value.to);
      setDateError("");
      setIsCustomOpen(true);
      return;
    }

    setIsCustomOpen(false);
    setDateError("");
  };

  const handlePreset = (filter: DashboardFilter) => {
    if (disabled) return;
    if (filter === "custom") return;

    setIsCustomOpen(false);
    setDateError("");
    onChange({ filter, from: "", to: "" });
  };

  const applyCustomRange = () => {
    if (disabled) return;

    const from = toYMD(draftFrom);
    const to = toYMD(draftTo);

    if (!from || !to) {
      setDateError("Both start and end dates are required");
      return;
    }

    if (new Date(from) > new Date(to)) {
      setDateError("End date must be on or after start date");
      return;
    }

    setDateError("");
    onChange({ filter: "custom", from, to });
    setIsCustomOpen(false);
  };

  const presetOptions = DASHBOARD_FILTER_OPTIONS.filter(option => option.value !== "custom");

  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
      {presetOptions.map(option => {
        const isActive = activeFilter === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => handlePreset(option.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive
                ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100 shadow-sm shadow-cyan-950/20"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}

      <Popover.Root open={isCustomOpen} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
              activeFilter === "custom"
                ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-100 shadow-sm shadow-cyan-950/20"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Custom
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={8}
            collisionPadding={16}
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 w-[min(100vw-2rem,22rem)] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl outline-none"
          >
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                  From
                </span>
                <input
                  type="date"
                  value={draftFrom}
                  disabled={disabled}
                  onChange={e => {
                    setDraftFrom(e.target.value);
                    setDateError("");
                  }}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white transition outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/30 disabled:opacity-50"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                  To
                </span>
                <input
                  type="date"
                  value={draftTo}
                  disabled={disabled}
                  onChange={e => {
                    setDraftTo(e.target.value);
                    setDateError("");
                  }}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white transition outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/30 disabled:opacity-50"
                />
              </label>
            </div>

            {dateError ? <p className="mt-2 text-xs text-rose-300">{dateError}</p> : null}

            <button
              type="button"
              disabled={disabled}
              onClick={applyCustomRange}
              className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
