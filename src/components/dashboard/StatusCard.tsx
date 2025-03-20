import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

const StatusCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatusCardProps) => {
  return (
    <Card
      className={cn(
        "bg-card shadow-wealth-stat hover:shadow-wealth-card transition-all duration-200",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
            {trend && (
              <div
                className={cn(
                  "flex items-center mt-2 text-sm",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                <span>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground ml-1">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10 shadow-sm">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
