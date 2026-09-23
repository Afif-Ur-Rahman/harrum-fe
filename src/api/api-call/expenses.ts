import { ResponseForExpense, ResponseForMultipleExpenses, ExpenseCategory } from "@/types";

import { serverAction } from "../server-action";

interface CreateExpensePayload {
  amount: number;
  note: string;
  category: ExpenseCategory;
  paymentMethod: "cash" | "online";
  date?: string;
}

interface UpdateExpensePayload {
  amount?: number;
  note?: string;
  category?: ExpenseCategory;
  paymentMethod?: "cash" | "online";
  date?: string;
}

export const getAllExpenses = async (params?: {
  page?: number;
  limit?: number;
  categories?: string[];
  paymentMethods?: string[];
  from?: string;
  to?: string;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.categories?.length) {
      params.categories.forEach(c => query.append("category", c));
    }
    if (params?.paymentMethods?.length) {
      params.paymentMethods.forEach(m => query.append("paymentMethod", m));
    }
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);

    const response = await serverAction({
      url: `/expenses?${query.toString()}`,
      method: "GET",
    });
    return response as ResponseForMultipleExpenses;
  } catch (error) {
    console.error("Failed to get expenses:", (error as Error).message);
    return null;
  }
};

export const createExpense = async (data: CreateExpensePayload) => {
  try {
    const response = await serverAction({
      url: "/expenses",
      method: "POST",
      body: data,
    });
    return response as ResponseForExpense;
  } catch (error) {
    console.error("Failed to create expense:", (error as Error).message);
    return null;
  }
};

export const updateExpense = async (id: string, data: UpdateExpensePayload) => {
  try {
    const response = await serverAction({
      url: `/expenses/${id}`,
      method: "PUT",
      body: data,
    });
    return response as ResponseForExpense;
  } catch (error) {
    console.error("Failed to update expense:", (error as Error).message);
    return null;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/expenses/${id}`,
      method: "DELETE",
    });
    return response as {
      state: boolean;
      data?: { message: string };
      error?: string;
    };
  } catch (error) {
    console.error("Failed to delete expense:", (error as Error).message);
    return null;
  }
};
