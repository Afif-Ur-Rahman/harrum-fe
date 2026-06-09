import { Dialog } from "@radix-ui/themes";
import React from "react";
import { VscChromeClose } from "react-icons/vsc";

const ReuseableDialog = ({
  title,
  content,
  triggerButton,
  open,
  setOpen,
  contentStyle,
}: {
  title: string;
  content: React.ReactNode;
  triggerButton?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  contentStyle?: string;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {triggerButton && <Dialog.Trigger>{triggerButton}</Dialog.Trigger>}

      <Dialog.Content
        className={`relative flex h-fit max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl! border! border-white/10! bg-slate-950! p-0! shadow-2xl! shadow-black/50! ${
          contentStyle || ""
        }`}
      >
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(17,24,39,0.98)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_36%)]" />

        <div className="relative z-10 flex min-h-0 flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
            <Dialog.Title
              weight="bold"
              size="5"
              className="mb-0! text-base! font-semibold! text-white!"
            >
              {title}
            </Dialog.Title>

            <Dialog.Close
              className="flex h-9 w-9 rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={(e) => e.stopPropagation()}
              aria-label="Close dialog"
            >
              <VscChromeClose size="1.15rem" />
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 pr-4">
            {content}
          </div>

          {/* Portal target for dropdowns — inside Dialog.Content so Radix overlay doesn't intercept clicks */}
          <div id="dialog-dropdown-portal" />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReuseableDialog;
