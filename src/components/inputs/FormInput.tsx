"use client";

import { Select } from "@radix-ui/themes";
import { format, isValid } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";

import { FormFieldError } from "../form";

interface FormInputProps {
  field: string;
  label?: string;
  type?: "text" | "number" | "password" | "email" | "select" | "date" | "textarea";
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
  capitalizeFirst?: boolean;
  compact?: boolean;
}

const capitalizeFirstLetter = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

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
  capitalizeFirst = true,
  compact = false,
}: FormInputProps) => {
  const { register, control } = useFormContext();
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const isNumber = type === "number";
  const isSelect = type === "select";
  const isDate = type === "date";
  const isTextarea = type === "textarea";
  const isEmail = type === "email";
  const shouldCapitalize =
    capitalizeFirst && !isNumber && !isPassword && !isSelect && !isDate && !isEmail;

  const inputType = isPassword ? (show ? "text" : "password") : type;

  const numberRules: RegisterOptions = isNumber
    ? {
        ...rules,
        min: rules?.min ?? {
          value: 0,
          message: `${label} cannot be negative`,
        },
        setValueAs: value => {
          const transformedValue = rules?.setValueAs ? rules.setValueAs(value) : value;

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

  const { onChange: registerOnChange, ...registerRest } = register(field, numberRules);

  const handleCapitalizedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (shouldCapitalize) {
      const el = e.target;
      const cursorStart = el.selectionStart;
      const cursorEnd = el.selectionEnd;
      const capitalized = capitalizeFirstLetter(el.value);

      if (capitalized !== el.value) {
        el.value = capitalized;
        if (cursorStart !== null && cursorEnd !== null) {
          el.setSelectionRange(cursorStart, cursorEnd);
        }
      }
    }

    registerOnChange(e);
  };

  const inputClassName =
    "block w-0 min-w-0 max-w-full flex-1 border-0 bg-transparent p-0 text-sm text-white outline-none placeholder:text-slate-300";

  const wrapperPaddingY = compact ? "py-1.5" : "py-3";

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="flex w-full max-w-full min-w-0 flex-col gap-1.5">
        {label && (
          <label
            htmlFor={field}
            className="min-w-0 text-[12px] font-semibold tracking-widest text-slate-400 uppercase"
          >
            {label} {required && <span className="text-[14px] text-red-400">*</span>}
          </label>
        )}

        <div
          className={`flex w-full max-w-full min-w-0 ${
            isTextarea ? "items-start" : "items-center"
          } gap-2.5 overflow-hidden rounded-2xl border border-white/10 bg-white/8 px-4 ${wrapperPaddingY} text-sm shadow-lg shadow-black/10 backdrop-blur-xl transition-all focus-within:border-cyan-300/60 focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-cyan-300/10`}
        >
          {Icon && (
            <Icon className={`h-4 w-4 shrink-0 text-slate-300 ${isTextarea ? "mt-1" : ""}`} />
          )}

          {isSelect ? (
            <Controller
              name={field}
              control={control}
              rules={rules}
              render={({ field: controllerField }) => (
                <Select.Root
                  value={controllerField.value ?? ""}
                  onValueChange={value => {
                    controllerField.onChange(value);
                    onValueChange?.(value);
                  }}
                >
                  <div className="w-0 max-w-full min-w-0 flex-1 cursor-pointer">
                    <Select.Trigger
                      placeholder={placeholder}
                      className="h-auto! w-full! max-w-full! min-w-0! border-0! bg-transparent! p-0! text-white! shadow-none! ring-0! outline-none! focus:shadow-none! focus:ring-0! focus:outline-none! focus-visible:shadow-none! focus-visible:ring-0! focus-visible:outline-none! data-[state=open]:shadow-none! data-[state=open]:outline-none!"
                    />
                  </div>

                  <Select.Content
                    position="popper"
                    className="max-w-[calc(100vw-2rem)] rounded-2xl! border! border-white/10! bg-slate-900/95! shadow-2xl! shadow-black/40! backdrop-blur-xl!"
                  >
                    {options.length > 0 ? (
                      options.map(option => (
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
                      <Select.Item value="empty" disabled className="text-slate-400">
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
                let dateValue = "";

                if (controllerField.value instanceof Date && isValid(controllerField.value)) {
                  dateValue = format(controllerField.value, "yyyy-MM-dd");
                } else if (typeof controllerField.value === "string" && controllerField.value) {
                  dateValue = controllerField.value.slice(0, 10);
                }

                return (
                  <input
                    id={field}
                    type="date"
                    value={dateValue}
                    onChange={e => {
                      const raw = e.target.value;

                      controllerField.onChange(raw || "");
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
              onChange={handleCapitalizedChange}
              placeholder={placeholder}
              rows={rows}
              className={`${inputClassName} resize-none`}
            />
          ) : (
            <>
              <input
                id={field}
                {...registerRest}
                onChange={e => {
                  if (isNumber && max !== undefined && e.target.value !== "") {
                    const numericValue = Number(e.target.value);

                    if (!Number.isNaN(numericValue) && numericValue > max) {
                      e.target.value = String(max);
                    }
                  }

                  if (shouldCapitalize) {
                    handleCapitalizedChange(e);
                  } else {
                    registerOnChange(e);
                  }
                }}
                type={inputType}
                min={isNumber ? 0 : undefined}
                max={isNumber ? max : undefined}
                step={isNumber ? "any" : undefined}
                inputMode={isNumber ? "decimal" : undefined}
                placeholder={placeholder}
                onKeyDown={e => {
                  if (isNumber && ["-", "+", "e", "E"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={e => {
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
                  onClick={() => setShow(value => !value)}
                  className="shrink-0 text-slate-300 transition-colors hover:text-cyan-300"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
