"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { CloseDialogIcon } from "./dialog";
import { AlertTriangle, Trash2, CheckCircle } from "lucide-react";
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

const ConfirmationDialog = <T extends { state: boolean; message?: string; error?: string }>({
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
      showToast("error",result?.error||"An error occurred. Please try again.")
      setLoading(false);
      return;
    }

    if (result.state === true && result.message)
      showToast("success",result?.message || "")

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
      <Dialog.Content className="relative max-w-md">
        <CloseDialogIcon />

        <Flex justify="center" className="mb-4">
          <div
            className={`rounded-full p-4 ${hasRemoveOrDelete
              ? "bg-red-100"
              : "bg-blue-100"
              }`}
          >
            {hasRemoveOrDelete ? (
              <Trash2 className="w-8 h-8 text-red-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-blue-600" />
            )}
          </div>
        </Flex>

        <Dialog.Title className="font-sans text-center text-xl font-bold mb-3 -tracking-[0.25px]">
          {title}
        </Dialog.Title>

        <Dialog.Description size="3" className="text-center text-gray-600 mb-6">
          {description}
        </Dialog.Description>

        {hasRemoveOrDelete && (
          <Flex
            align="center"
            gap="2"
            className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <Text size="2" className="text-amber-800">
              This action cannot be undone. Please confirm to proceed.
            </Text>
          </Flex>
        )}

        <Flex gap="3" mt="4" justify="end" className="flex-col sm:flex-row">
          <Dialog.Close className="w-full sm:w-auto">
            <Button
              variant="outline"
              color="gray"
              highContrast
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 cursor-pointer"
              disabled={loading}
            >
              {cancelButtonTitle ?? "Cancel"}
            </Button>
          </Dialog.Close>

          <Button
            color={hasRemoveOrDelete ? "tomato" : "blue"}
            highContrast={!hasRemoveOrDelete}
            onClick={onConfrim}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-3 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? (
              <Flex align="center" gap="2">
                <span className="animate-spin">⏳</span>
                <span>Processing...</span>
              </Flex>
            ) : (
              saveButtonTitle
            )}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { ConfirmationDialog };
