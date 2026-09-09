"use client";

import { ShoppingBag } from "lucide-react";
import Loader from "@/components/ui/loader";
import { EmptyState } from "@/components";
import { OrderCard } from "@/ui/orders/all/blocks";
import { useCustomerOrders } from "./useCustomerOrders";
import { OrdersSearch } from "./orders-search";

export const CustomerOrders = ({ customerId }: { customerId: string }) => {
  const { orders, filteredOrders, loading, search, setSearch } =
    useCustomerOrders(customerId);

  if (loading) {
    return <Loader label="orders" />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        description="This customer hasn't placed any orders."
        showGlow={false}
        className="border-none! bg-transparent! shadow-none! backdrop-blur-none!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <OrdersSearch value={search} onChange={setSearch} />

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No matching orders"
          description="No orders match your search."
          showGlow={false}
          className="border-none! bg-transparent! shadow-none! backdrop-blur-none!"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
