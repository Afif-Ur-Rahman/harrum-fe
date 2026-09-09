import { useEffect, useMemo, useState } from "react";
import { getAllOrders } from "@/api/api-call/orders";
import { Order } from "@/types";
import { showToast } from "@/utils/toast";

export const useCustomerOrders = (customerId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!customerId) return;

    const fetchOrders = async () => {
      setLoading(true);

      const res = await getAllOrders({
        customerId,
        limit: 100,
      });

      if (res?.error) {
        showToast("error", res.error);
        setLoading(false);
        return;
      }

      setOrders(res?.data?.data?.orders || []);
      setLoading(false);
    };

    fetchOrders();
  }, [customerId]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const salesmanName = order.salesman?.username?.toLowerCase() || "";

      const salesmanEmail = order.salesman?.email?.toLowerCase() || "";

      const itemNames =
        order.items?.map((item) => item.name?.toLowerCase() || "").join(" ") ||
        "";

      const variantNames =
        order.items
          ?.flatMap(
            (item) =>
              item.variants?.map(
                (variant) => variant.color?.toLowerCase() || "",
              ) || [],
          )
          .join(" ") || "";

      return (
        salesmanName.includes(query) ||
        salesmanEmail.includes(query) ||
        itemNames.includes(query) ||
        variantNames.includes(query)
      );
    });
  }, [orders, search]);

  return {
    orders,
    filteredOrders,
    loading,
    search,
    setSearch,
  };
};
