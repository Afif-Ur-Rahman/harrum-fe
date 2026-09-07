import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
  labelColor?: string;
  loaderColor?: string;
}

const Loader = ({
  label = "",
  labelColor = "text-slate-300",
  loaderColor = "text-cyan-300",
}: LoaderProps) => {
  return (
    <div className="flex h-50 flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-950/20">
        <Loader2 className={`h-5 w-5 animate-spin ${loaderColor}`} />
      </div>

      <span className={`text-sm font-medium ${labelColor}`}>
        Loading {label}...
      </span>
    </div>
  );
};

export default Loader;
