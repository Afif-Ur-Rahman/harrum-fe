export interface SubscriptionItem {
  _id: string;
  restaurant: string;
  plan: "basic" | "pro" | "premium";
  price: number;
  currency: string;
  status: "active" | "expired" | "cancelled" | "pending";
  createdAt: string;
  updatedAt: string;
  expireDate: string;
  __v: number;
}

export interface SubPrice {
  price: number;
  plan: "basic" | "pro" | "premium";
}

export interface SubscriptionResponse {
  message: string;
  data: {
    subscriptions: SubscriptionItem[];
    subPrices: SubPrice[];
  };
}

export interface SubscriptionActionResponse {
  state: boolean;
  data?: {
    message: string;
    subscription?: SubscriptionItem;
    plan?: string;
  };
  error?: string;
}
