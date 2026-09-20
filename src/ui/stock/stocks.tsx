"use client";

import { useStocks } from "./useStocks";
import { StockFilterDialog, StockStats, StockTable } from "./blocks";
import Link from "next/link";
import { ArrowDownToLine, Package, Boxes, Search } from "lucide-react";
import { StockVariant } from "@/types";
import { EmptyState } from "@/components";
import { PageLayout } from "@/components/layout";

const getTotalQuantity = (variants: StockVariant[] = []) => {
  return variants.reduce(
    (total, variant) => total + Number(variant.quantity || 0),
    0,
  );
};

export const Stocks = () => {
  const {
    stocks,
    filteredStocks,
    search,
    setSearch,
    filters,
    setFilters,
    brandOptions,
    activeFilterCount,
  } = useStocks();

  const hasActiveQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const totalValue = filteredStocks.reduce((acc, stock) => {
    const totalQty = stock.quantity ?? getTotalQuantity(stock.variants);
    return acc + Number(stock.salePrice) * totalQty;
  }, 0);

  const outOfStock = filteredStocks.filter((stock) => {
    const total = stock.quantity ?? getTotalQuantity(stock.variants);
    return total <= 0;
  }).length;

  return (
    <PageLayout>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
              <Boxes className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Stocks
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                {stocks.length} item
                {stocks.length !== 1 ? "s" : ""} in inventory
                {hasActiveQuery ? ` · ${filteredStocks.length} matching` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, brand or color"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </div>

          <StockFilterDialog
            filters={filters}
            brands={brandOptions}
            activeCount={activeFilterCount}
            onApply={setFilters}
          />

          <Link
            href="/super-admin/stocks/stock-in"
            className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span className="hidden sm:inline">Stock In</span>
          </Link>
        </div>
      </div>

      <StockStats
        totalStocks={filteredStocks.length}
        totalValue={totalValue}
        outOfStock={outOfStock}
      />

      {/* Content */}
      {stocks.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No stock items yet"
          description="Add your first stock item using Stock In."
        />
      ) : filteredStocks.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching stocks"
          description="Try a different name, brand, or color, or adjust the filters."
        />
      ) : (
        <StockTable stockData={filteredStocks} />
      )}
    </PageLayout>
  );
};
