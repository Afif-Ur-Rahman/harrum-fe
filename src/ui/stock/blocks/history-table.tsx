"use client";

import { Table } from "@/components";
import { StockHistory, StockVariant } from "@/types";
import { Text } from "@radix-ui/themes";
import { formatDateTime, formatPrice } from "@/utils";

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

const renderVariants = (variants: StockVariant[] = [], size = "") => {
  if (!variants.length) return "-";

  return variants
    .map((variant) => `${variant.color}: ${variant.quantity} ${size}`)
    .join(", ");
};

export const HistoryTable: React.FC<HistoryTableProps> = ({
  historyData = [],
  size = "",
}) => {
  const columns = [
    {
      key: "date" as const,
      header: "Date",
      render: (row: StockHistory) => formatDateTime(row.date),
    },
    {
      key: "variants" as const,
      header: "Added Variants",
      render: (row: StockHistory) => (
        <Text className="text-xs text-gray-600">
          {renderVariants(row.variants, size)}
        </Text>
      ),
    },
    {
      key: "quantity" as const,
      header: "Added Qty",
      render: (row: StockHistory) =>
        `${getTotalQuantity(row.variants)} ${size}`,
    },
    {
      key: "wholesalePrice" as const,
      header: "Wholesale (PKR)",
      render: (row: StockHistory) =>
        formatPrice(Number(row.wholesalePrice)) || 0,
    },
    {
      key: "salePrice" as const,
      header: "Sale (PKR)",
      render: (row: StockHistory) => formatPrice(Number(row.salePrice)) || 0,
    },
    {
      key: "totalValue" as const,
      header: "Total Sale Value",
      render: (row: StockHistory) =>
        formatPrice(Number(row.salePrice) * getTotalQuantity(row.variants)) ||
        0,
    },
  ];

  return (
    <Table
      title="Stock History"
      data={historyData}
      columns={columns}
      getRowClassName={() => "bg-blue-50 hover:bg-blue-100"}
    />
  );
};
