"use client";

import { Plus, Store } from "lucide-react";

import { DueAmountPill, ReuseableDialog } from "@/components";
import { PageLayout } from "@/components/layout";

import { VendorTable, VendorsSearch } from "./blocks";
import { VendorForm } from "./form";
import { useVendors } from "./useVendors";

const Vendors = () => {
  const {
    filtered,
    vendors,
    loading,
    saving,
    search,
    setSearch,
    open,
    setOpen,
    editingVendor,
    openAddDialog,
    openEditDialog,
    onSubmitVendor,
    updateVendorInList,
    dueAmount,
  } = useVendors();

  return (
    <PageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
            <Store className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Vendors</h1>

            <p className="mt-1 text-xs text-slate-400">
              {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
              {search ? ` · ${filtered.length} matching` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <DueAmountPill amount={dueAmount} loading={loading} />
          </div>

          <ReuseableDialog
            title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
            open={open}
            setOpen={setOpen}
            triggerButton={
              <button
                onClick={openAddDialog}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98] sm:px-4"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Vendor</span>
              </button>
            }
            content={
              <VendorForm vendor={editingVendor} onSubmitVendor={onSubmitVendor} loading={saving} />
            }
          />
        </div>

        <div className="w-full sm:hidden">
          <DueAmountPill amount={dueAmount} loading={loading} className="w-full" />
        </div>
      </div>

      <div className="mb-6">
        <VendorsSearch value={search} onChange={setSearch} />
      </div>

      <VendorTable
        filtered={filtered}
        loading={loading}
        onEdit={openEditDialog}
        onVendorUpdated={updateVendorInList}
      />
    </PageLayout>
  );
};

export { Vendors };
