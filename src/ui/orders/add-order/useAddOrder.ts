"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";

import { createOrder } from "@/api/api-call";
import { getAllEmployees } from "@/api/api-call/employee";
import { getAllStocks } from "@/api/api-call/stock";
import { usePersistStore } from "@/store/presistStore";
import { Stock } from "@/types";
import { NO_COLOR_VARIANT_TYPES } from "@/ui/stock/constants";
import { printOrder } from "@/utils";
import { showToast } from "@/utils/toast";

import { useOrderForm, OrderFormType } from "./form";

const useAddOrder = () => {
  const {
    stocks,
    stocksLoaded,
    setStocks,
    employees,
    employeesLoaded,
    setEmployees,
    updateStocksByIds,
  } = usePersistStore();

  const [submitting, setSubmitting] = useState(false);

  const initialValues: OrderFormType = {
    customerName: "",
    email: "",
    phone: "",
    salesmanId: "",
    totalPrice: "0",
    discount: "0",
    isPaid: true,
    print: true,
    items: [],
  };

  const form = useOrderForm(initialValues);

  const filteredStocks = useMemo(() => {
    return stocks
      .map(stock => {
        if (!stock.variants?.length) {
          return Number(stock.quantity) > 0 ? stock : null;
        }

        const availableVariants = stock.variants.filter(v => Number(v.quantity) > 0);

        if (availableVariants.length === 0) {
          return null;
        }

        return {
          ...stock,
          variants: availableVariants,
        };
      })
      .filter((stock): stock is Stock => stock !== null);
  }, [stocks]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items =
    useWatch({
      control: form.control,
      name: "items",
    }) || [];

  const orderTotal = items.reduce((sum, item) => {
    if (item?.hasVariants === false) {
      return sum + (Number(item?.price) || 0);
    }

    const itemTotal = (item?.variants || []).reduce((vSum, v) => vSum + (Number(v?.price) || 0), 0);

    return sum + itemTotal;
  }, 0);

  const stockOptions = useMemo(() => {
    return filteredStocks.map(item => ({
      value: item._id,
      label: `${item.name} - ${item.brand}`,
      stock: item,
    }));
  }, [filteredStocks]);

  const salesmanOptions = useMemo(() => {
    const allEmployees = [...(employees.salesman || []), ...(employees.accountant || [])];

    return allEmployees.map(employee => ({
      value: employee._id,
      label: employee.username,
    }));
  }, [employees]);

  const getStocks = async () => {
    if (stocksLoaded) return;

    const response = await getAllStocks();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    setStocks(response?.data?.data || []);
  };

  const getEmployees = async () => {
    if (employeesLoaded) return;

    const response = await getAllEmployees();

    if (response?.error) {
      showToast("error", response.error);
      return;
    }

    const data = response?.data?.data || {
      salesman: [],
      accountant: [],
    };

    setEmployees(data);

    const firstEmployee = [...(data.salesman || []), ...(data.accountant || [])][0];

    if (firstEmployee && !form.getValues("salesmanId")) {
      form.setValue("salesmanId", firstEmployee._id);
    }
  };

  const addOrderItem = (stock: Stock) => {
    const isNoColorType = NO_COLOR_VARIANT_TYPES.includes(stock.type);

    if (isNoColorType) {
      append({
        stockId: stock._id,
        name: `${stock.name} - ${stock.brand}`,
        size: stock.size,
        priceType: "sale",
        hasVariants: false,
        quantity: "",
        price: "0",
        variants: [],
      });
      return;
    }

    append({
      stockId: stock._id,
      name: `${stock.name} - ${stock.brand}`,
      size: stock.size,
      priceType: "sale",
      hasVariants: true,
      variants: [
        {
          color: "",
          quantity: "",
          price: "0",
        },
      ],
    });
  };

  const removeOrderItem = (index: number) => {
    remove(index);
  };

  const onSubmitOrder = async (data: OrderFormType) => {
    setSubmitting(true);

    // `print` is frontend-only, never sent to the backend
    const { print, ...orderPayload } = data;

    const response = await createOrder(orderPayload);

    if (response?.error || !response?.data) {
      showToast("error", response?.error || "Failed to create order");
      setSubmitting(false);
      return;
    }

    if (response.data.updatedStocks?.length) {
      updateStocksByIds(response.data.updatedStocks);
    }

    showToast("success", response.data.message || "Order created successfully");

    if (print) {
      printOrder(
        response.data.data,
        salesmanOptions.find(option => option.value === data.salesmanId)?.label,
      );
    }

    form.reset({
      ...initialValues,
      salesmanId: data.salesmanId,
      print: data.print,
    });

    setSubmitting(false);
  };

  useEffect(() => {
    Promise.all([getStocks(), getEmployees()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stocks: filteredStocks,
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

export { useAddOrder };
