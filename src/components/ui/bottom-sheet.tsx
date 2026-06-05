"use client";

import { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Rendered outside the scroll area — use for sticky action buttons */
  footer?: React.ReactNode;
  height?: string;
  /** When true the content div does not scroll — the child manages its own layout/scroll */
  childManagesScroll?: boolean;
  /** When true the header bar is hidden — useful when the child renders its own title area */
  hideHeader?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  height = "h-[82vh]",
  childManagesScroll = false,
  hideHeader = false,
}: BottomSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center transition-transform duration-300 ease-in-out"
        style={{ transform: open ? "translateY(0)" : "translateY(100%)" }}
      >
        <div className={`w-full max-w-lg bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden ${height}`}>

          {/* Header */}
          {!hideHeader && (
            <div className="relative flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200" />
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-500 text-base leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {/* Content */}
          <div className={`flex-1 ${childManagesScroll ? "overflow-hidden" : "overflow-y-auto"}`}>
            {children}
          </div>

          {/* Sticky footer */}
          {footer && (
            <div className="shrink-0 border-t border-gray-100 bg-white">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
