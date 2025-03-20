import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  action?: ReactNode;
}

const DataCard = ({
  title,
  description,
  children,
  className,
  contentClassName,
  action,
}: DataCardProps) => {
  return (
    <Card className={cn("bg-card h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className={cn("pt-2", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DataCard;
