"use client";

import { Phone, PlusCircle, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormFieldError } from "@/components/form";
import { Customer } from "@/types";

import { OrderFormType } from "../form";

interface PhoneSearchProps {
  customers: Customer[];
  placeholder?: string;
}

export const PhoneSearch = ({ customers, placeholder = "Phone" }: PhoneSearchProps) => {
  const { control, setValue, watch } = useFormContext<OrderFormType>();

  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedRef = useRef<Customer | null>(null);

  const phone = (watch("phone") ?? "").trim();
  const query = phone.toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return customers;

    return customers.filter(
      customer =>
        customer.phone?.toLowerCase().includes(query) ||
        customer.name?.toLowerCase().includes(query),
    );
  }, [customers, query]);

  const exactMatch = customers.find(customer => customer.phone?.trim() === phone);
  const canUseTyped = phone.length > 0 && !exactMatch;

  const handleOpen = () => {
    clearTimeout(blurTimer.current);
    setOpen(true);
  };

  const selectCustomer = (customer: Customer) => {
    selectedRef.current = customer;

    setValue("phone", customer.phone, { shouldValidate: true, shouldDirty: true });
    setValue("customerName", customer.name, { shouldValidate: true, shouldDirty: true });
    setValue("email", customer.email ?? "", { shouldValidate: true, shouldDirty: true });

    setOpen(false);
  };

  const handleChange = (value: string, onChange: (value: string) => void) => {
    // Phone no longer matches the selected customer — drop their details
    if (selectedRef.current && value.trim() !== selectedRef.current.phone?.trim()) {
      selectedRef.current = null;
      setValue("customerName", "", { shouldDirty: true });
      setValue("email", "", { shouldDirty: true });
    }

    onChange(value);
    setOpen(true);
  };

  const handleClear = () => {
    selectedRef.current = null;
    setValue("phone", "", { shouldDirty: true });
    setValue("customerName", "", { shouldDirty: true });
    setValue("email", "", { shouldDirty: true });
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-full min-w-0">
      <div className="flex w-full max-w-full min-w-0 flex-col gap-1.5">
        <div
          className={`flex w-full max-w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-lg border bg-white/8 px-4 py-1.5 text-sm shadow-lg shadow-black/10 backdrop-blur-xl transition-all ${
            open ? "border-cyan-300/60 bg-white/12 ring-2 ring-cyan-300/10" : "border-white/10"
          }`}
        >
          <Phone className="h-4 w-4 shrink-0 text-slate-300" />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                id="phone"
                ref={field.ref}
                value={field.value ?? ""}
                onChange={e => handleChange(e.target.value, field.onChange)}
                onFocus={handleOpen}
                onBlur={() => {
                  field.onBlur();
                  blurTimer.current = setTimeout(() => setOpen(false), 150);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    if (exactMatch) selectCustomer(exactMatch);
                    else setOpen(false);
                  }
                }}
                type="text"
                inputMode="tel"
                autoComplete="off"
                placeholder={placeholder}
                className="block w-0 max-w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-white outline-none placeholder:text-slate-300"
              />
            )}
          />

          {phone && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 rounded-lg p-0.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Clear phone"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <FormFieldError name="phone" className="text-xs text-red-400" />
      </div>

      {open && (canUseTyped || filtered.length > 0) && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)]" />

          <div className="relative z-10 max-h-60 overflow-y-auto">
            {filtered.length > 0 && (
              <div className="py-1">
                {filtered.map(customer => (
                  <button
                    key={customer._id}
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      selectCustomer(customer);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-1.5 text-left transition hover:bg-white/8"
                  >
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="block truncate text-sm text-white">{customer.phone}</span>
                      <span className="block truncate text-xs text-slate-400">{customer.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {canUseTyped && (
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-cyan-300 transition hover:bg-cyan-400/10 ${
                  filtered.length > 0 ? "border-t border-white/10" : ""
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
                  <PlusCircle className="h-4 w-4 text-cyan-300" />
                </div>

                <span>
                  <span className="block font-semibold text-white">Use “{phone}”</span>
                  <span className="block text-xs text-slate-400">
                    New customer — enter name and email below
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
