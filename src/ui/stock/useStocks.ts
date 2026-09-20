import { createStock, getAllStocks, getAllVendors } from "@/api/api-call";
import { Stock } from "@/types";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useStockForm, StockFormType } from "./form";
import { useFieldArray, useWatch } from "react-hook-form";
import { showToast } from "@/utils/toast";
import { usePersistStore } from "@/store/presistStore";
import { NO_COLOR_VARIANT_TYPES } from "./constants";
import { EMPTY_STOCK_FILTERS, type StockFilters } from "./blocks/stock-filters";

const useStocks = () => {
  const {
    stocks,
    stocksLoaded,
    setStocks,
    vendors,
    setVendors,
    vendorsLoaded,
  } = usePersistStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<StockFilters>(EMPTY_STOCK_FILTERS);

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

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        label: vendor.name,
        value: vendor._id,
      })),
    [vendors],
  );

  // Unique brands from the loaded stocks, used as filter options
  const brandOptions = useMemo(() => {
    const unique = new Set(
      (Array.isArray(stocks) ? stocks : [])
        .map((stock) => stock.brand)
        .filter(Boolean),
    );

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [stocks]);

  // Price type alone is not a filter — it only matters once a min or max is set
  const hasPriceRange = filters.minPrice !== "" || filters.maxPrice !== "";

  const activeFilterCount = [
    filters.brands.length > 0,
    filters.types.length > 0,
    hasPriceRange,
  ].filter(Boolean).length;

  const filteredStocks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const parsedMin =
      filters.minPrice !== "" ? Number(filters.minPrice) : Number.NaN;
    const parsedMax =
      filters.maxPrice !== "" ? Number(filters.maxPrice) : Number.NaN;

    const min = Number.isNaN(parsedMin) ? null : parsedMin;
    const max = Number.isNaN(parsedMax) ? null : parsedMax;

    const priceKey = `${filters.priceType}Price` as const;

    return stocks.filter((stock) => {
      if (filters.brands.length > 0 && !filters.brands.includes(stock.brand)) {
        return false;
      }

      if (filters.types.length > 0 && !filters.types.includes(stock.type)) {
        return false;
      }

      if (min !== null || max !== null) {
        const price = Number(stock[priceKey]) || 0;

        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
      }

      if (!query) return true;

      const matchesName = stock.name?.toLowerCase().includes(query);
      const matchesBrand = stock.brand?.toLowerCase().includes(query);
      const matchesColor = stock.variants?.some((variant) =>
        variant.color?.toLowerCase().includes(query),
      );

      return matchesName || matchesBrand || matchesColor;
    });
  }, [stocks, search, filters]);

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
        !item.vendor?.trim() ||
        !item.size?.trim();

      const invalidPrices =
        purchasePrice < 0 ||
        wholesalePrice < 0 ||
        salePrice < 0 ||
        salePrice < wholesalePrice ||
        isNaN(wholesalePrice) ||
        isNaN(salePrice);

      const invalidVariants =
        !NO_COLOR_VARIANT_TYPES.includes(item.type) &&
        (!item.variants?.length ||
          item.variants.some((variant) => {
            const qty = Number(variant.quantity);

            return !variant.color?.trim() || qty <= 0 || isNaN(qty);
          }));

      return invalidBasicFields || invalidPrices || invalidVariants;
    });

  const getStocks = async () => {
    if (stocksLoaded) return;

    const response = await getAllStocks();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    setStocks(response?.data?.data || []);
  };

  const getVendors = async (force = false) => {
    if (vendorsLoaded && !force) return;

    const response = await getAllVendors();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    setVendors(response?.data?.data || []);
  };

  const addNewStockRow = (name: string) => {
    append({
      name,
      brand: "",
      vendor: "",
      type: "",
      size: "",
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
      vendor: stock.vendor || "",
      type: stock.type || "",
      size: stock.size || "meters",
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

    if (response?.data?.data) {
      setStocks(response.data.data);
    }

    showToast("success", "Stock created successfully");
  };

  useEffect(() => {
    getStocks();
    getVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stocks,
    filteredStocks,
    search,
    setSearch,
    filters,
    setFilters,
    brandOptions,
    activeFilterCount,
    form,
    fields,
    stockOptions,
    vendorOptions,
    addNewStockRow,
    addExistingStockRow,
    removeStockRow,
    onAddStock,
    isSaveDisabled,
    getStocks,
  };
};

export { useStocks };
