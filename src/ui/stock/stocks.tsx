"use client";

import { useStocks } from "./useStocks";
import { StockStats, StockTable } from "./blocks";
import Link from "next/link";
import { ArrowDownToLine, Package, Boxes } from "lucide-react";
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
  const { stocks } = useStocks();

  const totalValue = stocks.reduce((acc, stock) => {
    const totalQty = getTotalQuantity(stock.variants);
    return acc + Number(stock.salePrice) * totalQty;
  }, 0);

  const outOfStock = stocks.filter(
    (stock) => getTotalQuantity(stock.variants) <= 0,
  ).length;

  return (
    <PageLayout>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
              <Boxes className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Stocks
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {stocks.length} item{stocks.length !== 1 ? "s" : ""} in
                inventory
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/super-admin/stocks/stock-in"
            className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:opacity-95 active:scale-[0.98]"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span className="hidden sm:inline">Stock In</span>
          </Link>
        </div>
      </div>

      <StockStats
        totalStocks={stocks.length}
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
      ) : (
        <StockTable stockData={stocks} />
      )}
    </PageLayout>
  );
};
