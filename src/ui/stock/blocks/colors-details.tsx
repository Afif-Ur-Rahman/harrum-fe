import { Table } from "@/components";
import { StockVariant } from "@/types";
import { Flex } from "@radix-ui/themes";
import { Palette } from "lucide-react";

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
  const columns = [
    {
      key: "color" as const,
      header: "Color",
      render: (row: StockVariant) => (
        <span className="font-semibold text-slate-300">{row.color}</span>
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

      <Table title="Color Variants" data={colors} columns={columns} />
    </Flex>
  );
};
