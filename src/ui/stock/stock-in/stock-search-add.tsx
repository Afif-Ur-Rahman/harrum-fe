"use client";

import { useRef, useState, RefObject } from "react";
import { Search, X, PlusCircle } from "lucide-react";
import { Stock } from "@/types";

interface StockOption {
  value: string;
  label: string;
  stock: Stock;
}

interface StockSearchAddProps {
  stockOptions: StockOption[];
  onCreateNew: (name: string) => void;
  tableRef?: RefObject<HTMLDivElement | null>;
}

export const StockSearchAdd = ({
  stockOptions,
  onCreateNew,
  tableRef,
}: StockSearchAddProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const trimmedQuery = query.trim();

  const filtered = stockOptions.filter((option) =>
    option.label.toLowerCase().includes(trimmedQuery.toLowerCase()),
  );

  const canCreateNew = trimmedQuery.length > 0 && filtered.length === 0;

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

    setTimeout(() => {
      const firstInput =
        tableRef?.current?.querySelector<HTMLInputElement>("input");

      firstInput?.focus();
    }, 50);
  };

  const handleEnter = () => {
    if (canCreateNew) {
      handleCreateNew();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        Add New Stock
      </p>

      <div className="relative">
        <div
          className={`flex items-center gap-2 h-10 px-3 rounded-xl border bg-gray-50 transition ${
            open ? "border-emerald-400 bg-white" : "border-gray-200"
          }`}
        >
          <Search className="w-4 h-4 text-gray-400 shrink-0" />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            placeholder="Type stock name to create…"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
          />

          {open || query ? (
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {open && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {canCreateNew ? (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCreateNew();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left bg-blue-50 hover:bg-blue-100 transition text-blue-700"
                >
                  <PlusCircle className="w-4 h-4 shrink-0 text-blue-600" />

                  <span>
                    <span className="block font-semibold">
                      No matching stock found
                    </span>
                    <span className="block text-xs text-blue-500">
                      Click to add “{trimmedQuery}” as a new stock item
                    </span>
                  </span>
                </button>
              ) : filtered.length > 0 ? (
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Stock already exists
                  </p>
                  <p className="text-xs text-gray-400">
                    This flow is currently for creating new stock only.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 px-4 py-3">
                  Type a stock name to create a new item
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
