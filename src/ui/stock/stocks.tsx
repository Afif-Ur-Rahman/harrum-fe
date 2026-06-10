"use client";

import { useStocks } from "./useStocks";
import { StockStats, StockTable } from "./blocks";
import Link from "next/link";
import { ArrowDownToLine, History, Package, Boxes } from "lucide-react";
import { StockVariant } from "@/types";

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
    <div className="mt-12.5 pb-12 md:mt-6.25 lg:mt-7.5">
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
            href="/super-admin/stocks/history"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Link>

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
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 px-6 py-24 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.10),transparent_36%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-950/20">
              <Package className="h-6 w-6 text-cyan-300" />
            </div>

            <h3 className="mb-1 text-base font-semibold text-white">
              No stock items yet
            </h3>

            <p className="text-sm text-slate-400">
              Add your first stock item using Stock In.
            </p>
          </div>
        </div>
      ) : (
        <StockTable stockData={stocks} />
      )}
    </div>
  );
};
