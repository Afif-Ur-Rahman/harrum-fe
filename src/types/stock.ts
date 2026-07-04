export interface StockVariant {
  color: string;
  quantity: number;
}

export interface StockHistory {
  _id: string;
  purchasePrice: number;
  wholesalePrice: number;
  salePrice: number;
  variants: StockVariant[];
  date: string;
}

export interface Stock {
  _id: string;
  name: string;
  brand: string;
  purchasePrice: number;
  wholesalePrice: number;
  salePrice: number;
  variants: StockVariant[];
  size: string;
  history: StockHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface AddStockPayload {
  purchasePrice: number;
  wholesalePrice: number;
  salePrice: number;
  variants: StockVariant[];
}

export interface StockResponseMultiple {
  message: string;
  data: Stock[];
}

export interface ResponseForMultipleStocks {
  state: boolean;
  data?: StockResponseMultiple;
  error?: string;
}
