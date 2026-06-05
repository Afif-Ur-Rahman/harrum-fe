import { User } from "./user";

export interface StockHistory {
  _id: string;
  price: number;
  quantity: number;
  unit: string;
  date: string;
  createdBy: User;
  createdByName?: string;
  type?: "stock-in" | "wastage" | "order";
  reason?: string;
}

export interface Stock {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  restaurant: string;
  createdBy: User;
  stockHistory: StockHistory[];
  createdAt:string;
}

export interface StockResponseMultiple {
  message: string;
  data: Stock[];
}
export interface StockResponseSingle {
  message: string;
  data: Stock;
}

export interface ResponseForSingleStock {
  state: boolean;
  data?: StockResponseSingle;
  error?: string;
}

export interface ResponseForMultipleStocks {
  state: boolean;
  data?: StockResponseMultiple;
  error?: string;
}
