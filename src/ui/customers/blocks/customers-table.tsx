"use client";

import { Users } from "lucide-react";
import { Table } from "@/components";
import { Customer } from "@/types";
import { formatPrice } from "@/utils";
import { Actions } from "./actions";

interface CustomerTableProps {
  filtered: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onCustomerUpdated: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  filtered,
  loading,
  onEdit,
  onCustomerUpdated,
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
        <Actions
          customer={row}
          onEdit={onEdit}
          onCustomerUpdated={onCustomerUpdated}
        />
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
