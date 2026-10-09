"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Stock } from "@/types";
import { handleSearchKeyDown } from "@/utils";

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

export const ItemSearch = ({ stockOptions, selectedStockIds, onSelectItem }: ItemSearchProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const listRef = useRef<HTMLDivElement | null>(null);

  const trimmedQuery = query.trim();

  const availableOptions = useMemo(
    () => stockOptions.filter(option => !selectedStockIds.includes(option.value)),
    [stockOptions, selectedStockIds],
  );

  const filtered = useMemo(() => {
    if (!trimmedQuery) return availableOptions;

    const search = trimmedQuery.toLowerCase();

    return availableOptions.filter(option => option.label.toLowerCase().includes(search));
  }, [availableOptions, trimmedQuery]);

  const activeHighlight = Math.min(highlight, Math.max(0, filtered.length - 1));

  useEffect(() => {
    if (!open || !listRef.current) return;

    const element = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${activeHighlight}"]`,
    );

    element?.scrollIntoView({ block: "nearest" });
  }, [activeHighlight, open]);

  useEffect(() => {
    return () => {
      if (blurTimer.current) {
        clearTimeout(blurTimer.current);
      }
    };
  }, []);

  const handleOpen = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
    }

    setOpen(true);
  };

  const handleClose = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
    }

    setQuery("");
    setOpen(false);
    setHighlight(0);
  };

  const handleSelect = (stock: Stock) => {
    onSelectItem(stock);
    setQuery("");
    setOpen(false);
    setHighlight(0);
  };

  const showList = open && filtered.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleSearchKeyDown<StockOption>({
      event: e,
      open: showList,
      options: filtered,
      highlight: activeHighlight,
      setOpen,
      setHighlight,
      onSelect: option => handleSelect(option.stock),
      onEscape: () => setOpen(false),
    });
  };

  return (
    <div className="relative" data-search-dropdown>
      <div
        className={`flex h-8.5 items-center gap-2 rounded-lg border px-3 shadow-lg shadow-black/10 transition-all ${
          open
            ? "border-cyan-300/60 bg-white/12 ring-2 ring-cyan-300/10"
            : "border-white/10 bg-white/8 hover:bg-white/10"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-slate-400" />

        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={handleOpen}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showList}
          aria-autocomplete="list"
          aria-controls="item-search-listbox"
          data-form-arrow-nav-ignore={showList ? "true" : undefined}
          placeholder="Search item to add..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white"
        />

        {open || query ? (
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-white transition hover:bg-white/10"
            aria-label="Clear item search"
            data-form-arrow-nav-ignore
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open && (
        <div
          id="item-search-listbox"
          role="listbox"
          ref={listRef}
          className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)]" />

          <div className="relative z-10 max-h-60 overflow-y-auto">
            {filtered.length > 0 ? (
              <div className="py-1">
                {filtered.map((option, index) => {
                  const isActive = activeHighlight === index;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-option-index={index}
                      onMouseDown={e => {
                        e.preventDefault();
                        handleSelect(option.stock);
                      }}
                      onMouseEnter={() => setHighlight(index)}
                      className={`flex w-full items-center gap-3 px-4 py-1 text-left transition ${
                        isActive ? "bg-cyan-400/15 text-cyan-100" : "hover:bg-white/8"
                      }`}
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
                  );
                })}
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
  );
};
