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
    color: "text-emerald-300",
    iconBg: "bg-emerald-400/10",
    activeBorder: "border-emerald-300/50",
    activeBg: "bg-emerald-400/10",
    activeShadow: "shadow-emerald-950/30",
  },
  {
    value: "accountant",
    label: "Accountant",
    icon: Calculator,
    description: "Manages billing",
    color: "text-cyan-300",
    iconBg: "bg-cyan-400/10",
    activeBorder: "border-cyan-300/50",
    activeBg: "bg-cyan-400/10",
    activeShadow: "shadow-cyan-950/30",
  },
] as const;

const RoleSelector = () => {
  const { watch, setValue } = useFormContext();
  const selected = watch("type");

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
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
            iconBg,
            activeBorder,
            activeBg,
            activeShadow,
          }) => {
            const isActive = selected === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setValue("type", value, { shouldValidate: true })
                }
                className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center shadow-lg transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? `${activeBorder} ${activeBg} ${activeShadow} text-white ring-1 ring-inset ring-white/10`
                    : "border-white/10 bg-white/5 text-slate-300 shadow-black/10 hover:border-white/20 hover:bg-white/8 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 ${
                    isActive ? iconBg : "bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive ? color : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                </div>

                <div>
                  <p
                    className={`text-xs font-semibold ${
                      isActive ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {label}
                  </p>

                  <p className="mt-0.5 text-[10px] leading-tight text-slate-500 group-hover:text-slate-400">
                    {description}
                  </p>
                </div>
              </button>
            );
          },
        )}
      </div>

      <FormFieldError name="type" className="text-xs text-red-400" />
    </div>
  );
};

export { RoleSelector };
