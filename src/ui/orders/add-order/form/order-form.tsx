"use client";

import { Save, PackagePlus, UserCheck } from "lucide-react";
import { FormProvider, UseFormReturn } from "react-hook-form";

import { EmptyState, FormInput } from "@/components";
import { Stock } from "@/types";

import { CUSTOMER_FORM_FIELDS } from "./constants";

import { OrderFormType } from ".";

import { ItemSearch, ItemsTable, OrderTotal, PaidCheckbox, PrintCheckbox } from "../blocks";

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
      <section className="relative sm:pt-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {CUSTOMER_FORM_FIELDS.map(item => (
            <FormInput
              key={item.field}
              field={item.field}
              placeholder={item.placeholder}
              icon={item.icon}
              type={item.type}
              required={item.required}
              options={item.options}
              compact
              borderRounded={item.border}
            />
          ))}

          <FormInput
            field="salesmanId"
            type="select"
            placeholder="Select Salesman"
            icon={UserCheck}
            required
            options={salesmanOptions}
            compact
            borderRounded="rounded-lg"
          />

          <ItemSearch
            stockOptions={stockOptions}
            selectedStockIds={fields.map(item => item.stockId)}
            onSelectItem={addOrderItem}
          />
        </div>
      </section>

      <div className="mt-3">
        {fields.length === 0 ? (
          <EmptyState
            icon={PackagePlus}
            title="No items added"
            description="Search and select an item above to add it to the order"
          />
        ) : (
          <ItemsTable items={fields} stocks={stocks} removeItem={removeOrderItem} />
        )}
      </div>

      <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5">
          <OrderTotal orderTotal={orderTotal} />
          <PaidCheckbox />
          <PrintCheckbox />
        </div>

        <button
          type="button"
          onClick={form.handleSubmit(onSubmitOrder)}
          disabled={fields.length === 0 || submitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
        >
          <Save className="h-4 w-4" />
          <span>{submitting ? "Saving…" : "Create Order"}</span>
        </button>
      </div>
    </FormProvider>
  );
};
