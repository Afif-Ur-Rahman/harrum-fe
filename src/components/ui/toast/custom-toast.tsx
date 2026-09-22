"use client";

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import React from "react";
import toast, { Toast } from "react-hot-toast";

import { ProfileImage } from "../profile-image";

export type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
  t: Toast;
  type: ToastType;
  title?: string;
  message?: string;
  image?: string;
  onClick?: () => void;
}

const CONFIG: Record<
  ToastType,
  { icon: React.ReactNode; accent: string; iconBg: string; bar: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    accent: "border-l-red-500",
    iconBg: "bg-red-50",
    bar: "bg-red-500",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    accent: "border-l-amber-500",
    iconBg: "bg-amber-50",
    bar: "bg-amber-500",
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    accent: "border-l-blue-500",
    iconBg: "bg-blue-50",
    bar: "bg-blue-500",
  },
};

export const CustomToast: React.FC<CustomToastProps> = ({
  t,
  type,
  title,
  message,
  image,
  onClick,
}) => {
  const { icon, accent, iconBg, bar } = CONFIG[type];

  return (
    <div
      onClick={onClick}
      className={`relative flex w-85 items-start gap-3 rounded-2xl border border-l-4 border-gray-100 bg-white shadow-xl shadow-black/10 ${accent} cursor-pointer overflow-hidden px-4 py-3.5 transition-all duration-200 ${t.visible ? "animate-enter" : "animate-leave"} ${onClick ? "hover:-translate-y-0.5 hover:shadow-2xl" : ""} `}
    >
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${bar} opacity-30`}
        style={{
          width: t.visible ? "100%" : "0%",
          transition: `width ${t.duration ?? 4000}ms linear`,
          transitionDelay: "0ms",
        }}
      />

      {/* Icon or avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${image ? "" : iconBg}`}
      >
        {image ? <ProfileImage size={36} imageUrl={image} /> : icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 pt-0.5">
        {title && <p className="truncate text-sm leading-snug font-bold text-gray-900">{title}</p>}
        {message && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{message}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={e => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
