"use client";

import { CustomToast, ToastType } from "@/components/ui/toast";
import toast from "react-hot-toast";

export const showToast = (
  type: ToastType,
  title: string,
  message?: string,
  image?: string,
  onClick?: () => void
) => {
  toast.custom((t) => (
    <CustomToast
      t={t}
      type={type}
      title={title}
      message={message}
      image={image}
      onClick={onClick}
    />
  ));
};

// Helpers
export const showSuccess = (title: string, message?: string, image?: string, onClick?: () => void) =>
  showToast("success", title, message, image, onClick);

export const showError = (title: string, message: string, image?: string, onClick?: () => void) =>
  showToast("error", title, message, image, onClick);

export const showWarning = (title: string, message: string, image?: string, onClick?: () => void) =>
  showToast("warning", title, message, image, onClick);

export const showInfo = (title: string, message: string, image?: string, onClick?: () => void) =>
  showToast("info", title, message, image, onClick);