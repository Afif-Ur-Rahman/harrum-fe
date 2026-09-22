"use client";

import { Search, X, PlusCircle, CheckCircle2 } from "lucide-react";
import { useMemo, useRef, useState, RefObject } from "react";

import { Stock } from "@/types";

interface StockOption {
  value: string;
  label: string;
  stock: Stock;
}

interface StockSearchAddProps {
  stockOptions: StockOption[];
  selectedStockIds?: (string | undefined)[];
  onCreateNew: (name: string) => void;
  onSelectExisting: (stock: Stock) => void;
  tableRef?: RefObject<HTMLDivElement | null>;
}

export const StockSearchAdd = ({
  stockOptions,
  selectedStockIds = [],
  onCreateNew,
  onSelectExisting,
  tableRef,
}: StockSearchAddProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const trimmedQuery = query.trim();

  const availableOptions = useMemo(
    () => stockOptions.filter(option => !selectedStockIds.includes(option.value)),
    [stockOptions, selectedStockIds],
  );

  const matchingAll = useMemo(() => {
    if (trimmedQuery.length === 0) return [];
    const q = trimmedQuery.toLowerCase();
    return stockOptions.filter(option => option.label.toLowerCase().includes(q));
  }, [stockOptions, trimmedQuery]);

  const filtered =
    trimmedQuery.length > 0
      ? matchingAll.filter(option => !selectedStockIds.includes(option.value))
      : availableOptions;

  const isAlreadySelected =
    trimmedQuery.length > 0 && matchingAll.length > 0 && filtered.length === 0;

  const canCreateNew = trimmedQuery.length > 0 && matchingAll.length === 0;

  const handleOpen = () => {
    clearTimeout(blurTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    setQuery("");
    setOpen(false);
  };

  const handleCreateNew = () => {
    if (!canCreateNew) return;

    onCreateNew(trimmedQuery);
    setQuery("");
    setOpen(false);
  };

  const handleSelectExisting = (stock: Stock) => {
    onSelectExisting(stock);
    setQuery("");
    setOpen(false);
  };

  const handleEnter = () => {
    if (canCreateNew) {
      handleCreateNew();
      return;
    }

    if (filtered.length > 0) {
      handleSelectExisting(filtered[0].stock);
    }
  };

  return (
    <div className="relative z-50 w-full max-w-72">
      <div className="relative">
        <div
          className={`flex h-8.5 items-center gap-2 rounded-2xl border px-3 shadow-lg shadow-black/10 transition-all ${
            open
              ? "border-cyan-300/60 bg-white/12 ring-2 ring-cyan-300/10"
              : "border-white/10 bg-white/8 hover:bg-white/10"
          }`}
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />

          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={handleOpen}
            onBlur={() => {
              blurTimer.current = setTimeout(() => setOpen(false), 150);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleEnter();
              } else if (e.key === "Tab") {
                const firstInput = tableRef?.current?.querySelector<HTMLInputElement>("input");

                if (firstInput) {
                  e.preventDefault();
                  setOpen(false);
                  firstInput.focus();
                }
              }
            }}
            placeholder="Search or add stock item..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white"
          />

          {open || query ? (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1 text-white transition hover:bg-white/10"
              aria-label="Clear stock search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {open && (
          <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%)]" />

            <div className="relative z-10 max-h-60 overflow-y-auto">
              {isAlreadySelected ? (
                <div className="flex items-center gap-3 px-4 py-3 text-left text-sm text-amber-300">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                  </div>

                  <span>
                    <span className="block font-semibold text-white">Already selected</span>

                    <span className="block text-xs text-slate-400">
                      “{trimmedQuery}” has already been added to this order
                    </span>
                  </span>
                </div>
              ) : canCreateNew ? (
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    handleCreateNew();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
                    <PlusCircle className="h-4 w-4 text-cyan-300" />
                  </div>

                  <span>
                    <span className="block font-semibold text-white">No matching stock found</span>

                    <span className="block text-xs text-slate-400">
                      Click to add “{trimmedQuery}” as a new stock item
                    </span>
                  </span>
                </button>
              ) : filtered.length > 0 ? (
                <div className="py-1">
                  {filtered.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault();
                        handleSelectExisting(option.stock);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-1 text-left transition hover:bg-white/8"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="block truncate text-sm text-white">
                          {option.stock.name}
                        </span>
                        <span className="block truncate text-xs text-slate-400">
                          {option.stock.brand}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-400">All items have been selected</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
