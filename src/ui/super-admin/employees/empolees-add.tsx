import { FormProvider } from "react-hook-form";
import { useEmployeeForm } from "./form";
import { EmployeeFormType } from "./schema";
import { FormInput } from "@/components";
import { RoleSelector } from "./role-selector";
import { Mail, Lock, Loader2, Pen } from "lucide-react";

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
      <div className="px-1 py-2 flex flex-col gap-5 w-full">
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Adding…" : "Add Employee"}
        </button>
      </div>
    </FormProvider>
  );
};

export default AddEmployees;
