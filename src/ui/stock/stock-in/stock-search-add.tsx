"use client";

import { useRef, useState, RefObject } from "react";
import { Search, X, Check, Plus, PlusCircle } from "lucide-react";

interface StockSearchAddProps {
  stockOptions: string[];
  selectedStock: string[];
  onSelect: (name: string) => void;
  tableRef?: RefObject<HTMLDivElement | null>;
}

export const StockSearchAdd = ({
  stockOptions,
  selectedStock,
  onSelect,
  tableRef,
}: StockSearchAddProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const filtered = stockOptions.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  const trimmed = query.trim();
  const canCreateNew =
    trimmed.length > 0 &&
    !stockOptions.some((n) => n.toLowerCase() === trimmed.toLowerCase()) &&
    !selectedStock.some((n) => n.toLowerCase() === trimmed.toLowerCase());

  const toggle = (name: string) => {
    if (selectedStock.includes(name)) return; // already added, ignore
    setPending((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const confirmAdd = () => {
    pending.forEach((name) => onSelect(name));
    setPending([]);
    setQuery("");
    setOpen(false);
  };

  const handleOpen = () => {
    clearTimeout(blurTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    setPending([]);
    setQuery("");
    setOpen(false);
  };

  const handleEnter = () => {
    if (!trimmed) return;

    const exactMatch = stockOptions.find(
      (n) => n.toLowerCase() === trimmed.toLowerCase(),
    );

    if (exactMatch) {
      if (!selectedStock.includes(exactMatch)) onSelect(exactMatch);
    } else {
      if (!selectedStock.some((n) => n.toLowerCase() === trimmed.toLowerCase()))
        onSelect(trimmed);
    }

    setQuery("");
    clearTimeout(blurTimer.current);
    setOpen(true);
    setTimeout(() => {
      clearTimeout(blurTimer.current);
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        Add Stock Items
      </p>

      {/* Search input */}
      <div ref={containerRef} className="relative">
        <div
          className={`flex items-center gap-2 h-10 px-3 rounded-xl border bg-gray-50 transition ${
            open
              ? "border-emerald-400 bg-white"
              : "border-gray-200"
          }`}
        >
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleOpen}
            onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 150); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleEnter();
              } else if (e.key === "Tab") {
                const firstInput = tableRef?.current?.querySelector<HTMLInputElement>("input[type='number']");
                if (firstInput) {
                  e.preventDefault();
                  setOpen(false);
                  firstInput.focus();
                }
              }
            }}
            placeholder="Search and select stock items…"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
          />
          {open ? (
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

        {open && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {/* Item list */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 && !canCreateNew ? (
                <p className="text-sm text-gray-400 px-4 py-3">
                  {query ? "No matching items" : "No stock items available"}
                </p>
              ) : (
                filtered.map((name) => {
                  const isAdded = selectedStock.includes(name);
                  const isChecked = pending.includes(name);

                  return (
                    <button
                      key={name}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        toggle(name);
                      }}
                      disabled={isAdded}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition ${
                        isAdded
                          ? "opacity-40 cursor-not-allowed bg-gray-50"
                          : isChecked
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {/* Checkbox */}
                      <span
                        className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition ${
                          isAdded
                            ? "border-gray-300 bg-gray-100"
                            : isChecked
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}
                      >
                        {(isAdded || isChecked) && (
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        )}
                      </span>

                      <span className="font-medium flex-1">{name}</span>

                      {isAdded && (
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Added
                        </span>
                      )}
                    </button>
                  );
                })
              )}

              {/* Create new item option */}
              {canCreateNew && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(trimmed);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left border-t border-gray-100 bg-blue-50 hover:bg-blue-100 transition text-blue-700 font-semibold"
                >
                  <PlusCircle className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>Add &ldquo;{trimmed}&rdquo; as new item</span>
                </button>
              )}
            </div>

            {/* Footer action */}
            <div className="border-t border-gray-100 px-3 py-2.5 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-400">
                {pending.length > 0
                  ? `${pending.length} item${pending.length > 1 ? "s" : ""} selected`
                  : "Click items to select"}
              </span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (pending.length > 0) confirmAdd();
                }}
                disabled={pending.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Plus className="w-3 h-3" />
                Add{pending.length > 0 ? ` ${pending.length}` : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
