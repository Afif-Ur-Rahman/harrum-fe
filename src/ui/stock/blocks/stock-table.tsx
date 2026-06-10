import { Table } from "@/components";
import ReuseableDialog from "@/components/ui/dialog";
import { Stock, StockVariant } from "@/types";
import { Flex } from "@radix-ui/themes";
import { History, Palette } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils";
import { HistoryTable } from "./history-table";
import { ColorsDetails } from "./colors-details";

interface StockTableProps {
  stockData: Stock[];
}

const getTotalQuantity = (variants: StockVariant[] = []) => {
  return variants.reduce(
    (total, variant) => total + Number(variant.quantity || 0),
    0,
  );
};

export const StockTable: React.FC<StockTableProps> = ({ stockData = [] }) => {
  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (row: Stock) => (
        <span className="font-semibold text-slate-300">{row.name}</span>
      ),
    },
    {
      key: "brand" as const,
      header: "Brand",
      render: (row: Stock) => (
        <span className="text-slate-300">{row.brand}</span>
      ),
    },
    {
      key: "article" as const,
      header: "Article",
      render: (row: Stock) => (
        <span className="text-slate-300">{row.article}</span>
      ),
    },
    {
      key: "quantity" as const,
      header: "Total Qty",
      render: (row: Stock) => {
        const totalQuantity = getTotalQuantity(row.variants);

        return (
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-cyan-300">
            {totalQuantity} {row.size}
          </span>
        );
      },
    },
    {
      key: "wholesalePrice" as const,
      header: "Wholesale (PKR)",
      render: (row: Stock) => (
        <span className="text-slate-300">
          {formatPrice(Number(row.wholesalePrice)) || 0}
        </span>
      ),
    },
    {
      key: "salePrice" as const,
      header: "Sale (PKR)",
      render: (row: Stock) => (
        <span className="font-semibold text-slate-300">
          {formatPrice(Number(row.salePrice)) || 0}
        </span>
      ),
    },
    {
      key: "totalValue" as const,
      header: "Total Sale Value",
      render: (row: Stock) => (
        <span className="font-semibold text-cyan-300">
          {formatPrice(
            Number(row.salePrice) * getTotalQuantity(row.variants),
          ) || 0}
        </span>
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (row: Stock) => {
        const totalQuantity = getTotalQuantity(row.variants);

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              totalQuantity > 0
                ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/30"
                : "bg-red-400/10 text-red-300 ring-red-300/30"
            }`}
          >
            {totalQuantity > 0 ? "Available" : "Out of Stock"}
          </span>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Created at",
      render: (row: Stock) => (
        <span className="text-slate-400">{formatDateTime(row.createdAt)}</span>
      ),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: Stock) => (
        <Flex justify="end" align="center" gap="2">
          {row.variants?.length > 0 && (
            <ReuseableDialog
              title={`${row.name} - ${row.article} Colors`}
              triggerButton={
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/15 hover:text-cyan-200 active:scale-[0.98]"
                >
                  <Palette className="h-3.5 w-3.5" />
                  Colors
                </button>
              }
              content={<ColorsDetails colors={row.variants} size={row.size} />}
            />
          )}

          {row.history?.length > 0 && (
            <ReuseableDialog
              title={`${row.name} - ${row.article} History`}
              triggerButton={
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 hover:text-slate-300 active:scale-[0.98]"
                  aria-label="View history"
                >
                  <History className="h-4 w-4" />
                </button>
              }
              content={
                <HistoryTable historyData={row.history} size={row.size} />
              }
            />
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Flex direction="column" gap="4">
      <Table title="Stock data" data={stockData} columns={columns} />
    </Flex>
  );
};
