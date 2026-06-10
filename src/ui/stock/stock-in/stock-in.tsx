"use client";

import { useRef } from "react";
import { FormProvider } from "react-hook-form";
import { useStocks } from "../useStocks";
import { ArrowLeft, Save, ArrowDownToLine } from "lucide-react";
import Link from "next/link";
import { StockInTable } from "./stock-in-table";
import { StockSearchAdd } from "./stock-search-add";

const StockIn = () => {
  const {
    stockOptions,
    addNewStockRow,
    removeStockRow,
    onAddStock,
    form,
    fields,
    isSaveDisabled,
  } = useStocks();

  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <div className="pb-12 mt-12.5 md:mt-6.25 lg:mt-7.5">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/super-admin/stocks"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <ArrowDownToLine className="w-3.5 h-3.5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Create Stock</h1>
            </div>

            <p className="text-xs text-gray-400 mt-0.5 ml-9">
              Create new stock items with brand, article, prices, and variants
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={form.handleSubmit(onAddStock)}
          disabled={isSaveDisabled}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Create Stock</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>

      <FormProvider {...form}>
        <StockSearchAdd
          stockOptions={stockOptions}
          tableRef={tableRef}
          onCreateNew={addNewStockRow}
        />

        <div ref={tableRef} className="mt-4">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <ArrowDownToLine className="w-5 h-5 text-gray-400" />
              </div>

              <p className="text-sm font-semibold text-gray-700">
                No stock item added
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Type a stock name above to create a new item
              </p>
            </div>
          ) : (
            <StockInTable stockData={fields} removeField={removeStockRow} />
          )}
        </div>
      </FormProvider>
    </div>
  );
};

export { StockIn };
