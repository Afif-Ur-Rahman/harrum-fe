"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createExpense, getAllExpenses } from "@/api/api-call/expenses";
import { Expense } from "@/types";
import { showToast } from "@/utils/toast";

import { EMPTY_EXPENSE_FILTERS, type ExpenseFilters } from "./blocks/expense-filters";
import { ExpenseFormType } from "./form";

const EXPENSES_PER_PAGE = 30;

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

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
        return false;
      }
      if (
        filters.paymentMethods.length > 0 &&
        !filters.paymentMethods.includes(expense.paymentMethod)
      ) {
        return false;
      }
      if (filters.from || filters.to) {
        const expenseDate = new Date(expense.date);
        if (filters.from) {
          const fromDate = new Date(`${filters.from}T00:00:00`);
          if (expenseDate < fromDate) {
            return false;
          }
        }
        if (filters.to) {
          const toDate = new Date(`${filters.to}T23:59:59.999`);
          if (expenseDate > toDate) {
            return false;
          }
        }
      }
      return true;
    });
  }, [expenses, filters]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const response = await getAllExpenses({ limit: EXPENSES_PER_PAGE });
    if (response?.error) {
      showToast("error", response.error);
      setLoading(false);
      return;
    }
    setExpenses(response?.data?.data?.expenses || []);
    setTotal(response?.data?.data?.total || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    (() => fetchExpenses)();
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
    filteredExpenses,
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
