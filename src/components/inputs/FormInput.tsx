"use client";

import React, { useState } from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { FormFieldError } from "../form";

interface FormInputProps {
  field: string;
  label: string;
  type?: string;
  placeholder: string;
  icon?: React.ElementType;
  rules?: RegisterOptions;
}

const FormInput = ({
  field,
  label,
  type,
  placeholder,
  icon: Icon,
  rules,
}: FormInputProps) => {
  const { register } = useFormContext();
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const isNumber = type === "number";

  const inputType = isPassword
    ? show
      ? "text"
      : "password"
    : (type ?? "text");

  const numberRules: RegisterOptions = isNumber
    ? {
        ...rules,
        min: rules?.min ?? {
          value: 0,
          message: `${label} cannot be negative`,
        },
        setValueAs: (value) => {
          const transformedValue = rules?.setValueAs
            ? rules.setValueAs(value)
            : value;

          if (
            transformedValue === "" ||
            transformedValue === null ||
            transformedValue === undefined
          ) {
            return "";
          }

          const numberValue = Number(transformedValue);

          if (Number.isNaN(numberValue)) {
            return "";
          }

          return numberValue < 0 ? 0 : transformedValue;
        },
      }
    : (rules ?? {});

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </label>

      <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm shadow-lg shadow-black/10 backdrop-blur-xl transition-all focus-within:border-cyan-300/60 focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-cyan-300/10">
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-slate-300 transition-colors" />
        )}

        <input
          {...register(field, numberRules)}
          type={inputType}
          min={isNumber ? 0 : undefined}
          step={isNumber ? "any" : undefined}
          inputMode={isNumber ? "decimal" : undefined}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (isNumber && ["-", "+", "e", "E"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            if (!isNumber) return;

            const pastedValue = e.clipboardData.getData("text");
            const numericValue = Number(pastedValue);

            if (pastedValue.includes("-") || numericValue < 0) {
              e.preventDefault();
            }
          }}
          className={`min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-300 ${
            isNumber
              ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="shrink-0 text-slate-300 transition-colors hover:text-cyan-300"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <FormFieldError name={field} className="text-xs text-red-400" />
    </div>
  );
};

export { FormInput };
