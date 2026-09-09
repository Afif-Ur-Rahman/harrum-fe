"use client";

import { Plus, Contact } from "lucide-react";
import { useCustomers } from "./useCustomers";
import { CustomerTable, CustomersSearch } from "./blocks";
import { ReuseableDialog } from "@/components";
import { CustomerForm } from "./form";
import { PageLayout } from "@/components/layout";

const Customers = () => {
  const {
    filtered,
    customers,
    loading,
    saving,
    search,
    setSearch,
    open,
    setOpen,
    editingCustomer,
    openAddDialog,
    openEditDialog,
    onSubmitCustomer,
  } = useCustomers();

  return (
    <PageLayout>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
          <Contact className="h-5 w-5 text-cyan-300" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Customers
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
            {search ? ` · ${filtered.length} matching` : ""}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CustomersSearch value={search} onChange={setSearch} />

        <ReuseableDialog
          title={editingCustomer ? "Edit Customer" : "Add New Customer"}
          open={open}
          setOpen={setOpen}
          triggerButton={
            <button
              onClick={openAddDialog}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
          }
          content={
            <CustomerForm
              customer={editingCustomer}
              onSubmitCustomer={onSubmitCustomer}
              loading={saving}
            />
          }
        />
      </div>

      <CustomerTable
        filtered={filtered}
        loading={loading}
        onEdit={openEditDialog}
      />
    </PageLayout>
  );
};

export { Customers };
