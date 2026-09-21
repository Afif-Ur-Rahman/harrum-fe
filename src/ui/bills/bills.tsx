"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { EmptyState, ReuseableDialog } from "@/components";
import { PageLayout } from "@/components/layout";
import { Loader } from "@/components/ui/loader";
import { BillCard, BillsSummary } from "./blocks";
import { BillForm } from "./form";
import { useBills } from "./useBills";

export const VendorBills = ({ vendorId }: { vendorId: string }) => {
  const {
    vendor,
    bills,
    summary,
    loading,
    saving,
    open,
    setOpen,
    onSubmitBill,
  } = useBills(vendorId);

  return (
    <PageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/super-admin/vendors"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 shadow-lg shadow-black/10 transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
            aria-label="Back to vendors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Bills
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                {vendor?.name ?? "Vendor"} · {bills.length} bill
                {bills.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <ReuseableDialog
          title="Add Bill"
          open={open}
          setOpen={setOpen}
          triggerButton={
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add Bill
            </button>
          }
          content={<BillForm onSubmitBill={onSubmitBill} loading={saving} />}
        />
      </div>

      {!loading && <BillsSummary summary={summary} />}

      {loading ? (
        <Loader label="bills" />
      ) : bills.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No bills yet"
          description="No bills have been added for this vendor."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bills.map((bill) => (
            <BillCard key={bill._id} bill={bill} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};
