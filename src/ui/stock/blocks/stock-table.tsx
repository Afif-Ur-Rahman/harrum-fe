import { Table } from "@/components";
import ReuseableDialog from "@/components/ui/dialog";
import { Stock, StockVariant } from "@/types";
import { Flex } from "@radix-ui/themes";
import { History } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils";
import { HistoryTable } from "./history-table";

interface StockTableProps {
  stockData: Stock[];
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

export const StockTable: React.FC<StockTableProps> = ({ stockData = [] }) => {
  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (row: Stock) => row.name,
    },
    {
      key: "brand" as const,
      header: "Brand",
      render: (row: Stock) => row.brand,
    },
    {
      key: "article" as const,
      header: "Article",
      render: (row: Stock) => row.article,
    },
    {
      key: "variants" as const,
      header: "Variants",
      render: (row: Stock) => (
        <span className="text-xs text-gray-600">
          {renderVariants(row.variants, row.size)}
        </span>
      ),
    },
    {
      key: "quantity" as const,
      header: "Total Qty",
      render: (row: Stock) => `${getTotalQuantity(row.variants)} ${row.size}`,
    },
    {
      key: "wholesalePrice" as const,
      header: "Wholesale (PKR)",
      render: (row: Stock) => formatPrice(Number(row.wholesalePrice)) || 0,
    },
    {
      key: "salePrice" as const,
      header: "Sale (PKR)",
      render: (row: Stock) => formatPrice(Number(row.salePrice)) || 0,
    },
    {
      key: "totalValue" as const,
      header: "Total Sale Value",
      render: (row: Stock) =>
        formatPrice(Number(row.salePrice) * getTotalQuantity(row.variants)) ||
        0,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (row: Stock) => {
        const totalQuantity = getTotalQuantity(row.variants);

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              totalQuantity > 0
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-600 ring-1 ring-red-200"
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
      render: (row: Stock) => formatDateTime(row.createdAt),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: Stock) => (
        <Flex justify="end" align="center" gap="1">
          {row.history?.length > 0 && (
            <ReuseableDialog
              title={`${row.name} - ${row.article} History`}
              triggerButton={
                <History className="p-1 w-7 h-7 text-gray-600 cursor-pointer!" />
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
