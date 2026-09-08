"use client";

import { Plus, Search } from "lucide-react";
import ReuseableDialog from "@/components/ui/dialog";
import { useCustomers } from "./useCustomers";
import { CustomerHero, CustomerTable } from "./blocks";
import { AddEditCustomer } from "./form";

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
    onDeleteCustomer,
  } = useCustomers();

  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <CustomerHero total={customers.length} filtered={filtered.length} />

          <section className="rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                  Directory Controls
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Search customers
                </h2>
              </div>

              <ReuseableDialog
                title={editingCustomer ? "Edit Customer" : "Add New Customer"}
                open={open}
                setOpen={setOpen}
                triggerButton={
                  <button
                    onClick={openAddDialog}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Customer
                  </button>
                }
                content={
                  <AddEditCustomer
                    customer={editingCustomer}
                    onSubmitCustomer={onSubmitCustomer}
                    loading={saving}
                  />
                }
              />
            </div>

            <div className="mt-6">
              <div className="relative xl:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone or email"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>
            </div>
          </section>

          <CustomerTable
            filtered={filtered}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={onDeleteCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export { Customers };
