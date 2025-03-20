import React from "react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 border rounded-lg bg-background">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
