"use client";
import React, { useState } from "react";
import { TextField, Text, Flex } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { checkUsernameAvailability } from "@/api/api-call/public";
import { BsPatchCheck, BsPatchExclamation } from "react-icons/bs";
import { FormFieldError } from "../form";

interface FormInputProps {
  label?: string;
  type?: "text" | "password" | "number" | "date" | "textarea" | "search";
  field: string;
  value?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  eye?: boolean;
  minDateField?: string;
  maxDateField?: string;
  noPastDate?: boolean;
  rows?: number;
  maxValue?: number;
}

const FormInput = ({
  label,
  type = "text",
  field,
  value,
  required = true,
  autoFocus,
  placeHolder,
  disabled,
  className,
  maxLength,
  eye = false,
  minDateField,
  maxDateField,
  noPastDate = false,
  rows = 4,
  maxValue,
}: FormInputProps) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState("");
  const form = useFormContext();

  const isPasswordType = type === "password" && eye;
  const toggleVisibility = () => setHidePassword(!hidePassword);

  const minDate = minDateField ? form.watch(minDateField) : undefined;
  const maxDate = maxDateField ? form.watch(maxDateField) : undefined;
  const today = new Date().toISOString().split("T")[0];
  const isNumber = type === "number";

  const commonProps = {
    required,
    autoFocus,
    placeholder: placeHolder,
    disabled,
    maxLength,
    className: `w-full border-[#D0DAEE] border-[0.5px] rounded-lg text-sm ${
      className || ""
    }`,
    ...(type === "number"
      ? form.register(field, { valueAsNumber: true })
      : form?.register(field)),
  };

  const handleUsernameBlur = async () => {
    if (field !== "username") return;
    const value = form.getValues(field);
    if (!value) return;
    const available = await checkUsernameAvailability(value);
    setIsUsernameValid(available ? "valid" : "invalid");
    if (!available) {
      form.setError(field, {
        type: "manual",
        message: "Username is already taken",
      });
    } else {
      form.clearErrors(field);
    }
  };

  const registerProps = isNumber
    ? form.register(field, { valueAsNumber: true })
    : form.register(field);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber && maxValue !== undefined) {
      const inputValue = parseFloat(e.target.value);
      if (!isNaN(inputValue) && inputValue > maxValue) {
        form.setValue(field, maxValue);
        e.target.value = maxValue.toString();
        return;
      }
      form.setValue(field, inputValue);
    }
  };

  const numberInputProps =
    isNumber && maxValue !== undefined ? { onChange: handleNumberChange } : {};

  return (
    <div className="flex flex-col gap-2 flex-1">
      {label && (
        <Text htmlFor={field} className="block text-sm font-medium mb-1">
          {label}
        </Text>
      )}
      <Flex
        direction="column"
        justify="center"
        align="center"
        className="relative w-full"
      >
        {type === "textarea" ? (
          <textarea
            {...commonProps}
            rows={rows}
            value={form.watch(field) ?? value ?? ""}
          />
        ) : (
          <TextField.Root
            type={isPasswordType ? (hidePassword ? "password" : "text") : type}
            {...registerProps}
            {...numberInputProps}
            defaultValue={value ?? ""}
            size="3"
            placeholder={placeHolder}
            disabled={disabled}
            min={
              isNumber
                ? 0
                : type === "date"
                  ? minDate || (noPastDate ? today : undefined)
                  : undefined
            }
            max={type === "date" ? maxDate : undefined}
            inputMode={isNumber ? "numeric" : undefined}
            pattern={isNumber ? "\\d*" : undefined}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (!isNumber) return;
              if (
                e.key === "-" ||
                e.key === "e" ||
                e.key === "E" ||
                e.key === "+"
              ) {
                e.preventDefault();
              }
            }}
            onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
              if (isNumber) {
                (e.currentTarget as HTMLInputElement).blur();
              }
            }}
            onBlur={field === "username" ? handleUsernameBlur : undefined}
            className={`w-full border-[#D0DAEE] border-[0.5px]! outline-none rounded-lg text-sm ${className}`}
          />
        )}
        {isUsernameValid && form.watch(field) && !disabled && (
          <Text
            align="left"
            className={`absolute right-3 text-sm  ${isUsernameValid === "valid" ? "text-green-500" : "text-red-500"}`}
          >
            {isUsernameValid === "valid" ? (
              <BsPatchCheck size="1rem" />
            ) : (
              <BsPatchExclamation size="1rem" />
            )}
          </Text>
        )}
        {isPasswordType && (
          <Flex
            className="absolute right-3 cursor-pointer text-gray-500"
            onClick={toggleVisibility}
          >
            {!hidePassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </Flex>
        )}
      </Flex>
      <FormFieldError name={field} className="text-red-500" />
    </div>
  );
};

export { FormInput };
