"use client";

import { Search } from "lucide-react";

interface CustomersSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomersSearch: React.FC<CustomersSearchProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search by name, phone or email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
    </div>
  );
};
