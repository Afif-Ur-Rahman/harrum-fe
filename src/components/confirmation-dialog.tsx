"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Flex } from "@radix-ui/themes";
import { AlertTriangle, Trash2, CheckCircle2, X } from "lucide-react";
import { showToast } from "@/utils/toast";

interface ConfirmationDialogProps<T = { state: string; error?: string }> {
  trigger: React.ReactElement;
  onCancel?: () => void;
  onSuccess?: () => void;
  confirmAction: () => Promise<T>;
  title: string;
  saveButtonTitle: string;
  cancelButtonTitle?: string;
  description: string;
}

const ConfirmationDialog = <
  T extends { state: boolean; message?: string; error?: string },
>({
  trigger,
  onCancel,
  onSuccess,
  confirmAction,
  title,
  saveButtonTitle,
  cancelButtonTitle,
  description,
}: ConfirmationDialogProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onConfrim = async () => {
    setLoading(true);

    const result = await confirmAction();

    if (result.state === false) {
      showToast(
        "error",
        result?.error || "An error occurred. Please try again.",
      );
      setLoading(false);
      return;
    }

    if (result.state === true && result.message)
      showToast("success", result?.message || "");

    router.refresh();
    setOpen(false);
    setLoading(false);
    onSuccess?.();
  };

  const hasRemoveOrDelete = /remove|delete/i.test(title);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Flex align="start" className="group cursor-pointer">
        <Dialog.Trigger>{trigger}</Dialog.Trigger>
      </Flex>

      <Dialog.Content className="relative max-w-md! w-full! overflow-hidden! rounded-3xl! border! border-white/10! bg-slate-950! p-0! shadow-2xl! shadow-black/50!">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(17,24,39,0.98)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_36%)]" />

        <div className="relative z-10">
          <Dialog.Close
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            onClick={(e) => e.stopPropagation()}
            aria-label="Close dialog"
          >
            <X size="1.15rem" />
          </Dialog.Close>

          <div className="px-6 pb-6 pt-8">
            <Flex justify="center" className="mb-5">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg ${
                  hasRemoveOrDelete
                    ? "border-red-300/20 bg-red-400/10 shadow-red-950/20"
                    : "border-cyan-300/20 bg-cyan-400/10 shadow-cyan-950/20"
                }`}
              >
                {hasRemoveOrDelete ? (
                  <Trash2 className="h-7 w-7 text-red-300" />
                ) : (
                  <CheckCircle2 className="h-7 w-7 text-cyan-300" />
                )}
              </div>
            </Flex>

            <Dialog.Title className="mb-0! text-center! text-xl! font-bold! text-white!">
              {title}
            </Dialog.Title>

            <Dialog.Description
              size="3"
              className="mb-0! mt-2! text-center! text-sm! leading-relaxed! text-slate-400!"
            >
              {description}
            </Dialog.Description>

            {hasRemoveOrDelete && (
              <Flex
                align="center"
                gap="2"
                className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3.5"
              >
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-300" />
                <span className="text-xs leading-relaxed text-amber-100">
                  This action cannot be undone. Please confirm to proceed.
                </span>
              </Flex>
            )}

            <Flex gap="3" mt="6" className="flex-col sm:flex-row">
              <Dialog.Close className="w-full sm:w-auto sm:flex-1">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelButtonTitle ?? "Cancel"}
                </button>
              </Dialog.Close>

              <button
                type="button"
                onClick={onConfrim}
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1 ${
                  hasRemoveOrDelete
                    ? "bg-linear-to-r from-red-500 via-rose-500 to-red-600 shadow-red-950/30 hover:opacity-95"
                    : "bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 shadow-cyan-950/30 hover:opacity-95"
                }`}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing…
                  </>
                ) : (
                  saveButtonTitle
                )}
              </button>
            </Flex>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { ConfirmationDialog };
