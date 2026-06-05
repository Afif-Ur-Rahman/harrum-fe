import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "order" | "status" | "system";
  read: boolean;
  timestamp: Date;
  orderId?: string;
  tableNo?: number;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  push: (n: Omit<AppNotification, "id" | "read" | "timestamp">) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  push: (n) => {
    const entry: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random()}`,
      read: false,
      timestamp: new Date(),
    };
    const next = [entry, ...get().notifications].slice(0, 50);
    set({ notifications: next, unreadCount: next.filter((x) => !x.read).length });
  },
  markAllRead: () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
  },
  clear: () => set({ notifications: [], unreadCount: 0 }),
}));
