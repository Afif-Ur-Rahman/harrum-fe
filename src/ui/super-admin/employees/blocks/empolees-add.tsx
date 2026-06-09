import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components";
import { Mail, Lock, Loader2, Pen } from "lucide-react";
import { EmployeeFormType } from "../schema";
import { useEmployeeForm } from "../form";
import { RoleSelector } from "./role-selector";

const AddEmployees = ({
  onAddEmployee,
  loading,
}: {
  onAddEmployee: (data: EmployeeFormType) => Promise<void>;
  loading: boolean;
}) => {
  const form = useEmployeeForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    await onAddEmployee(data);
  });

  return (
    <FormProvider {...form}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_35%)]" />

        <div className="relative z-10 flex w-full flex-col gap-5">
          <FormInput
            field="username"
            label="Username"
            type="text"
            placeholder="username"
            icon={Pen}
          />

          <FormInput
            field="email"
            label="Email"
            type="email"
            placeholder="employee@example.com"
            icon={Mail}
          />

          <FormInput
            field="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            icon={Lock}
          />

          <RoleSelector />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Adding…" : "Add Employee"}
          </button>
        </div>
      </div>
    </FormProvider>
  );
};

export { AddEmployees };
