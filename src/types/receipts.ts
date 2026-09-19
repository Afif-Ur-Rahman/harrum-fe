import type { Customer } from "./customers";
import type { Vendor } from "./vendors";

export type PaymentMethod = "cash" | "online";

export type ReceiptPartyType = "Customer" | "Vendor";

export type ReceiptParty = Customer | Vendor;

export interface Receipt {
  _id: string;
  party: ReceiptParty | string;
  type: ReceiptPartyType;
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
  updatedParty?: ReceiptParty;
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
