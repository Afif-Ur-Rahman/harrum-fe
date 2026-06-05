import { ConfirmationDialog, Table } from "@/components";
import ReuseableDialog from "@/components/ui/dialog";
import { Stock } from "@/types";
import { Flex } from "@radix-ui/themes";
import { History, Trash2 } from "lucide-react";
import { formatDateTime, formatPrice } from "@/utils";
import { HistoryTable } from "./history-table";
import { usePersistStore } from "@/store/presistStore";

interface StockTableProps {
  stockData: Stock[];
  openDialog?: { id: string | null; type: 'add' | 'update' | null };
  setOpenDialog?: (dialog: { id: string | null; type: 'add' | 'update' | null }) => void;
  handleDelete: (id: string) => Promise<{ state: boolean; message?: string; error?: string }>;
  handleDeleteHistory: (stockId: string, historyId: string) => Promise<{ state: boolean; message?: string; error?: string }>;
  handleUpdateStockHistory: (data: { quantity: number, price: number }, id: string, historyId: string) => Promise<void>;
}

export const StockTable: React.FC<StockTableProps> = ({
  stockData = [],
  handleUpdateStockHistory,
  handleDelete,
  handleDeleteHistory,
}) => {
  const { user } = usePersistStore();
  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (row: Stock) => `${row.name}`,
    },
    {
      key: "quantity" as const,
      header: "Quantity",
      render: (row: Stock) => `${row.quantity} ${row.unit || ""}`,
    },
    {
      key: "price per unit" as const,
      header: `Price/Unit (${user?.currency || user?.restaurant?.currency || ''})`,
      render: (row: Stock) => `${formatPrice(Number(row.price)) || 0}`,
    },
    {
      key: "Total Price" as const,
      header: `Total Price (${user?.currency || user?.restaurant?.currency || ''})`,
      render: (row: Stock) => `${formatPrice(Number(row.price) * Number(row.quantity)) || 0}`,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (row: Stock) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          row.quantity > 0
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-red-50 text-red-600 ring-1 ring-red-200"
        }`}>
          {row.quantity > 0 ? "Available" : "Out of Stock"}
        </span>
      ),
    },
    {
      key: "createdBy" as const,
      header: "Last Updated By",
      render: (row: Stock) => {
        const last = row.stockHistory.at(-1);
        const name = last?.createdBy?.fullName || last?.createdBy?.username || last?.createdByName;
        return name || row.createdBy?.fullName || row.createdBy?.username || "—";
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
        <Flex justify='end' align='center' gap='1'>
          {user?.type === "restaurant" && <Flex
            justify="end"
            align="center"
            gap="1"
            className="lg:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100 transition-opacity duration-300"
          >
            <ConfirmationDialog
              title="Delete"
              description="Are you sure you want to delete this stock? All Stock history related to this stock will also be deleted"
              saveButtonTitle="Confirm"
              confirmAction={() => handleDelete(row._id)}
              trigger={
                <button className="p-1 rounded-full transition hover:bg-red-100 cursor-pointer">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              }
            />
          </Flex>}
          {row.stockHistory.length > 0 && (
            <ReuseableDialog
              title={`${row.name} Stock History`}
              triggerButton={
                <History className="p-1 w-7 h-7 text-gray-600 cursor-pointer!" />
              }
              content={
                <HistoryTable
                  stockId={row._id}
                  historyData={row.stockHistory}
                  handleDeleteHistory={handleDeleteHistory}
                  handleUpdateStockHistory={handleUpdateStockHistory}
                />
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
