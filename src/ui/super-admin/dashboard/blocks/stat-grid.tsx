import { stats } from "../data";
import { StatCard } from "./stat-card";

export const StatsGrid = () => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard key={item.title} item={item} />
      ))}
    </section>
  );
};
