import type { Customer } from "./customers";

export type PaymentMethod = "cash" | "online";

export interface Receipt {
  _id: string;
  customer: Customer | string;
  amount: number;
  note?: string;
  paymentMethod: PaymentMethod;
  createdBy: string | { _id: string; username: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptResponse {
  message: string;
  data: Receipt;
  updatedCustomer?: Customer;
}

export interface ReceiptListData {
  receipts: Receipt[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ReceiptListResponse {
  message: string;
  data: ReceiptListData;
}

export interface ResponseForReceipt {
  state: boolean;
  data?: ReceiptResponse;
  error?: string;
}

export interface ResponseForMultipleReceipts {
  state: boolean;
  data?: ReceiptListResponse;
  error?: string;
}
