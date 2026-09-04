"use client";

import { useMemo, useRef, useState } from "react";
import { Search, X, PackageCheck } from "lucide-react";
import { Stock } from "@/types";

interface StockOption {
  value: string;
  label: string;
  stock: Stock;
}

interface ItemSearchProps {
  stockOptions: StockOption[];
  selectedStockIds: string[];
  onSelectItem: (stock: Stock) => void;
}

export const ItemSearch = ({
  stockOptions,
  selectedStockIds,
  onSelectItem,
}: ItemSearchProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const trimmedQuery = query.trim();

  const availableOptions = useMemo(
    () =>
      stockOptions.filter((option) => !selectedStockIds.includes(option.value)),
    [stockOptions, selectedStockIds],
  );

  const filtered =
    trimmedQuery.length > 0
      ? availableOptions.filter((option) =>
          option.label.toLowerCase().includes(trimmedQuery.toLowerCase()),
        )
      : availableOptions;

  const handleOpen = () => {
    clearTimeout(blurTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    setQuery("");
    setOpen(false);
  };

  const handleSelect = (stock: Stock) => {
    onSelectItem(stock);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative z-50 overflow-visible rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white">
          Add Item
        </p>

        <div className="relative">
          <div
            className={`flex h-11 items-center gap-2 rounded-2xl border px-3 shadow-lg shadow-black/10 transition-all ${
              open
                ? "border-cyan-300/60 bg-white/12 ring-2 ring-cyan-300/10"
                : "border-white/10 bg-white/8 hover:bg-white/10"
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-slate-400" />

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={handleOpen}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setOpen(false), 150);
              }}
              placeholder="Search item to add..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white"
            />

            {open || query ? (
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-white transition hover:bg-white/10"
                aria-label="Clear item search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {open && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)]" />

              <div className="relative z-10 max-h-60 overflow-y-auto">
                {filtered.length > 0 ? (
                  <div className="py-1">
                    {filtered.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(option.stock);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/8"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10">
                          <PackageCheck className="h-4 w-4 text-emerald-300" />
                        </div>

                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">
                            {option.stock.name}
                          </span>
                          <span className="block truncate text-xs text-slate-400">
                            {option.stock.brand}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-400">
                    {trimmedQuery.length > 0
                      ? "No matching items found"
                      : "All items have been selected"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
