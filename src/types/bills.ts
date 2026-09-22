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

export interface BillResponse {
  message: string;
  data: Bill[];
  updatedVendor?: Vendor;
}

export interface BillListResponse {
  message: string;
  data: Bill[];
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
