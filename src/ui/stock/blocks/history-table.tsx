"use client";

import { ConfirmationDialog, Table } from "@/components";
import { StockHistory } from "@/types";
import { Flex, Text } from "@radix-ui/themes";
import { Edit, Trash2, X, Check } from "lucide-react";
import { formatDateTime } from "@/utils";
import { usePersistStore } from "@/store/presistStore";
import { useState } from "react";

interface HistoryTableProps {
  stockId: string;
  historyData: StockHistory[];
  handleDeleteHistory: (stockId: string, historyId: string) => Promise<{ state: boolean; message?: string; error?: string }>;
  handleUpdateStockHistory: (data: { quantity: number, price: number }, stockId: string, historyId: string) => Promise<void>;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  stockId,
  historyData = [],
  handleDeleteHistory,
  handleUpdateStockHistory,
}) => {
  const { user } = usePersistStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editableRow, setEditableRow] = useState<{ quantity: number; price: number }>({ quantity: 0, price: 0 });

  const startEdit = (row: StockHistory) => {
    setEditableRow({ quantity: row.quantity, price: row.price });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditableRow({ quantity: 0, price: 0 });
  };

  const saveEdit = async (row: StockHistory) => {
    await handleUpdateStockHistory(
      { quantity: editableRow.quantity, price: editableRow.price },
      stockId,
      row._id
    );
    setIsEditing(false);
  };

  const typeConfig: Record<string, { label: string; className: string }> = {
    "stock-in": { label: "Stock In", className: "bg-blue-100 text-blue-700" },
    wastage:    { label: "Wastage",  className: "bg-red-100 text-red-700"  },
    order:      { label: "Order",    className: "bg-amber-100 text-amber-700" },
  };

  const columns = [
    {
      key: "type" as const,
      header: "Type",
      render: (row: StockHistory) => {
        const cfg = typeConfig[row.type ?? (Number(row.quantity) >= 0 ? "stock-in" : "wastage")];
        return (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.className}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "quantity" as const,
      header: "Quantity",
      render: (row: StockHistory, idx: number) =>
        idx === 0 && isEditing ? (
          <input
            type="number"
            value={editableRow.quantity}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (row.quantity > 0 && newValue <= 0) return;
              if (row.quantity < 0 && newValue > 0) return;
              if (row.quantity === 0 && newValue < 0) return;
              setEditableRow((prev) => ({ ...prev, quantity: newValue }));
            }}
            className="w-20 border py-0.5 rounded-md text-center border-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <Text>{`${row.quantity} ${row.unit || ""}`}</Text>
        ),
    },
    {
      key: "price" as const,
      header: `Price (${user?.currency || "USD"})`,
      render: (row: StockHistory, idx: number) =>
        idx === 0 && isEditing ?
          Number(row.quantity) < 0 ? "-" : (
            <input
              type="number"
              value={editableRow.price}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (newValue <= 0) return setEditableRow((prev) => ({ ...prev, price: 0 }));
                setEditableRow((prev) => ({ ...prev, price: newValue }));
              }}
              className="w-20 border py-0.5 rounded-md text-center border-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ) : (
            <Text>{Number(row.quantity) < 0 ? "-" : `${Number(row.price)?.toFixed(2) || 0}/${row.unit || ""}`}</Text>
          ),
    },
    {
      key: "createdBy" as const,
      header: "Created By",
      render: (row: StockHistory) => row.createdByName || row.createdBy?.fullName || row.createdBy?.username || "—",
    },
    {
      key: "reason" as const,
      header: "Reason / Order Ref",
      render: (row: StockHistory) => {
        if (!row.reason) return <span className="text-gray-300">—</span>;
        // Highlight order references: "Dine In #X · XXXXXX" or "Delivery · XXXXXX"
        const isOrderRef =
          row.reason.startsWith("Dine In #") ||
          row.reason.startsWith("Delivery ·") ||
          row.reason.startsWith("Item removed") ||
          row.reason.startsWith("Table Order #");
        if (isOrderRef) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
              {row.reason}
            </span>
          );
        }
        return <span className="text-sm text-gray-600">{row.reason}</span>;
      },
    },
    {
      key: "createdAt" as const,
      header: "Created at",
      render: (row: StockHistory) => formatDateTime(row.date),
    },
    {
      key: "_id" as const,
      header: "Actions",
      render: (row: StockHistory, idx: number) => {
        if (idx !== 0) return null;

        return (
          <Flex justify="end" align="center" gap="1">
            {isEditing ? (
              <>
                <button
                  className="p-1 rounded-full hover:bg-red-100 cursor-pointer"
                  onClick={cancelEdit}
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
                <button
                  className="p-1 rounded-full hover:bg-green-100 cursor-pointer"
                  onClick={() => saveEdit(row)}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="p-1 rounded-full hover:bg-blue-200 cursor-pointer"
                  onClick={() => startEdit(row)}
                >
                  <Edit className="w-5 h-5 text-blue-500" />
                </button>
                {user?.type === "restaurant" && <ConfirmationDialog
                  title="Delete"
                  description="Are you sure you want to delete this stock?"
                  saveButtonTitle="Confirm"
                  confirmAction={() => handleDeleteHistory(stockId, row._id)}
                  trigger={
                    <button className="p-1 rounded-full transition hover:bg-red-100 cursor-pointer">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  }
                />}
              </>
            )}
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex direction="column" gap="4">
      <Table title="Stock History" data={historyData} columns={columns} getRowClassName={(row) =>
        Number(row.quantity) < 0
          ? "bg-red-50 hover:bg-red-100"
          : "bg-blue-50 hover:bg-blue-100"
      } />
    </Flex>
  );
};
