import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { getAllStocks } from "@/api/api-call/stock";
import { getAllEmployees } from "@/api/api-call/employee";
import { Stock, Employees } from "@/types";
import { useOrderForm, OrderFormType } from "./form";
import { showToast } from "@/utils/toast";

const useOrders = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [employees, setEmployees] = useState<Employees>({
    worker: [],
    accountant: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const initialValues: OrderFormType = {
    customerName: "",
    email: "",
    phone: "",
    salesmanId: "",
    totalPrice: "0",
    discount: "0",
    items: [],
  };

  const form = useOrderForm(initialValues);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = useWatch({ control: form.control, name: "items" }) || [];

  const orderTotal = items.reduce((sum, item) => {
    const itemTotal = (item?.variants || []).reduce(
      (vSum, v) => vSum + (Number(v?.price) || 0),
      0,
    );
    return sum + itemTotal;
  }, 0);

  const stockOptions = useMemo(() => {
    return Array.isArray(stocks)
      ? stocks.map((item) => ({
          value: item._id,
          label: `${item.name} - ${item.brand}`,
          stock: item,
        }))
      : [];
  }, [stocks]);

  const salesmanOptions = useMemo(() => {
    const allEmployees = [
      ...(employees.worker || []),
      ...(employees.accountant || []),
    ];

    return allEmployees.map((employee) => ({
      value: employee._id,
      label: employee.username,
    }));
  }, [employees]);

  const getStocks = async () => {
    const response = await getAllStocks();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    setStocks(response?.data?.data || []);
  };

  const getEmployees = async () => {
    const response = await getAllEmployees();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    const data = response?.data?.data || { worker: [], accountant: [] };
    setEmployees(data);

    const firstEmployee = [
      ...(data.worker || []),
      ...(data.accountant || []),
    ][0];

    if (firstEmployee && !form.getValues("salesmanId")) {
      form.setValue("salesmanId", firstEmployee._id);
    }
  };

  const addOrderItem = (stock: Stock) => {
    const color = stock.variants?.[0]?.color || "";

    append({
      stockId: stock._id,
      name: `${stock.name} - ${stock.brand}`,
      priceType: "sale",
      variants: [{ color: color, quantity: "", price: "0" }],
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

    form.reset({
      ...initialValues,
      salesmanId: data.salesmanId,
    });
    setSubmitting(false);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([getStocks(), getEmployees()]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stocks,
    stockOptions,
    salesmanOptions,
    form,
    fields,
    addOrderItem,
    removeOrderItem,
    onSubmitOrder,
    submitting,
    orderTotal,
  };
};

export { useOrders };
