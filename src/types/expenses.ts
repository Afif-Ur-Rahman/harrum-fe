export type ExpensePaymentMethod = "cash" | "online";

export type ExpenseCategory =
  "Rent" | "Utilities" | "Salary" | "Transport" | "Maintenance" | "Misc";

export interface Expense {
  _id: string;
  amount: number;
  note: string;
  category: ExpenseCategory;
  paymentMethod: ExpensePaymentMethod;
  date: string;
  createdBy: string | { _id: string; username: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseListData {
  expenses: Expense[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ExpenseListResponse {
  message: string;
  data: ExpenseListData;
}

export interface ExpenseResponse {
  message: string;
  data: Expense;
}

export interface ResponseForExpense {
  state: boolean;
  data?: ExpenseResponse;
  error?: string;
}

export interface ResponseForMultipleExpenses {
  state: boolean;
  data?: ExpenseListResponse;
  error?: string;
}
