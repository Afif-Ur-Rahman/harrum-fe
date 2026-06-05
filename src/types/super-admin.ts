export interface SuperAdminRestaurant {
  _id: string;
  email: string;
  isVerified: boolean;
  otp: string;
  otpExpires: string;
  language: string;
  type: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  city: string;
  country: string;
  fullName: string;
  image: string;
  username: string;
  zip: string;
  coverImage: string;
}

export interface SuperAdminSubscriptionStat {
  _id: string;
  restaurant: {
    username: string;
    image: string;
    _id: string;
    email: string;
  };
  plan: string;
  status: "active" | "expired" | "cancelled" | "pending";
  currency: string;
  price: number;
  limits?: number;
  expireDate?: string;
  createdAt: string;
  __v: number;
}

export interface ReportedRestaurants {
  createdAt: string;
  reason: string;
  reportedItem: string;
  reporter: string;
  status: string;
  type:
    | "restaurant"
    | "accountant"
    | "chef"
    | "waiter"
    | "admin"
    | "superAdmin";
  updatedAt: string;
  _id: string;
  _v: number;
}

export interface Chart {
  categories: string[];
  series: { name: string; data: number[] }[];
}

export interface Counts {
  subscriptionCount: number;
  restaurantCount: number;
  reportedCount: number;
}

export interface SuperAdminDashboardResponse {
  message: string;
  counts: Counts;
  data: {
    reportedRestaurants: ReportedRestaurants[];
    subscriptionStats: SuperAdminSubscriptionStat[];
    totalRestaurants: SuperAdminRestaurant[];
    chart: Chart | null;
  };
}

export interface SuperAdminStatsResponse {
  state: boolean;
  data?: SuperAdminDashboardResponse;
  error?: string;
}
