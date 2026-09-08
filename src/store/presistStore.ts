import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage/storage";
import { User, Stock, Employees, Order } from "@/types";

interface AuthState {
  token?: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;

  // ── Stocks ─────────────────────────────────────────────
  stocks: Stock[];
  stocksLoaded: boolean;
  setStocks: (stocks: Stock[]) => void;
  setStocksLoaded: (loaded: boolean) => void;
  updateStockById: (stock: Stock) => void;
  updateStocksByIds: (stocks: Stock[]) => void;

  // ── Employees ──────────────────────────────────────────
  employees: Employees;
  employeesLoaded: boolean;
  setEmployees: (employees: Employees) => void;
  setEmployeesLoaded: (loaded: boolean) => void;

  // ── Orders ─────────────────────────────────────────────
  orders: Order[];
  ordersTotal: number;
  setOrders: (orders: Order[], total: number) => void;
  appendOrders: (orders: Order[], total: number) => void;
  updateOrderById: (order: Order) => void;
  resetOrders: () => void;
}

export const usePersistStore = create<AuthState>()(
  persist(
    (set) => {
      return {
        user: null,
        setUser: (user) => {
          set({ user });
        },
        token: null,
        setToken: (token) => {
          set({ token });
        },

        // ── Stocks ─────────────────────────────────────────
        stocks: [],
        stocksLoaded: false,
        setStocks: (stocks) => set({ stocks, stocksLoaded: true }),
        setStocksLoaded: (loaded) => set({ stocksLoaded: loaded }),
        updateStockById: (stock) =>
          set((state) => ({
            stocks: state.stocks.map((s) => (s._id === stock._id ? stock : s)),
          })),
        updateStocksByIds: (stocks) =>
          set((state) => ({
            stocks: state.stocks.map((s) => {
              const updated = stocks.find((u) => u._id === s._id);
              return updated || s;
            }),
          })),

        // ── Employees ────────────────────────────────────────
        employees: { worker: [], accountant: [] },
        employeesLoaded: false,
        setEmployees: (employees) => set({ employees, employeesLoaded: true }),
        setEmployeesLoaded: (loaded) => set({ employeesLoaded: loaded }),

        // ── Orders ─────────────────────────────────────────
        orders: [],
        ordersTotal: 0,
        setOrders: (orders, total) => set({ orders, ordersTotal: total }),
        appendOrders: (orders, total) =>
          set((state) => ({
            orders: [...state.orders, ...orders],
            ordersTotal: total,
          })),
        updateOrderById: (order) =>
          set((state) => ({
            orders: state.orders.map((o) => (o._id === order._id ? order : o)),
          })),
        resetOrders: () => set({ orders: [], ordersTotal: 0 }),
      };
    },
    {
      name: "auth",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
