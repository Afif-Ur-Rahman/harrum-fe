import { create } from "zustand";
import { MainOrder, OrderType } from "@/types/orders";

interface OrderStoreState {
  allOrders: MainOrder[];
  order: { status: string; orders: OrderType[] };
  mainOrderId: string;
  ordersCount: number;
  totalAmount: number;
  setOrder: (order: { status: string; orders: OrderType[] }) => void;
  setAllOrders: (updater: MainOrder[] | ((prev: MainOrder[]) => MainOrder[])) => void;
  setMainOrderId: (id: string) => void;
}

const calcTotalAmount = (orders: OrderType[]) =>
  orders.reduce(
    (sum, order) =>
      sum +
      (order.subOrder
        ? order.subOrder.reduce(
            (s, sub) => s + (sub.variant?.price || 0) * (sub.quantity || 0),
            0,
          )
        : 0),
    0,
  );

export const useOrderStore = create<OrderStoreState>((set) => ({
  allOrders: [],
  order: { status: "", orders: [] },
  mainOrderId: "",
  ordersCount: 0,
  totalAmount: 0,
  setOrder: (order) =>
    set({
      order: { status: order.status, orders: order.orders || [] },
      ordersCount: order.orders?.length ?? 0,
      totalAmount: calcTotalAmount(order.orders || []),
    }),
  setAllOrders: (updater) =>
    set((state) => ({
      allOrders: typeof updater === "function" ? updater(state.allOrders) : updater,
    })),
  setMainOrderId: (id) => set({ mainOrderId: id }),
}));
