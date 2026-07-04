import { createStock, getAllStocks } from "@/api/api-call";
import { Stock } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useStockForm, StockFormType } from "./form";
import { useFieldArray, useWatch } from "react-hook-form";
import { showToast } from "@/utils/toast";

const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const initialValues: StockFormType = {
    stockItems: [],
  };

  const form = useStockForm(initialValues);

  const stockOptions = useMemo(() => {
    return Array.isArray(stocks)
      ? stocks.map((item) => ({
          value: item._id,
          label: `${item.name} - ${item.brand}`,
          stock: item,
        }))
      : [];
  }, [stocks]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stockItems",
  });

  const stockItems = useWatch({
    control: form.control,
    name: "stockItems",
    defaultValue: [],
  });

  const isSaveDisabled =
    !stockItems?.length ||
    stockItems.some((item) => {
      const purchasePrice = Number(item.purchasePrice);
      const wholesalePrice = Number(item.wholesalePrice);
      const salePrice = Number(item.salePrice);

      const invalidBasicFields =
        !item.name?.trim() ||
        !item.brand?.trim() ||
        !item.size?.trim();

      const invalidPrices =
        purchasePrice < 0 ||
        wholesalePrice < 0 ||
        salePrice < 0 ||
        salePrice < wholesalePrice ||
        isNaN(wholesalePrice) ||
        isNaN(salePrice);

      const invalidVariants =
        !item.variants?.length ||
        item.variants.some((variant) => {
          const qty = Number(variant.quantity);

          return !variant.color?.trim() || qty <= 0 || isNaN(qty);
        });

      return invalidBasicFields || invalidPrices || invalidVariants;
    });

  const getStocks = async () => {
    const response = await getAllStocks();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    setStocks(response?.data?.data || []);
  };

  const addNewStockRow = (name: string) => {
    append({
      name,
      brand: "",
      size: "meter(s)",
      purchasePrice: "",
      wholesalePrice: "",
      salePrice: "",
      variants: [
        {
          color: "",
          quantity: "",
        },
      ],
    });
  };

  const addExistingStockRow = (stock: Stock) => {
    const currentItems = form.getValues("stockItems") || [];

    const alreadyAdded = currentItems.some((item) => item._id === stock._id);

    if (alreadyAdded) {
      showToast("error", "This stock item is already added");
      return;
    }

    append({
      _id: stock._id,
      name: stock.name || "",
      brand: stock.brand || "",
      size: stock.size || "meter(s)",
      purchasePrice: String(stock.purchasePrice ?? ""),
      wholesalePrice: String(stock.wholesalePrice ?? ""),
      salePrice: String(stock.salePrice ?? ""),
      variants: stock.variants?.map((variant) => ({
        color: variant.color || "",
        quantity: String(variant.quantity ?? ""),
      })),
    });
  };

  const removeStockRow = (id: string | number) => {
    const index =
      typeof id === "number"
        ? id
        : form.getValues("stockItems").findIndex((item) => item._id === id);

    if (index !== -1) {
      remove(index);
    }
  };

  const onAddStock = async (data: StockFormType) => {
    const response = await createStock(data);

    if (response?.error) {
      showToast("error", response.error || "Request failed");
      return;
    }

    form.reset(initialValues);

    showToast("success", "Stock created successfully");
  };

  useEffect(() => {
    (async () => {
      await getStocks();
    })();
  }, []);

  return {
    stocks,
    form,
    fields,
    stockOptions,
    addNewStockRow,
    addExistingStockRow,
    removeStockRow,
    onAddStock,
    isSaveDisabled,
    getStocks,
  };
};

export { useStocks };
