"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Tooltip = ({ content, children, className = "" }: TooltipProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span className={`inline-flex max-w-full min-w-0 cursor-help ${className}`}>
          {children}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={2}
          alignOffset={0}
          collisionPadding={12}
          arrowPadding={8}
          avoidCollisions
          className="z-9999 w-max max-w-[min(24rem,calc(100vw-2rem))] rounded-md bg-slate-950 px-3 py-2 text-left text-xs leading-5 wrap-break-word whitespace-normal text-slate-200 outline-none"
        >
          {content}

          <Popover.Arrow width={10} height={5} className="fill-slate-950" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
