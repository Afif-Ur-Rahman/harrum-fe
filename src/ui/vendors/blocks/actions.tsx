"use client";

import { DropdownMenu } from "@radix-ui/themes";
import { MoreVertical, Pen } from "lucide-react";
import { Vendor } from "@/types";

interface ActionsProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
}

type ActionButton = {
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  onSelect: () => void;
  hoverClass: string;
};

export const Actions: React.FC<ActionsProps> = ({ vendor, onEdit }) => {
  const actionButtons: ActionButton[] = [
    {
      label: "Edit Vendor",
      icon: Pen,
      disabled: false,
      onSelect: () => onEdit(vendor),
      hoverClass:
        "data-highlighted:bg-cyan-400/20! data-highlighted:text-cyan-200!",
    },
    // Later: Record Payment, Payment History, View Orders
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          aria-label="Vendor actions"
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        className="rounded-2xl! border! border-white/10! bg-slate-900/95! backdrop-blur-xl! shadow-2xl! shadow-black/40!"
      >
        {actionButtons.map((action) => {
          const Icon = action.icon;

          return (
            <DropdownMenu.Item
              key={action.label}
              disabled={action.disabled}
              onSelect={action.onSelect}
              className={`gap-2! rounded-xl! transition-colors! ${
                action.disabled
                  ? "cursor-not-allowed! text-slate-300! opacity-50!"
                  : `cursor-pointer! text-white! ${action.hoverClass}`
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {action.label}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
