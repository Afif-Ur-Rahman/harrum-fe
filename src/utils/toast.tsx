"use client";

import toast from "react-hot-toast";

import { CustomToast, ToastType } from "@/components/ui/toast";

export const showToast = (
  type: ToastType,
  title: string,
  message?: string,
  onClick?: () => void,
) => {
  toast.custom(t => (
    <CustomToast t={t} type={type} title={title} message={message} onClick={onClick} />
  ));
};

// Helpers
export const showSuccess = (title: string, message?: string, onClick?: () => void) =>
  showToast("success", title, message, onClick);

export const showError = (title: string, message: string, image?: string, onClick?: () => void) =>
  showToast("error", title, message, onClick);

export const showWarning = (title: string, message: string, image?: string, onClick?: () => void) =>
  showToast("warning", title, message, onClick);

export const showInfo = (title: string, message: string, image?: string, onClick?: () => void) =>
  showToast("info", title, message, onClick);
