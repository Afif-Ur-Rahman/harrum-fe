import React from "react";
import { Select } from "@radix-ui/themes";

interface DropdownFilterProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rootClass?: string;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}) => (
  <Select.Root value={value} onValueChange={onChange} size="2">
    <Select.Trigger
      placeholder={placeholder || "Select an option"}
      className={`min-w-32! cursor-pointer! ${className}`}
    />
    <Select.Content position="popper" className="min-w-32! cursor-pointer!">
      {options?.map((opt) => (
        <Select.Item
          key={opt?.value}
          value={opt?.value}
          className="cursor-pointer!"
        >
          {opt?.label}
        </Select.Item>
      ))}
    </Select.Content>
  </Select.Root>
);

export default DropdownFilter;
