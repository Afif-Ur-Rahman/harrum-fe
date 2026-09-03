"use client";

import React, { useState } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Select } from "@radix-ui/themes";
import { format, parse, isValid } from "date-fns";
import { FormFieldError } from "../form";

interface FormInputProps {
  field: string;
  label?: string;
  type?: "text" | "number" | "password" | "email" | "select" | "date";
  placeholder: string;
  icon?: React.ElementType;
  rules?: RegisterOptions;
  options?: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
  required?: boolean;
  onValueChange?: (value: string) => void;
  max?: number;
}

const FormInput = ({
  field,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  rules,
  options = [],
  required = false,
  onValueChange,
  max,
}: FormInputProps) => {
  const { register, control } = useFormContext();
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const isNumber = type === "number";
  const isSelect = type === "select";
  const isDate = type === "date";

  const inputType = isPassword ? (show ? "text" : "password") : type;

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

          if (numberValue < 0) return 0;
          if (max !== undefined && numberValue > max) return max;

          return transformedValue;
        },
      }
    : (rules ?? {});

  const { onChange: registerOnChange, ...registerRest } = register(
    field,
    numberRules,
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">
          {label}{" "}
          <span className="text-red-400 text-[14px]">{required && "*"}</span>
        </label>
      )}

      <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm shadow-lg shadow-black/10 backdrop-blur-xl transition-all focus-within:border-cyan-300/60 focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-cyan-300/10">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-300" />}

        {isSelect ? (
          <Controller
            name={field}
            control={control}
            rules={rules}
            render={({ field: controllerField }) => (
              <Select.Root
                value={controllerField.value}
                onValueChange={(value) => {
                  controllerField.onChange(value);
                  onValueChange?.(value);
                }}
              >
                <div className="flex min-w-0 flex-1 cursor-pointer">
                  <Select.Trigger
                    placeholder={placeholder}
                    className="text-white! h-auto! w-full! border-0! bg-transparent! p-0! shadow-none!"
                  />
                </div>

                <Select.Content
                  position="popper"
                  className="rounded-2xl! border! border-white/10! bg-slate-900/95! backdrop-blur-xl! shadow-2xl! shadow-black/40!"
                >
                  {options.length ? (
                    options.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className="cursor-pointer! rounded-xl! text-white transition-colors! data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200! data-[state=checked]:bg-cyan-400/25!"
                      >
                        {option.label}
                      </Select.Item>
                    ))
                  ) : (
                    <Select.Item
                      value="empty"
                      disabled
                      className="text-slate-400"
                    >
                      No data
                    </Select.Item>
                  )}
                </Select.Content>
              </Select.Root>
            )}
          />
        ) : isDate ? (
          <Controller
            name={field}
            control={control}
            rules={rules}
            render={({ field: controllerField }) => {
              const dateValue =
                controllerField.value instanceof Date &&
                isValid(controllerField.value)
                  ? format(controllerField.value, "yyyy-MM-dd")
                  : "";

              return (
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (!raw) {
                      controllerField.onChange(undefined);
                      return;
                    }
                    const parsed = parse(raw, "yyyy-MM-dd", new Date());
                    controllerField.onChange(
                      isValid(parsed) ? parsed : undefined,
                    );
                  }}
                  onBlur={controllerField.onBlur}
                  placeholder={placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-300 scheme-dark"
                />
              );
            }}
          />
        ) : (
          <>
            <input
              {...registerRest}
              onChange={(e) => {
                if (isNumber && max !== undefined && e.target.value !== "") {
                  const numericValue = Number(e.target.value);
                  if (!Number.isNaN(numericValue) && numericValue > max) {
                    e.target.value = String(max);
                  }
                }
                registerOnChange(e);
              }}
              type={inputType}
              min={isNumber ? 0 : undefined}
              max={isNumber ? max : undefined}
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
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </>
        )}
      </div>

      <FormFieldError name={field} className="text-xs text-red-400" />
    </div>
  );
};

export { FormInput };
