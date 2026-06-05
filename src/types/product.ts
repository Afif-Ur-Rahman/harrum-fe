import { MomentInput } from "moment";
import { Category } from "./category";
import { MenuType } from "./menu";
import { User } from "./user";

export interface Variant {
  _id: string;
  name: string;
  price: number;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  _id?: string;
  stock: string | { _id: string; name: string; unit: string };
  quantity: number;
}
export interface ProductPayload {
  title: string;
  description: string;
  category: string;
  isAvailable: boolean;
  variants: Variant[];
  media: File | null;
}

export interface Product {
  createdAt: MomentInput;
  _id: string;
  title: string;
  description: string;
  category?: string | Category;
  isAvailable: boolean;
  variants: Variant[];
  ingredients?: Ingredient[];
  media: string[] | null;
  currency: string;
  sequence?: number;
  restaurant: User;
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface ResponseForSingleProduct {
  state: boolean;
  data?: ProductResponse;
  error?: string;
}

export interface ProductResponseMultiple {
  message: string;
  data: MenuType[];
  restaurant?: User & { table: string };
}

export interface ResponseForMultipleProduct {
  state: boolean;
  data?: ProductResponseMultiple;
  error?: string;
}
