"use client";
import { useCallback, useEffect, useState } from "react";

import { createExpense, getAllExpenses } from "@/api/api-call/expenses";
import { Expense } from "@/types";
import { showToast } from "@/utils/toast";

import { ExpenseFilters } from "./blocks";
import { EMPTY_EXPENSE_FILTERS, EXPENSES_PER_PAGE } from "./constants";
import { ExpenseFormType } from "./form";

const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<ExpenseFilters>(EMPTY_EXPENSE_FILTERS);

  const activeFilterCount = [
    filters.categories.length > 0,
    filters.paymentMethods.length > 0,
    filters.from !== "",
    filters.to !== "",
  ].filter(Boolean).length;

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllExpenses({
        limit: EXPENSES_PER_PAGE,
        categories: filters.categories,
        paymentMethods: filters.paymentMethods,
        from: filters.from || undefined,
        to: filters.to || undefined,
      });
      if (response?.error) {
        showToast("error", response.error);
        return;
      }
      setExpenses(response?.data?.data?.expenses || []);
      setTotal(response?.data?.data?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const onSubmitExpense = async (data: ExpenseFormType) => {
    setSaving(true);
    const response = await createExpense({
      amount: Number(data.amount),
      note: data.note || "",
      category: data.category,
      paymentMethod: data.paymentMethod,
    });
    setSaving(false);
    if (response?.error || !response?.data) {
      showToast("error", response?.error || "Failed to create expense");
      return false;
    }
    setExpenses(prev => [response.data!.data, ...prev]);
    setTotal(prev => prev + 1);
    showToast("success", response.data.message || "Expense created successfully");
    setOpen(false);
    return true;
  };

  return {
    expenses,
    total,
    loading,
    saving,
    open,
    setOpen,
    filters,
    setFilters,
    activeFilterCount,
    onSubmitExpense,
    fetchExpenses,
  };
};
export { useExpenses };
