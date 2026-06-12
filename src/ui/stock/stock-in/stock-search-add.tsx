"use client";

import { useRef, useState, RefObject } from "react";
import { Search, X, PlusCircle, PackageCheck } from "lucide-react";
import { Stock } from "@/types";

interface StockOption {
  value: string;
  label: string;
  stock: Stock;
}

interface StockSearchAddProps {
  stockOptions: StockOption[];
  onCreateNew: (name: string) => void;
  onSelectExisting: (stock: Stock) => void;
  tableRef?: RefObject<HTMLDivElement | null>;
}

export const StockSearchAdd = ({
  stockOptions,
  onCreateNew,
  onSelectExisting,
  tableRef,
}: StockSearchAddProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const trimmedQuery = query.trim();

  const filtered =
    trimmedQuery.length > 0
      ? stockOptions.filter((option) =>
          option.label.toLowerCase().includes(trimmedQuery.toLowerCase()),
        )
      : [];

  const canCreateNew = trimmedQuery.length > 0 && filtered.length === 0;

  const focusLastTableInput = () => {
    setTimeout(() => {
      const inputs =
        tableRef?.current?.querySelectorAll<HTMLInputElement>("input");

      const lastInput = inputs?.[inputs.length - 1];
      lastInput?.focus();
    }, 50);
  };

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
    focusLastTableInput();
  };

  const handleSelectExisting = (stock: Stock) => {
    onSelectExisting(stock);
    setQuery("");
    setOpen(false);
    focusLastTableInput();
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
    <div className="relative z-50 overflow-visible rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white">
          Add Stock
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
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={handleOpen}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setOpen(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEnter();
                } else if (e.key === "Tab") {
                  const firstInput =
                    tableRef?.current?.querySelector<HTMLInputElement>("input");

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
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%)]" />

              <div className="relative z-10 max-h-60 overflow-y-auto">
                {canCreateNew ? (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCreateNew();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
                      <PlusCircle className="h-4 w-4 text-cyan-300" />
                    </div>

                    <span>
                      <span className="block font-semibold text-white">
                        No matching stock found
                      </span>

                      <span className="block text-xs text-slate-400">
                        Click to add “{trimmedQuery}” as a new stock item
                      </span>
                    </span>
                  </button>
                ) : filtered.length > 0 ? (
                  <div className="py-1">
                    {filtered.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectExisting(option.stock);
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
                            {option.stock.brand} - {option.stock.article}
                          </span>

                          <span className="block truncate text-xs text-slate-500">
                            Click to add new stock.
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-400">
                    Type a stock name to search or create a new item
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
