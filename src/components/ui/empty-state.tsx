import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  size?: "default" | "compact";
  showGlow?: boolean;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  size = "default",
  showGlow = true,
  className = "",
}) => {
  const isCompact = size === "compact";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl ${
        isCompact ? "px-6 py-12" : "px-6 py-24"
      } ${className}`}
    >
      {showGlow && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.10),transparent_36%)]" />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div
          className={`mb-4 flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-950/20 ${
            isCompact ? "h-12 w-12" : "h-14 w-14"
          }`}
        >
          <Icon
            className={
              isCompact ? "h-5 w-5 text-cyan-300" : "h-6 w-6 text-cyan-300"
            }
          />
        </div>

        <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>

        {description && (
          <p className="max-w-sm text-sm text-slate-400">{description}</p>
        )}
      </div>
    </div>
  );
};

export { EmptyState };
