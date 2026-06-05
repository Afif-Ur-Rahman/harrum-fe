import { usePersistStore } from "@/store/presistStore";
import { formatPrice } from "@/utils";
import { useRouter } from "next/navigation";
import { DollarSign, Clock, ShoppingBag } from "lucide-react";

type Stat = { label: string; value: string };

const STAT_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    border: string;
    accent: string;
  }
> = {
  "Total Revenue": {
    icon: DollarSign,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-l-emerald-500",
    accent: "text-emerald-600",
  },
  "Pending Revenue": {
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-l-amber-500",
    accent: "text-amber-600",
  },
  "Total Orders": {
    icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-l-blue-500",
    accent: "text-blue-600",
  },
};

export const Stats = ({ stats }: { stats: Stat[] }) => {
  const { push } = useRouter();
  const { user } = usePersistStore();
  const isRevenue = (label: string) => label !== "Total Orders";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((s) => {
        const cfg = STAT_CONFIG[s.label] ?? STAT_CONFIG["Total Orders"];
        const Icon = cfg.icon;
        const displayValue = isRevenue(s.label)
          ? `${user?.currency || ""} ${formatPrice(Number(s.value) || 0)}`
          : s.value;

        return (
          <div
            key={s.label}
            onClick={() =>
              push(
                `/${user?.type === "restaurant" ? "restaurant" : "accountant"}/orders`,
              )
            }
            className={`bg-white border border-gray-100 border-l-4 ${cfg.border} rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <div className={`p-2 rounded-xl ${cfg.iconBg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">
              {displayValue}
            </p>
          </div>
        );
      })}
    </div>
  );
};
