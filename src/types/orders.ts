import type { Stock } from "./stock";

export interface Salesman {
  _id: string;
  username: string;
  email: string;
}

export interface OrderVariant {
  _id?: string;
  color: string;
  quantity: number;
  price: number;
  isReturned?: boolean;
  isClaimed?: boolean;
}

export interface OrderItem {
  _id?: string;
  stockId: string;
  name: string;
  priceType: "purchase" | "wholesale" | "sale";
  variants: OrderVariant[];
}

export interface Order {
  _id: string;
  customerName: string;
  email?: string;
  phone: string;
  salesman: Salesman;
  items: OrderItem[];
  discount: number;
  totalPrice: number;
  createdBy: string | { _id: string; username: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  message: string;
  data: Order;
  updatedStocks?: Stock[];
  updatedStock?: Stock;
}

export interface OrderListData {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OrderListResponse {
  message: string;
  data: OrderListData;
}

export interface ResponseForOrder {
  state: boolean;
  data?: OrderResponse;
  error?: string;
}

export interface ResponseForMultipleOrders {
  state: boolean;
  data?: OrderListResponse;
  error?: string;
}
