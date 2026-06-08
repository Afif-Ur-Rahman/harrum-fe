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
  icon: React.ElementType;
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
          {...register(field, rules)}
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

export { FormInput };
