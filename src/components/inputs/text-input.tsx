"use client";

import { Flex, TextField } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";

import { cn } from "@/utils";

import { BlockLabel } from "../block-label";

interface TextInputProps {
  label?: string;
  field: string;
  autoFocus?: boolean;
  className?: string;
  placeHolder?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

const TextInput = ({
  label,
  field,
  autoFocus,
  className,
  placeHolder,
  disabled = false,
  required = false,
  maxLength,
}: TextInputProps) => {
  const form = useFormContext();

  return (
    <Flex align="center" gap="2">
      {label && (
        <BlockLabel required={required} name={field}>
          {label}
        </BlockLabel>
      )}
      <TextField.Root
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn("h-8 flex-1 rounded-md! text-[13px]", className)}
        placeholder={placeHolder}
        {...form.register(field)}
        maxLength={maxLength}
      />
    </Flex>
  );
};

export { TextInput };
