"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, ShoppingBag, RefreshCcw, X } from "lucide-react";
import {
  useNotificationStore,
  AppNotification,
} from "@/store/notificationStore";
import { usePersistStore } from "@/store/presistStore";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const typeIcon = (type: AppNotification["type"]) => {
  if (type === "order")
    return <ShoppingBag className="w-4 h-4 text-orange-500" />;
  if (type === "status")
    return <RefreshCcw className="w-4 h-4 text-blue-500" />;
  return <Bell className="w-4 h-4 text-gray-400" />;
};

const typeRing = (type: AppNotification["type"]) => {
  if (type === "order") return "bg-orange-50 ring-1 ring-orange-100";
  if (type === "status") return "bg-blue-50 ring-1 ring-blue-100";
  return "bg-gray-50 ring-1 ring-gray-100";
};

const ordersPath = (userType: string) => {
  if (userType === "chef") return "/chef/orders";
  if (userType === "waiter") return "/waiter/orders";
  return "/restaurant/orders";
};

export const NotificationPanel = () => {
  const { notifications, unreadCount, markAllRead, clear } =
    useNotificationStore();
  const { user } = usePersistStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open && unreadCount > 0) markAllRead();
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-semibold text-gray-800">
                Notifications
              </span>
              {notifications.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clear}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                    title="Clear all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                <Bell className="w-8 h-8 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const path = n.orderId
                  ? `${ordersPath(user?.type ?? "restaurant")}?orderId=${n.orderId}`
                  : null;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (path) { setOpen(false); router.push(path); }
                    }}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors border-b border-gray-50 last:border-0 ${
                      !n.read ? "bg-blue-50/40" : ""
                    } ${path ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${typeRing(n.type)}`}>
                      {typeIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.body}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
