import React from "react";
import StatusCard from "./StatusCard";
import { cn } from "@/lib/utils";

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const StatsGrid = ({ stats, columns = 3, className }: StatsGridProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <StatusCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
