"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, Text, Flex, Badge, Checkbox, Button } from "@radix-ui/themes";
import { X } from "lucide-react";
import { FormFieldError } from "../form";

interface MultiSelectDropdownProps {
  label?: string;
  field: string;
  options?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  shouldAdd?: boolean;
  showSelected?: boolean;
  multiselect?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  field,
  options = [],
  placeholder = "Search...",
  className,
  disabled = false,
  shouldAdd = false,
  showSelected = false,
  multiselect = true,
}) => {
  const { watch, setValue } = useFormContext();
  const rawValue = watch(field);
  const selectedValues: string[] = multiselect
    ? (rawValue as string[]) || []
    : rawValue
      ? [rawValue as string]
      : [];

  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [addedOptions, setAddedOptions] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const allOptions = useMemo(() => {
    return Array.from(new Set([...options, ...addedOptions]));
  }, [options, addedOptions]);

  const filteredOptions = allOptions.filter(opt =>
    opt.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleValue = (value: string) => {
    if (multiselect) {
      if (selectedValues.includes(value)) {
        setValue(field, selectedValues.filter(v => v !== value), { shouldValidate: true });
      } else {
        setValue(field, [...selectedValues, value], { shouldValidate: true });
      }
      setSearchText("");
      return;
    }

    setValue(field, value, { shouldValidate: true });
    setSearchText(value);
    setOpen(false);
  };

  const handleAdd = () => {
    const trimmed = searchText.trim();
    if (!trimmed || allOptions.includes(trimmed)) return;
    setAddedOptions(prev => [...prev, trimmed]);
    toggleValue(trimmed);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className || ""}`}>
      {label && <Text className="text-sm font-medium">{label}</Text>}

      <Flex ref={containerRef} direction="column" gap="2" className="mt-1">
        {showSelected && selectedValues.length > 0 && (
          <Flex wrap="wrap" gap="2">
            {selectedValues.map(value => (
              <Badge key={value} variant="soft">
                <Flex align="center" gap="1">
                  {value}
                  {!disabled && (
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() =>
                        setValue(field, multiselect ? selectedValues.filter(v => v !== value) : "", { shouldValidate: true })
                      }
                    />
                  )}
                </Flex>
              </Badge>
            ))}
          </Flex>
        )}

        <TextField.Root
          type="search"
          size="3"
          disabled={disabled}
          value={searchText}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearchText(e.target.value);
            setOpen(true);
          }}
        />

        {!disabled && <FormFieldError name={field} className="text-red-500" />}

        {open && (
          <ul className="absolute top-full mt-1 w-full bg-white/70 backdrop-blur-[5px] border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto z-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const checked = selectedValues.includes(option);
                return (
                  <li
                    key={option}
                    onClick={() => toggleValue(option)}
                    className="px-3 py-2 cursor-pointer text-sm hover:bg-white/20"
                  >
                    <Flex align="center" gap="2">
                      {multiselect && <Checkbox checked={checked} />}
                      <span>{option}</span>
                    </Flex>
                  </li>
                );
              })
            ) : shouldAdd && searchText.trim() ? (
              <li className="px-3 py-2 text-sm">
                <Button size="2" variant="soft" onClick={handleAdd} className="w-full">
                  {`Add "${searchText}"`}
                </Button>
              </li>
            ) : (
              <li className="px-3 py-2 text-sm text-gray-400">No options found</li>
            )}
          </ul>
        )}
      </Flex>
    </div>
  );
};

export { MultiSelectDropdown };
