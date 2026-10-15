"use client";

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import React from "react";
import toast, { Toast } from "react-hot-toast";

export type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
  t: Toast;
  type: ToastType;
  title?: string;
  message?: string;
  onClick?: () => void;
}

const CONFIG: Record<ToastType, { icon: React.ReactNode; accent: string; iconBg: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
    accent: "border-l-emerald-400",
    iconBg: "border-emerald-300/20 bg-emerald-400/10",
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-rose-300" />,
    accent: "border-l-rose-400",
    iconBg: "border-rose-300/20 bg-rose-400/10",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-300" />,
    accent: "border-l-amber-400",
    iconBg: "border-amber-300/20 bg-amber-400/10",
  },
  info: {
    icon: <Info className="h-5 w-5 text-cyan-300" />,
    accent: "border-l-cyan-400",
    iconBg: "border-cyan-300/20 bg-cyan-400/10",
  },
};

export const CustomToast: React.FC<CustomToastProps> = ({ t, type, title, message, onClick }) => {
  const { icon, accent, iconBg } = CONFIG[type];

  return (
    <div
      onClick={onClick}
      className={`relative flex w-85 max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border border-l-4 border-white/10 bg-slate-950/90 px-4 py-3.5 shadow-2xl shadow-black/40 backdrop-blur-xl ${accent} ${
        t.visible ? "toast-enter" : "toast-leave"
      } ${onClick ? "cursor-pointer transition hover:-translate-y-0.5 hover:bg-slate-900" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_40%)]" />

      {/* Icon or avatar */}
      <div
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconBg} `}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="relative min-w-0 flex-1 pt-0.5">
        {title && <p className="truncate text-sm leading-snug font-bold text-white">{title}</p>}
        {message && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{message}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        type="button"
        aria-label="Dismiss notification"
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="relative mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
