"use client";

import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { EmptyState } from "@/components";
import { Loader } from "@/components/ui/loader";
import { StockTable } from "@/ui/stock";
import { useVendorStocks } from "./useVendorStocks";
import { PageLayout } from "@/components/layout";

export const VendorStocks = ({ vendorId }: { vendorId: string }) => {
  const { vendorStocks, loading } = useVendorStocks(vendorId);

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/super-admin/vendors"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
          aria-label="Back to vendors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Vendor Stocks
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            View all stock items purchased from this vendor
          </p>
        </div>
      </div>

      {loading ? (
        <Loader label="tock items" />
      ) : vendorStocks.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No stock items yet"
          description="No stock has been purchased from this vendor."
          showGlow={false}
          className="border-none! bg-transparent! shadow-none! backdrop-blur-none!"
        />
      ) : (
        <StockTable stockData={vendorStocks} />
      )}
    </PageLayout>
  );
};
