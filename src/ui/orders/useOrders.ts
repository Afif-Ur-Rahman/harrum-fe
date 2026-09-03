import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { getAllStocks } from "@/api/api-call/stock";
import { Stock } from "@/types";
import { useOrderForm, OrderFormType } from "./form";
import { showToast } from "@/utils/toast";

const useOrders = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const initialValues: OrderFormType = {
    customerName: "",
    email: "",
    phone: "",
    items: [],
  };

  const form = useOrderForm(initialValues);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const stockOptions = useMemo(() => {
    return Array.isArray(stocks)
      ? stocks.map((item) => ({
          value: item._id,
          label: `${item.name} - ${item.brand}`,
          stock: item,
        }))
      : [];
  }, [stocks]);

  const getStocks = async () => {
    const response = await getAllStocks();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    setStocks(response?.data?.data || []);
  };

  const addOrderItem = (stock: Stock) => {
    const currentItems = form.getValues("items") || [];

    const alreadyAdded = currentItems.some(
      (item) => item.stockId === stock._id,
    );

    if (alreadyAdded) {
      showToast("error", "This item is already added to the order");
      return;
    }

    append({
      stockId: stock._id,
      name: `${stock.name} - ${stock.brand}`,
      variants: [{ color: "", quantity: "" }],
    });
  };

  const removeOrderItem = (index: number) => {
    remove(index);
  };

  const onSubmitOrder = async (data: OrderFormType) => {
    setSubmitting(true);

    // TODO: replace with real API call once the Orders backend is ready
    // const response = await createOrder(data);
    console.log("New Order Payload:", data);

    showToast("success", "Order logged to console — API integration pending");

    form.reset(initialValues);
    setSubmitting(false);
  };

  useEffect(() => {
    (async () => {
      await getStocks();
    })();
  }, []);

  return {
    stocks,
    stockOptions,
    form,
    fields,
    addOrderItem,
    removeOrderItem,
    onSubmitOrder,
    submitting,
  };
};

export { useOrders };
