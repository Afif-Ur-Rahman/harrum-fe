export interface StockVariant {
  color: string;
  quantity: number;
}

export interface StockHistory {
  _id: string;
  wholesalePrice: number;
  salePrice: number;
  variants: StockVariant[];
  date: string;
}

export interface Stock {
  _id: string;
  name: string;
  brand: string;
  wholesalePrice: number;
  salePrice: number;
  variants: StockVariant[];
  size: string;
  article: string;
  history: StockHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface AddStockPayload {
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
