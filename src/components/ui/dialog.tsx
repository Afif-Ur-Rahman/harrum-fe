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
  contentStyle?: string
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {triggerButton && <Dialog.Trigger>{triggerButton}</Dialog.Trigger>}

      <Dialog.Content className={`relative w-full max-w-lg h-fit max-h-[80vh] flex flex-col lg:p-6! md:p-5! p-4! ${contentStyle || ""}`}>
        <Dialog.Close
          className="absolute top-4 right-5 z-50 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <VscChromeClose size="1.2rem" />
        </Dialog.Close>

        <Dialog.Title
          weight="bold"
          size="5"
          align="center"
          className="shrink-0"
        >
          {title}
        </Dialog.Title>

        <div className="mt-4 flex-1 overflow-y-auto overscroll-contain pr-1">
          {content}
        </div>
        {/* Portal target for dropdowns — inside Dialog.Content so Radix overlay doesn't intercept clicks */}
        <div id="dialog-dropdown-portal" />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReuseableDialog;
