import { User } from "./user";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export interface SubOrder {
  _id: string;
  product: { _id: string; media?: string[] };
  productName: string;
  quantity: number;
  variant: { variantId?: string; price: number; name: string };
  note?: string;
  itemTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Combined {
  items: {
    quantity: number;
    variant: { variantId?: string; price: number; name: string };
  }[];
  productName: string;
}

export interface OrderType {
  _id: string;
  subOrder: SubOrder[];
  guestId?: string;
  tip?: number;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MainOrder {
  _id: string;
  restaurant: User;
  table: {
    _id: string;
    table: number;
    restaurant: string;
  } | null;
  orderType?: "dine-in" | "delivery" | "pickup";
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  combined?: Combined[];
  orders: OrderType[];
  currency?: string;
  totalPrice: number;
  status: OrderStatus;
  orderBy?: User;
  tip?: number;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  message: string;
  data: MainOrder | MainOrder[];
  total: number;
}

export interface ResponseForOrders {
  state: boolean;
  data?: OrdersResponse;
  error?: string;
}

export interface OrderTableItems {
  name: string;
  price: number;
  quantity: number;
}
