"use client";

import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { User, Mail, Phone, Wallet, Loader2 } from "lucide-react";
import { FormInput } from "@/components";
import { Vendor } from "@/types";
import { useVendorForm } from "./form";
import { VendorFormType } from "./schema";

export const VendorForm = ({
  vendor,
  onSubmitVendor,
  loading,
}: {
  vendor?: Vendor | null;
  onSubmitVendor: (data: VendorFormType) => Promise<void>;
  loading: boolean;
}) => {
  const isEditing = Boolean(vendor);

  const form = useVendorForm({
    name: vendor?.name || "",
    phone: vendor?.phone || "",
    email: vendor?.email || "",
    remainingAmount: "",
  });

  useEffect(() => {
    form.reset({
      name: vendor?.name || "",
      phone: vendor?.phone || "",
      email: vendor?.email || "",
      remainingAmount: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor]);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmitVendor(data);
  });

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-5">
        <FormInput
          field="name"
          label="Vendor Name"
          type="text"
          placeholder="John Doe"
          icon={User}
          required
        />

        <FormInput
          field="phone"
          label="Phone"
          type="text"
          placeholder="0300 1234567"
          icon={Phone}
          required
        />

        <FormInput
          field="email"
          label="Email"
          type="email"
          placeholder="vendor@example.com"
          icon={Mail}
        />

        {!isEditing && (
          <FormInput
            field="remainingAmount"
            label="Remaining Amount"
            type="number"
            placeholder="0"
            icon={Wallet}
          />
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving…" : isEditing ? "Update Vendor" : "Add Vendor"}
        </button>
      </div>
    </FormProvider>
  );
};
