import {
  createStock,
  getAllStocks,
  updateStockHistory,
  deleteStock,
  deleteStockHistory,
  stockOut,
} from "@/api/api-call";
import { Stock } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useStockForm, StockFormType } from "./form";
import { useFieldArray, useWatch } from "react-hook-form";
import { usePersistStore } from "@/store/presistStore";
import { showToast } from "@/utils/toast";

const useStocks = () => {
  const { user } = usePersistStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const initialValues: StockFormType = {
    stockItems: [],
    selectedStock: [],
  };
  const form = useStockForm(initialValues);
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Out of Stock", label: "Out of Stock" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [open, setOpen] = useState(false);
  const [wastageReason, setWastageReason] = useState("");
  const [openDialog, setOpenDialog] = useState<{
    id: string | null;
    type: "add" | "update" | null;
  }>({ id: null, type: null });

  const stockOptions = useMemo(() => {
    return Array.isArray(stocks)
      ? stocks.map((item) => item.name).filter(Boolean)
      : [];
  }, [stocks]);

  const unitOptions = [
    { label: "Kilogram", value: "KG" },
    { label: "Liter", value: "L" },
    { label: "Pieces", value: "Pcs" },
  ];

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stockItems",
  });

  const selectedStock = useWatch({
    control: form.control,
    name: "selectedStock",
    defaultValue: [],
  });

  const stockItems = useWatch({
    control: form.control,
    name: "stockItems",
    defaultValue: [],
  });

  const isSaveDisabled =
    !stockItems?.length ||
    stockItems.some((item) => {
      const qty = Number(item.newQuantity);
      const price = Number(item.newPrice);

      return qty <= 0 || price <= 0 || isNaN(qty) || isNaN(price);
    });

  const isStockOutDisabled =
    !stockItems?.length ||
    stockItems.some((item) => {
      const qty = Number(item.newQuantity);

      return qty <= 0 || isNaN(qty);
    });

  useEffect(() => {
    selectedStock?.forEach((stockName) => {
      if (!fields.find((f) => f.name === stockName)) {
        const existingStock = stocks.find((s) => s.name === stockName);

        append({
          _id: existingStock?._id || "",
          name: stockName,
          remainingQuantity: existingStock?.quantity?.toString() || "0",
          newQuantity: "",
          unit: existingStock?.unit || "",
          oldPrice: existingStock?.price?.toString() || "0",
          newPrice: "",
        });
      }
    });

    // Collect all indices to remove first, then remove highest-to-lowest
    // to prevent index shifting from breaking subsequent removals
    const indicesToRemove = fields
      .map((field, index) => (!selectedStock?.includes(field.name) ? index : null))
      .filter((i): i is number => i !== null)
      .reverse();
    indicesToRemove.forEach((i) => remove(i));
  }, [selectedStock, append, remove, fields, stocks]);

  const getStocks = async () => {
    const response = await getAllStocks();
    const data = response?.data?.data;
    if (!data) return;
    setStocks(data || []);
  };

  const onAddStock = async (data: StockFormType) => {
    delete data.selectedStock;
    const result = await createStock(data);

    if (result?.error || !result?.data) {
      showToast("error", result?.error || "Request Failed");
      return;
    }

    const updatedItems = result?.data?.data;
    if (updatedItems) {
      setStocks((prev) => {
        const updatedMap = new Map(updatedItems.map((s: Stock) => [s._id, s]));
        const merged = prev.map((s: Stock) => updatedMap.has(s._id) ? updatedMap.get(s._id)! : s);
        const newOnes = updatedItems.filter((s: Stock) => !prev.find((p: Stock) => p._id === s._id));
        return [...merged, ...newOnes];
      });
    }

    form.reset();
    showToast("success", result?.data?.message || "Stock Added Successfully");
  };

  const onUpdateStockHistory = async (
    data: { quantity: number; price: number },
    id: string,
    historyId: string,
  ) => {
    const result = await updateStockHistory(data, id, historyId);
    if (result?.error || !result?.data) {
      showToast("error", result?.error || "Request Failed");
      return;
    }
    setStocks((prev) =>
      prev.map((s) => (s._id === id ? (result?.data?.data ?? s) : s)),
    );
    setOpenDialog({ id: null, type: null });
    showToast("success", result?.data?.message || "Stock Updated Successfully");
  };

  const onDeleteStock = async (id: string) => {
    const result = await deleteStock(id);
    if (!result || result.error) return { state: false, error: result?.error || "Request Failed" };

    setStocks((prev) => prev.filter((s) => s._id !== id));
    setOpenDialog({ id: null, type: null });

    return { state: true, message: result?.data?.message };
  };

  const onDeleteStockHistory = async (stockId: string, historyId: string) => {
    const result = await deleteStockHistory(stockId, historyId);
    if (!result || result.error) return { state: false, error: result?.error || "Request Failed" };

    setStocks((prev) =>
      prev.map((s) => (s._id === stockId ? (result?.data?.data ?? s) : s)),
    );
    setOpenDialog({ id: null, type: null });

    return { state: true, message: result?.data?.message };
  };

  const onStockOut = async (data: StockFormType) => {
    delete data.selectedStock;
    const payload = {
      stockItems: data.stockItems.reduce(
        (acc, item) => {
          if (!item._id) return acc;
          acc.push({
            _id: String(item._id),
            newQuantity: String(item.newQuantity),
          });
          return acc;
        },
        [] as { _id: string; newQuantity: string }[],
      ),
      reason: wastageReason.trim() || undefined,
    };
    const result = await stockOut(payload);

    if (result?.error || !result?.data) {
      showToast("error", result?.error || "Request Failed");
      return;
    }

    const updatedItems = result?.data?.data;
    if (updatedItems) {
      setStocks((prev) => {
        const updatedMap = new Map(updatedItems.map((s: Stock) => [s._id, s]));
        return prev.map((s: Stock) => updatedMap.has(s._id) ? updatedMap.get(s._id)! : s);
      });
    }

    form.reset();
    setWastageReason("");
    showToast("success", "Wastage recorded successfully");
  };

  useEffect(() => {
    (async () => {
      getStocks();
    })();
  }, []);

  return {
    user,
    stocks,
    form,
    fields,
    selectedStock,
    stockOptions,
    unitOptions,
    statusOptions,
    selectedStatus,
    setSelectedStatus,
    open,
    setOpen,
    wastageReason,
    setWastageReason,
    openDialog,
    setOpenDialog,
    onAddStock,
    onUpdateStockHistory,
    onDeleteStock,
    onDeleteStockHistory,
    isSaveDisabled,
    onStockOut,
    isStockOutDisabled,
  };
};

export { useStocks };
