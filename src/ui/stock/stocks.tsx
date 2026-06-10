"use client";

import { useStocks } from "./useStocks";
import { StockTable } from "./blocks";
import Link from "next/link";
import { ArrowDownToLine, History, Package } from "lucide-react";
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
    <div className="pb-12 mt-12.5 md:mt-6.25 lg:mt-7.5">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Stocks
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {stocks.length} item{stocks.length !== 1 ? "s" : ""} in inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/super-admin/stocks/history"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition active:scale-[0.98]"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>

          <Link
            href="/super-admin/stocks/stock-in"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition active:scale-[0.98]"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span className="hidden sm:inline">Stock In</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Total Items
          </p>
          <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Total Sale Value
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
            <span className="text-sm font-normal text-gray-400 ml-1">PKR</span>
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Out of Stock
          </p>
          <p
            className={`text-2xl font-bold ${
              outOfStock > 0 ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {outOfStock}
          </p>
        </div>
      </div>

      {stocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No stock items yet
          </h3>
          <p className="text-sm text-gray-400">
            Add your first stock item using Stock In.
          </p>
        </div>
      ) : (
        <StockTable stockData={stocks} />
      )}
    </div>
  );
};
