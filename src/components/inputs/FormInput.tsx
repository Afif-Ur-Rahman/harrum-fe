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
  type?:
    | "text"
    | "number"
    | "password"
    | "email"
    | "select"
    | "date"
    | "textarea";
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
  rows?: number;
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
  rows = 3,
}: FormInputProps) => {
  const { register, control } = useFormContext();
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const isNumber = type === "number";
  const isSelect = type === "select";
  const isDate = type === "date";
  const isTextarea = type === "textarea";

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

  const inputClassName =
    "block w-0 min-w-0 max-w-full flex-1 border-0 bg-transparent p-0 text-sm text-white outline-none placeholder:text-slate-300";

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={field}
            className="min-w-0 text-[12px] font-semibold uppercase tracking-widest text-slate-400"
          >
            {label}{" "}
            {required && <span className="text-[14px] text-red-400">*</span>}
          </label>
        )}

        <div
          className={`flex w-full min-w-0 max-w-full ${
            isTextarea ? "items-start" : "items-center"
          } gap-2.5 overflow-hidden rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm shadow-lg shadow-black/10 backdrop-blur-xl transition-all focus-within:border-cyan-300/60 focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-cyan-300/10`}
        >
          {Icon && (
            <Icon
              className={`h-4 w-4 shrink-0 text-slate-300 ${
                isTextarea ? "mt-1" : ""
              }`}
            />
          )}

          {isSelect ? (
            <Controller
              name={field}
              control={control}
              rules={rules}
              render={({ field: controllerField }) => (
                <Select.Root
                  value={controllerField.value ?? ""}
                  onValueChange={(value) => {
                    controllerField.onChange(value);
                    onValueChange?.(value);
                  }}
                >
                  <div className="w-0 min-w-0 max-w-full flex-1 cursor-pointer">
                    <Select.Trigger
                      placeholder={placeholder}
                      className="h-auto! w-full! min-w-0! max-w-full! border-0! bg-transparent! p-0! text-white! shadow-none! outline-none! ring-0! focus:outline-none! focus:ring-0! focus:shadow-none! focus-visible:outline-none! focus-visible:ring-0! focus-visible:shadow-none! data-[state=open]:shadow-none! data-[state=open]:outline-none!"
                    />
                  </div>

                  <Select.Content
                    position="popper"
                    className="max-w-[calc(100vw-2rem)] rounded-2xl! border! border-white/10! bg-slate-900/95! backdrop-blur-xl! shadow-2xl! shadow-black/40!"
                  >
                    {options.length > 0 ? (
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
                    id={field}
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
                    className={`${inputClassName} scheme-dark`}
                  />
                );
              }}
            />
          ) : isTextarea ? (
            <textarea
              id={field}
              {...registerRest}
              onChange={registerOnChange}
              placeholder={placeholder}
              rows={rows}
              className={`${inputClassName} resize-none`}
            />
          ) : (
            <>
              <input
                id={field}
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
                className={`${inputClassName} ${
                  isNumber
                    ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    : ""
                }`}
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShow((value) => !value)}
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
            </>
          )}
        </div>

        <FormFieldError name={field} className="text-xs text-red-400" />
      </div>
    </div>
  );
};

export { FormInput };
