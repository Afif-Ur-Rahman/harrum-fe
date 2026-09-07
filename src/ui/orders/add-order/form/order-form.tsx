"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { Save, PackagePlus, UserCheck } from "lucide-react";
import { OrderFormType } from ".";
import { Stock } from "@/types";
import { CUSTOMER_FORM_FIELDS } from "./constants";
import { EmptyState, FormInput } from "@/components";
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
          <EmptyState
            icon={PackagePlus}
            title="No items added"
            description="Search and select an item above to add it to the order"
          />
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
