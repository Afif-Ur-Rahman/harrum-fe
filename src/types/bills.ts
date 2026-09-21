import type { Vendor } from "./vendors";

export interface Bill {
  _id: string;
  vendor: Pick<Vendor, "_id" | "name" | "phone"> | string;
  billId: string;
  note?: string;
  amount: number;
  createdBy: string | { _id: string; username: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface BillSummary {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export interface BillResponse {
  message: string;
  data: BillListData;
  updatedVendor?: Vendor;
}

export interface BillListData extends BillSummary {
  bills: Bill[];
}

export interface BillListResponse {
  message: string;
  data: BillListData;
}

export interface ResponseForBill {
  state: boolean;
  data?: BillResponse;
  error?: string;
}

export interface ResponseForMultipleBills {
  state: boolean;
  data?: BillListResponse;
  error?: string;
}
