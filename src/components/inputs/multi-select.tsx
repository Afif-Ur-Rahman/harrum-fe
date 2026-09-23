"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

const DIALOG_PORTAL_ID = "dialog-dropdown-portal";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const MultiSelect = ({ label, placeholder, options, value, onChange }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setPortalContainer(document.getElementById(DIALOG_PORTAL_ID));
    }
    setOpen(next);
  };

  const getLabel = (optionValue: string) =>
    options.find(option => option.value === optionValue)?.label ?? optionValue;

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter(item => item !== optionValue)
        : [...value, optionValue],
    );
  };

  const remove = (optionValue: string) => {
    onChange(value.filter(item => item !== optionValue));
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <label className="text-[12px] font-semibold tracking-widest text-slate-400 uppercase">
          {label}
        </label>

        {value.map(item => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-400/10 py-0.5 pr-1 pl-2 text-[11px] font-medium text-cyan-200"
          >
            {getLabel(item)}

            <button
              type="button"
              onClick={() => remove(item)}
              aria-label={`Remove ${getLabel(item)}`}
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-cyan-200 transition hover:bg-cyan-300/20 hover:text-white"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>

      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="group flex w-full items-center justify-between gap-2.5 rounded-2xl border border-white/10 bg-white/8 px-4 py-1.5 text-left text-sm shadow-lg shadow-black/10 backdrop-blur-xl transition-all hover:bg-white/10 data-[state=open]:border-cyan-300/60 data-[state=open]:bg-white/12 data-[state=open]:ring-2 data-[state=open]:ring-cyan-300/10"
          >
            <span className={value.length > 0 ? "text-white" : "text-slate-300"}>
              {value.length > 0 ? `${value.length} selected` : placeholder}
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </Popover.Trigger>

        <Popover.Portal container={portalContainer}>
          <Popover.Content
            align="start"
            sideOffset={6}
            collisionPadding={12}
            className="z-50 max-h-48 w-(--radix-popover-trigger-width) overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 py-1 shadow-2xl shadow-black/40 outline-none"
          >
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">No options available</p>
            ) : (
              options.map(option => {
                const isSelected = value.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(option.value)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition hover:bg-cyan-400/10 ${
                      isSelected ? "text-cyan-200" : "text-slate-200"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>

                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-cyan-300" />}
                  </button>
                );
              })
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
