import { FormProvider, useFormContext } from "react-hook-form";
import { useEmployeeForm } from "./form";
import { EmployeeFormType } from "./schema";
import { FormFieldError } from "@/components/form";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calculator,
  Loader2,
  PersonStanding,
  Pen,
} from "lucide-react";

const ROLES = [
  {
    value: "worker",
    label: "Worker",
    icon: PersonStanding,
    description: "Handles orders and serves customers",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-400",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-400",
  },
  {
    value: "accountant",
    label: "Accountant",
    icon: Calculator,
    description: "Manages billing",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-400",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-400",
  },
] as const;

const FieldInput = ({
  field,
  label,
  type,
  placeholder,
  icon: Icon,
}: {
  field: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
}) => {
  const { register } = useFormContext();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword
    ? show
      ? "text"
      : "password"
    : (type ?? "text");

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/8 shadow-xs transition-all">
        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          {...register(field)}
          type={inputType}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder-gray-300 text-sm text-gray-900 min-w-0"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <FormFieldError name={field} className="text-red-500 text-xs" />
    </div>
  );
};

const RoleSelector = () => {
  const { watch, setValue } = useFormContext();
  const selected = watch("type");

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        Role
      </label>
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map(
          ({
            value,
            label,
            icon: Icon,
            description,
            color,
            bg,
            activeBorder,
          }) => {
            const isActive = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setValue("type", value, { shouldValidate: true })
                }
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 text-center transition-all ${
                  isActive
                    ? `${activeBorder} ${bg}`
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? bg : "bg-white"}`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 ${isActive ? color : "text-gray-400"}`}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold ${isActive ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                    {description}
                  </p>
                </div>
              </button>
            );
          },
        )}
      </div>
      <FormFieldError name="type" className="text-red-500 text-xs" />
    </div>
  );
};

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
        <FieldInput
          field="username"
          label="Username"
          type="text"
          placeholder="username"
          icon={Pen}
        />
        <FieldInput
          field="email"
          label="Email"
          type="email"
          placeholder="employee@example.com"
          icon={Mail}
        />
        <FieldInput
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
