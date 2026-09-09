"use client";

import { ReuseableDialog, Table } from "@/components";
import { Order } from "@/types";
import { Flex } from "@radix-ui/themes";
import { Eye } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils";
import { OrderDetails } from "./order-details";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onClaimItem: (
    orderId: string,
    itemId: string,
    variantId: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
  onReturnItem: (
    orderId: string,
    itemId: string,
    variantId: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
}

const getTotalItemsQty = (order: Order) =>
  order.items.reduce(
    (sum, item) =>
      sum +
      item.variants.reduce((vSum, v) => vSum + Number(v.quantity || 0), 0),
    0,
  );

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onClaimItem,
  onReturnItem,
}) => {
  const columns = [
    {
      key: "customerName" as const,
      header: "Customer",
      render: (row: Order) => (
        <div>
          <p className="font-semibold text-slate-300">{row.customerName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{row.phone}</p>
        </div>
      ),
    },
    {
      key: "salesman" as const,
      header: "Salesman",
      render: (row: Order) => (
        <span className="text-slate-300">{row.salesman?.username || "—"}</span>
      ),
    },
    {
      key: "items" as const,
      header: "Items",
      render: (row: Order) => (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-cyan-300">
          {row.items.length} item{row.items.length !== 1 ? "s" : ""} ·{" "}
          {getTotalItemsQty(row)} pcs
        </span>
      ),
    },
    {
      key: "discount" as const,
      header: "Discount",
      render: (row: Order) => (
        <span className="text-slate-300">{formatPrice(row.discount) || 0}</span>
      ),
    },
    {
      key: "totalPrice" as const,
      header: "Total (PKR)",
      render: (row: Order) => (
        <span className="font-semibold text-cyan-300">
          {formatPrice(row.totalPrice)}
        </span>
      ),
    },
    {
      key: "createdAt" as const,
      header: "Date",
      render: (row: Order) => (
        <span className="text-slate-400">{formatDateTime(row.createdAt)}</span>
      ),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: Order) => (
        <Flex justify="end" align="center" gap="2">
          <ReuseableDialog
            title={`Order — ${row.customerName}`}
            triggerButton={
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/15 hover:text-cyan-200 active:scale-[0.98]"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
            }
            content={
              <OrderDetails
                order={row}
                onClaimItem={onClaimItem}
                onReturnItem={onReturnItem}
              />
            }
          />
        </Flex>
      ),
    },
  ];

  return (
    <Table
      title="Orders"
      data={orders}
      columns={columns}
      isLoading={loading}
      getRowClassName={() => "bg-cyan-400/5 hover:bg-cyan-400/10"}
    />
  );
};
