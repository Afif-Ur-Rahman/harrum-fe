"use client";

import { ArrowLeft, Save, PackagePlus } from "lucide-react";
import { useRef } from "react";
import { FormProvider } from "react-hook-form";

import { EmptyState } from "@/components";
import { PageLayout } from "@/components/layout";
import { NavigationLink } from "@/components/navigation-link";

import { StockInTable } from "./stock-in-table";
import { StockSearchAdd } from "./stock-search-add";

import { useStocks } from "../useStocks";

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
    vendorOptions,
  } = useStocks();

  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <NavigationLink
          href="/super-admin/stocks"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          aria-label="Back to stocks"
        >
          <ArrowLeft className="h-4 w-4" />
        </NavigationLink>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Create Stock</h1>

          <p className="mt-1 text-xs text-slate-400">
            Create new stock items with brand, prices, and variants
          </p>
        </div>
      </div>

      <FormProvider {...form}>
        <div
          data-sticky-target
          className="sticky -top-5 z-50 -mx-1 bg-slate-950/70 px-1 py-1.5 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
        >
          <StockSearchAdd
            stockOptions={stockOptions}
            selectedStockIds={fields.map(item => item._id)}
            tableRef={tableRef}
            onCreateNew={addNewStockRow}
            onSelectExisting={addExistingStockRow}
          />
        </div>

        <div ref={tableRef} className="relative z-0 mt-2">
          {fields.length === 0 ? (
            <EmptyState
              icon={PackagePlus}
              title="No stock item added"
              description="Type a stock name above to create a new item"
            />
          ) : (
            <StockInTable
              stockData={fields}
              removeField={removeStockRow}
              vendorOptions={vendorOptions}
            />
          )}
        </div>

        <div className="mt-4 flex w-full justify-end">
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
    </PageLayout>
  );
};

export { StockIn };
