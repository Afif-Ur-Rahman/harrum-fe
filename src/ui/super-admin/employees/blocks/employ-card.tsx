import { Briefcase, Users } from "lucide-react";
import { ROLE_PANEL_STYLES } from "../constants";

export const EmployeeCard = ({
  countsByRole,
}: {
  countsByRole: { roleLabel: string; title: string; total: number }[];
}) => (
  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {countsByRole.map((item) => {
      const styles = ROLE_PANEL_STYLES[item.roleLabel];
      return (
        <div
          key={item.roleLabel}
          className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl ${styles.glow} backdrop-blur-xl transition duration-300 hover:-translate-y-1`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${styles.accent}`}
          />
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-2xl transition duration-300 group-hover:scale-125" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">{item.title}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {item.total}
              </p>
            </div>

            <div className={`rounded-2xl p-3 shadow-lg ${styles.iconClass}`}>
              <Briefcase className="h-6 w-6" />
            </div>
          </div>

          <div className="relative mt-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
              <Users className="h-4 w-4" />
              {item.roleLabel}
            </span>
          </div>
        </div>
      );
    })}
  </section>
);
