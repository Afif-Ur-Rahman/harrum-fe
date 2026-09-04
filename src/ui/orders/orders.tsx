"use client";

import { ShoppingBag } from "lucide-react";
import { useOrders } from "./useOrders";
import { OrderForm } from "./form";

const Orders = () => {
  const {
    stocks,
    stockOptions,
    salesmanOptions,
    form,
    fields,
    addOrderItem,
    removeOrderItem,
    onSubmitOrder,
    submitting,
    orderTotal,
  } = useOrders();

  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <div className="mb-2 flex flex-1 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
              <ShoppingBag className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="flex flex-1 flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create Order
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Add customer details and select items to create a new order
              </p>
            </div>
          </div>

          <OrderForm
            form={form}
            stocks={stocks}
            stockOptions={stockOptions}
            salesmanOptions={salesmanOptions}
            fields={fields}
            addOrderItem={addOrderItem}
            removeOrderItem={removeOrderItem}
            onSubmitOrder={onSubmitOrder}
            submitting={submitting}
            orderTotal={orderTotal}
          />
        </div>
      </div>
    </div>
  );
};

export { Orders };
