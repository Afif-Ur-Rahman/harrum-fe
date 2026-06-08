"use client";
import { useFormContext } from "react-hook-form";
import { FormFieldError } from "@/components/form";
import { Calculator, PersonStanding } from "lucide-react";

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
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${!isActive ? bg : "transparent"}`}
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

export { RoleSelector };
