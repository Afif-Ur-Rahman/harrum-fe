"use client";

import { useMemo, useState } from "react";
import { Table } from "@/components";
import { StockVariant } from "@/types";
import { Flex } from "@radix-ui/themes";
import { Palette, Search } from "lucide-react";
import { getColorValue } from "@/utils";

interface ColorsDetailsProps {
  colors: StockVariant[];
  size?: string;
}

const getTotalQuantity = (colors: StockVariant[] = []) => {
  return colors.reduce(
    (total, color) => total + Number(color.quantity || 0),
    0,
  );
};

export const ColorsDetails: React.FC<ColorsDetailsProps> = ({
  colors = [],
  size = "",
}) => {
  const [search, setSearch] = useState("");

  const filteredColors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return colors;

    return colors.filter((color) => color.color?.toLowerCase().includes(query));
  }, [colors, search]);

  const columns = [
    {
      key: "color" as const,
      header: "Color",
      render: (row: StockVariant) => (
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-4 shrink-0 rounded-xs border border-white/40 shadow-inner"
            style={{ backgroundColor: getColorValue(row.color) }}
          />
          <span className="font-semibold capitalize text-slate-300">
            {row.color}
          </span>
        </div>
      ),
    },
    {
      key: "quantity" as const,
      header: "Quantity",
      render: (row: StockVariant) => (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-cyan-300">
          {row.quantity} {size}
        </span>
      ),
    },
  ];

  return (
    <Flex direction="column" gap="4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_36%)]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-950/20">
            <Palette className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Total Quantity
            </p>

            <p className="text-2xl font-bold text-slate-300">
              {getTotalQuantity(colors)}{" "}
              <span className="text-sm font-normal text-slate-400">{size}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search colors..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
      </div>

      <Table title="Color Variants" data={filteredColors} columns={columns} />
    </Flex>
  );
};
