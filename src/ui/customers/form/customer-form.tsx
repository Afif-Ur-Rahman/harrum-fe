"use client";

import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { User, Mail, Phone, Wallet, Loader2 } from "lucide-react";
import { FormInput } from "@/components";
import { CustomerFormType, useCustomerForm } from "../form";
import { Customer } from "@/types";

export const CustomerForm = ({
  customer,
  onSubmitCustomer,
  loading,
}: {
  customer?: Customer | null;
  onSubmitCustomer: (data: CustomerFormType) => Promise<void>;
  loading: boolean;
}) => {
  const isEditing = Boolean(customer);

  const form = useCustomerForm({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    remainingAmount: "",
  });

  useEffect(() => {
    form.reset({
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      remainingAmount: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmitCustomer(data);
  });

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col gap-5">
        <FormInput
          field="name"
          label="Customer Name"
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
          placeholder="customer@example.com"
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
          {loading ? "Saving…" : isEditing ? "Update Customer" : "Add Customer"}
        </button>
      </div>
    </FormProvider>
  );
};
