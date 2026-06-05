"use client";

import React from "react";
import toast, { Toast } from "react-hot-toast";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
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
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    accent: "border-l-red-500",
    iconBg: "bg-red-50",
    bar: "bg-red-500",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    accent: "border-l-amber-500",
    iconBg: "bg-amber-50",
    bar: "bg-amber-500",
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
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
      className={`
        relative flex items-start gap-3
        w-85 bg-white rounded-2xl shadow-xl shadow-black/10
        border border-gray-100 border-l-4 ${accent}
        px-4 py-3.5 overflow-hidden
        cursor-pointer transition-all duration-200
        ${t.visible ? "animate-enter" : "animate-leave"}
        ${onClick ? "hover:shadow-2xl hover:-translate-y-0.5" : ""}
      `}
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
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${image ? "" : iconBg}`}>
        {image
          ? <ProfileImage size={36} imageUrl={image} />
          : icon
        }
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        {title && (
          <p className="text-sm font-bold text-gray-900 leading-snug truncate">
            {title}
          </p>
        )}
        {message && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
            {message}
          </p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
