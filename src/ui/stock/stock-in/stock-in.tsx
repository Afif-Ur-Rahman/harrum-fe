"use client";

import { useRef } from "react";
import { FormProvider } from "react-hook-form";
import { useStocks } from "../useStocks";
import { ArrowLeft, Save, PackagePlus } from "lucide-react";
import Link from "next/link";
import { StockInTable } from "./stock-in-table";
import { StockSearchAdd } from "./stock-search-add";

const StockIn = () => {
  const {
    stockOptions,
    addNewStockRow,
    addExistingStockRow,
    removeStockRow,
    onAddStock,
    form,
    fields,
    isSaveDisabled,
  } = useStocks();

  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <div className="pb-12 md:mt-6.25 lg:mt-7.5">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/super-admin/stocks"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          aria-label="Back to stocks"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Create Stock
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Create new stock items with brand, prices, and variants
          </p>
        </div>
      </div>

      <FormProvider {...form}>
        <div
          data-sticky-target
          className="sticky top-16 md:top-0 z-50 pb-3 pt-1 backdrop-blur-md"
        >
          <StockSearchAdd
            stockOptions={stockOptions}
            tableRef={tableRef}
            onCreateNew={addNewStockRow}
            onSelectExisting={addExistingStockRow}
          />
        </div>

        <div ref={tableRef} className="relative z-0 mt-4">
          {fields.length === 0 ? (
            <div className="relative z-0 overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/8 px-6 py-16 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

              <div className="relative z-0 flex flex-col items-center justify-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-950/20">
                  <PackagePlus className="h-6 w-6 text-cyan-300" />
                </div>

                <p className="text-sm font-semibold text-white">
                  No stock item added
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Type a stock name above to create a new item
                </p>
              </div>
            </div>
          ) : (
            <StockInTable stockData={fields} removeField={removeStockRow} />
          )}
        </div>

        <div className="mt-6 flex w-full justify-end">
          <button
            type="button"
            onClick={form.handleSubmit(onAddStock)}
            disabled={isSaveDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
          >
            <Save className="h-4 w-4" />
            <span>Create Stock</span>
          </button>
        </div>
      </FormProvider>
    </div>
  );
};

export { StockIn };
