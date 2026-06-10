"use client";

import { Table } from "@/components";
import { StockHistory, StockVariant } from "@/types";
import { Flex } from "@radix-ui/themes";
import { formatDateTime, formatPrice } from "@/utils";
import ReuseableDialog from "@/components/ui/dialog";
import { ColorsDetails } from "./colors-details";
import { Palette } from "lucide-react";

interface HistoryTableProps {
  historyData: StockHistory[];
  size?: string;
}

const getTotalQuantity = (variants: StockVariant[] = []) => {
  return variants.reduce(
    (total, variant) => total + Number(variant.quantity || 0),
    0,
  );
};

export const HistoryTable: React.FC<HistoryTableProps> = ({
  historyData = [],
  size = "",
}) => {
  const columns = [
    {
      key: "date" as const,
      header: "Date",
      render: (row: StockHistory) => (
        <span className="text-slate-400">{formatDateTime(row.date)}</span>
      ),
    },
    {
      key: "quantity" as const,
      header: "Added Qty",
      render: (row: StockHistory) => (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-cyan-300">
          {getTotalQuantity(row.variants)} {size}
        </span>
      ),
    },
    {
      key: "wholesalePrice" as const,
      header: "Wholesale (PKR)",
      render: (row: StockHistory) => (
        <span className="text-slate-300">
          {formatPrice(Number(row.wholesalePrice)) || 0}
        </span>
      ),
    },
    {
      key: "salePrice" as const,
      header: "Sale (PKR)",
      render: (row: StockHistory) => (
        <span className="font-semibold text-slate-300">
          {formatPrice(Number(row.salePrice)) || 0}
        </span>
      ),
    },
    {
      key: "totalValue" as const,
      header: "Total Sale Value",
      render: (row: StockHistory) => (
        <span className="font-semibold text-cyan-300">
          {formatPrice(
            Number(row.salePrice) * getTotalQuantity(row.variants),
          ) || 0}
        </span>
      ),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: StockHistory) => (
        <Flex justify="end" align="center" gap="2">
          {row.variants?.length > 0 && (
            <ReuseableDialog
              title={`Colors${size ? ` - ${size}` : ""}`}
              triggerButton={
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/15 hover:text-cyan-200 active:scale-[0.98]"
                >
                  <Palette className="h-3.5 w-3.5" />
                  Colors
                </button>
              }
              content={
                <ColorsDetails colors={row.variants || []} size={size} />
              }
            />
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Table
      title="Stock History"
      data={historyData}
      columns={columns}
      getRowClassName={() => "bg-cyan-400/5 hover:bg-cyan-400/10"}
    />
  );
};
