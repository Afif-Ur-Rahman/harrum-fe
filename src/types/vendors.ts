import { StockVariant } from "./stock";

export interface Vendor {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorResponse {
  message: string;
  data: Vendor;
}

export interface VendorListResponse {
  message: string;
  data: Vendor[];
}

export interface ResponseForSingleVendor {
  state: boolean;
  data?: VendorResponse;
  error?: string;
}

export interface ResponseForMultipleVendors {
  state: boolean;
  data?: VendorListResponse;
  error?: string;
}

export interface VendorStockPurchase {
  _id: string;
  date: string;
  purchasePrice: number;
  wholesalePrice: number;
  salePrice: number;
  quantity: number;
  variants: StockVariant[];
  totalAmount: number;
}

export interface VendorStockItem {
  _id: string;
  name: string;
  brand: string;
  type: string;
  size: string;
  purchasePrice: number;
  wholesalePrice: number;
  salePrice: number;
  quantity?: number;
  variants: StockVariant[];
  inStock: number;
  purchases: VendorStockPurchase[];
  purchasedQuantity: number;
  purchasedAmount: number;
}

export interface VendorStocksTotals {
  itemsCount: number;
  purchasesCount: number;
  totalQuantity: number;
  totalAmount: number;
}

export interface VendorStocksResponse {
  message: string;
  data: {
    vendor: Pick<
      Vendor,
      "_id" | "name" | "phone" | "email" | "remainingAmount"
    >;
    items: VendorStockItem[];
    totals: VendorStocksTotals;
  };
}

export interface ResponseForVendorStocks {
  state: boolean;
  data?: VendorStocksResponse;
  error?: string;
}
