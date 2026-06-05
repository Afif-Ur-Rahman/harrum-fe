import { API_URL } from "@/constants";

export interface PublicRestaurantData {
  restaurant: {
    _id: string;
    username: string;
    fullName?: string;
    image?: string;
    coverImage?: string;
    address?: string;
    currency: string;
    phone?: string;
  };
  tables: { _id: string; table: number; type: string; status: string }[];
}

export interface PublicMenuCategory {
  _id: string;
  category: string;
  media: string[];
  sequence: number;
  products: any[];
}

const publicFetch = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/api/public${path}`, { cache: "no-store" });
    if (!res.ok) return { state: false as const, error: "Request failed" };
    const data = await res.json();
    return { state: true as const, data };
  } catch {
    return { state: false as const, error: "Network error" };
  }
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const res = await publicFetch(`/check-username?username=${encodeURIComponent(username)}`);
  if (!res.state) return false;
  return (res.data as { available: boolean }).available ?? false;
};

export const getPublicRestaurant = async (username: string) => {
  const res = await publicFetch(`/${username}`);
  if (!res.state) return null;
  return (res.data as { data: PublicRestaurantData }).data ?? null;
};

export const getPublicMenu = async (username: string) => {
  const res = await publicFetch(`/${username}/menu`);
  if (!res.state) return null;
  return (res.data as { data: PublicMenuCategory[]; restaurant: any }) ?? null;
};

export const createDeliveryOrder = async (data: {
  restaurantId: string;
  subOrders: { product: string; quantity: number; variant: string }[];
  orderType: "delivery" | "pickup";
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  tip?: number;
  instructions?: string;
}) => {
  try {
    const res = await fetch(`${API_URL}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const json = await res.json();
    return { state: res.ok, data: json };
  } catch {
    return { state: false, error: "Failed to place order" };
  }
};
