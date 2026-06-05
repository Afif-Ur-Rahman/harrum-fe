"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { FormFieldError } from "@/components/form";

interface AuthFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export function AuthField({ label, name, type = "text", placeholder, icon, disabled }: AuthFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all
        ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : "bg-gray-50 focus-within:bg-white focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"}
        ${errors[name] ? "border-red-400" : "border-gray-200"}`}>
        <span className="text-gray-400 shrink-0">{icon}</span>
        <input
          {...register(name)}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <FormFieldError name={name} className="text-red-500 text-xs" />
    </div>
  );
}
