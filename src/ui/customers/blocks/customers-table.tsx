"use client";

import { Flex } from "@radix-ui/themes";
import { Pen, Eye, Users } from "lucide-react";
import { ReuseableDialog, Table } from "@/components";
import { Customer } from "@/types";
import { formatPrice } from "@/utils";
import { CustomerOrders } from "./customer-orders";

interface CustomerTableProps {
  filtered: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  filtered,
  loading,
  onEdit,
}) => {
  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (row: Customer) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8">
            <Users className="h-4 w-4 text-cyan-300" />
          </div>
          <span className="font-semibold text-slate-200">{row.name}</span>
        </div>
      ),
    },
    {
      key: "phone" as const,
      header: "Phone",
      render: (row: Customer) => (
        <span className="text-slate-300">{row.phone}</span>
      ),
    },
    {
      key: "email" as const,
      header: "Email",
      render: (row: Customer) => (
        <span className="text-slate-300">{row.email || "—"}</span>
      ),
    },
    {
      key: "remainingAmount" as const,
      header: "Remaining (PKR)",
      render: (row: Customer) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
            row.remainingAmount > 0
              ? "border-rose-300/20 bg-rose-400/10 text-rose-300"
              : "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {formatPrice(row.remainingAmount) || 0}
        </span>
      ),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: Customer) => (
        <Flex justify="end" align="center" gap="2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
            aria-label="Edit customer"
          >
            <Pen className="h-3.5 w-3.5" />
          </button>

          <ReuseableDialog
            title={`${row.name} — Orders`}
            triggerButton={
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/15 hover:text-cyan-200 active:scale-[0.98]"
              >
                <Eye className="h-3.5 w-3.5" />
                Orders
              </button>
            }
            content={<CustomerOrders customerId={row._id} />}
            contentStyle="max-w-2xl!"
          />
        </Flex>
      ),
    },
  ];

  return (
    <Table
      title="Customers"
      data={filtered}
      columns={columns}
      isLoading={loading}
      getRowClassName={() => "bg-cyan-400/5 hover:bg-cyan-400/10"}
    />
  );
};
