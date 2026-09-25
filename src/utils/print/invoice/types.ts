import { Order } from "@/types";

export interface InvoiceItem {
  name: string;
  detail?: string;
  quantity: string;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  customerName: string;
  orderId: string;
  phone: string;
  date: string;
  email: string;
  items: InvoiceItem[];
  total: number;
  discount: number;
  final: number;
  salesman?: string;
}

export type InvoiceOrder = Order;
