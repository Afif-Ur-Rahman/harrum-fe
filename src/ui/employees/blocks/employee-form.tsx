"use client";

import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components";
import { Loader2 } from "lucide-react";

import { EmployeeFormType } from "../schema";
import { useEmployeeForm } from "../form";
import { RoleSelector } from "./role-selector";
import { EMPLOYEE_FORM_INPUTS } from "../constants";
import { Employee } from "@/types";

type EmployeeFormProps = {
  employee?: Employee | null;
  onSubmit: (data: EmployeeFormType) => Promise<void>;
  loading: boolean;
};

export const EmployeeForm = ({
  employee,
  onSubmit,
  loading,
}: EmployeeFormProps) => {
  const isEdit = Boolean(employee);
  const initialValues: Partial<EmployeeFormType> = {
    username: employee?.username ?? "",
    email: employee?.email ?? "",
    password: "",
    phone: employee?.phone ?? "",
    guardianName: employee?.guardianName ?? "",
    guardianPhone: employee?.guardianPhone ?? "",
    permanentAddress: employee?.permanentAddress ?? "",
    currentAddress: employee?.currentAddress ?? "",
    type: employee?.type ?? "worker",
  };
  const form = useEmployeeForm(initialValues, isEdit);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit({
      ...data,
      ...(isEdit && !data.password ? { password: undefined } : {}),
    });
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6"
      >
        <div className="relative z-10 flex w-full flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {EMPLOYEE_FORM_INPUTS.map((input) => {
              const Icon = input.icon;

              return (
                <FormInput
                  key={input.field}
                  field={input.field}
                  label={input.label}
                  type={input.type}
                  placeholder={input.placeholder}
                  icon={Icon}
                />
              );
            })}
          </div>

          <RoleSelector />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? isEdit
                ? "Updating…"
                : "Adding…"
              : isEdit
                ? "Update Employee"
                : "Add Employee"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
