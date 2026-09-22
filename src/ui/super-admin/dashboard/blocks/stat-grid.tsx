import { StatCard } from "./stat-card";

import { stats } from "../data";

export const StatsGrid = () => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map(item => (
        <StatCard key={item.title} item={item} />
      ))}
    </section>
  );
};
