"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { Save, PackagePlus, UserCheck } from "lucide-react";
import { OrderFormType } from "../form";
import { Stock } from "@/types";
import { CUSTOMER_FORM_FIELDS } from "../constants";
import { FormInput } from "@/components";
import { ItemSearch, ItemsTable, OrderTotal } from "../blocks";

interface StockOption {
  value: string;
  label: string;
  stock: Stock;
}

interface SalesmanOption {
  value: string;
  label: string;
}

interface OrderFormProps {
  form: UseFormReturn<OrderFormType>;
  stocks: Stock[];
  stockOptions: StockOption[];
  salesmanOptions: SalesmanOption[];
  fields: (OrderFormType["items"][number] & { id: string })[];
  addOrderItem: (stock: Stock) => void;
  removeOrderItem: (index: number) => void;
  onSubmitOrder: (data: OrderFormType) => void | Promise<void>;
  submitting: boolean;
  orderTotal: number;
}

export const OrderForm = ({
  form,
  stocks,
  stockOptions,
  salesmanOptions,
  fields,
  addOrderItem,
  removeOrderItem,
  onSubmitOrder,
  submitting,
  orderTotal,
}: OrderFormProps) => {
  return (
    <FormProvider {...form}>
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
        <p className="mb-5 text-sm uppercase tracking-[0.2em] text-cyan-200">
          Customer Details
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CUSTOMER_FORM_FIELDS.map((item) => (
            <FormInput
              key={item.field}
              field={item.field}
              label={item.label}
              placeholder={item.placeholder}
              icon={item.icon}
              type={item.type}
              required={item.required}
              options={item.options}
            />
          ))}

          <FormInput
            field="salesmanId"
            label="Salesman"
            type="select"
            placeholder="Select salesman"
            icon={UserCheck}
            required
            options={salesmanOptions}
          />
        </div>
      </section>
      <div className="mt-6">
        <ItemSearch
          stockOptions={stockOptions}
          selectedStockIds={fields.map((item) => item.stockId)}
          onSelectItem={addOrderItem}
        />
      </div>

      <div className="mt-4">
        {fields.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/8 px-6 py-16 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-950/20">
                <PackagePlus className="h-6 w-6 text-cyan-300" />
              </div>

              <p className="text-sm font-semibold text-white">No items added</p>

              <p className="mt-1 text-xs text-slate-400">
                Search and select an item above to add it to the order
              </p>
            </div>
          </div>
        ) : (
          <ItemsTable
            items={fields}
            stocks={stocks}
            removeItem={removeOrderItem}
          />
        )}
      </div>

      <div className="mt-6 flex w-full items-center justify-between gap-4">
        <OrderTotal orderTotal={orderTotal} />

        <button
          type="button"
          onClick={form.handleSubmit(onSubmitOrder)}
          disabled={fields.length === 0 || submitting}
          className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:block">
            {submitting ? "Saving…" : "Create Order"}
          </span>
        </button>
      </div>
    </FormProvider>
  );
};
