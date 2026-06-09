export const ROLE_STYLES: Record<string, string> = {
  Worker:
    "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Accountant: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
};

export const ROLE_PANEL_STYLES: Record<
  string,
  { accent: string; glow: string; iconClass: string }
> = {
  Worker: {
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/10",
    iconClass: "bg-emerald-500/15 text-emerald-200",
  },
  Accountant: {
    accent: "from-sky-500 via-indigo-500 to-blue-600",
    glow: "shadow-sky-500/10",
    iconClass: "bg-sky-500/15 text-sky-100",
  },
};
