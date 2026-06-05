import { Product } from "./product";

export interface MenuType {
  _id: string;
  category: string;
  media: string[];
  products: Product[];
  sequence?: number;
}
