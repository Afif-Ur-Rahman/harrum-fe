"use client";

import { Flex } from "@radix-ui/themes";
import { Pen, Trash2, Users } from "lucide-react";
import { Table } from "@/components";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Customer } from "@/types";
import { formatPrice } from "@/utils";

interface CustomerTableProps {
  filtered: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (
    id: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  filtered,
  loading,
  onEdit,
  onDelete,
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

          <ConfirmationDialog
            title="Delete Customer"
            description="Are you sure you want to delete this customer? This action cannot be undone."
            saveButtonTitle="Delete"
            confirmAction={() => onDelete(row._id)}
            trigger={
              <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200">
                <Trash2 className="h-4 w-4" />
              </button>
            }
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
