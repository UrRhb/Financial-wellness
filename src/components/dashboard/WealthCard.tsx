import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WealthCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  gradient?: "primary" | "secondary" | "success" | "info" | "none";
  icon?: ReactNode;
  action?: ReactNode;
  elevation?: "sm" | "md" | "lg" | "xl" | "none";
}

const WealthCard = ({
  title,
  subtitle,
  children,
  className,
  gradient = "none",
  icon,
  action,
  elevation = "md",
}: WealthCardProps) => {
  const gradientClasses = {
    primary: "bg-gradient-wealth",
    secondary: "bg-gradient-wealth-alt",
    success: "bg-gradient-success",
    info: "bg-gradient-info",
    none: "bg-white",
  };

  const elevationClasses = {
    sm: "shadow-wealth-sm",
    md: "shadow-wealth-card",
    lg: "shadow-wealth-lg",
    xl: "shadow-wealth-xl",
    none: "",
  };

  const headerGradient = gradient !== "none";

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-200 hover:shadow-wealth-card-hover",
        elevationClasses[elevation],
        className,
      )}
    >
      {(title || icon || action) && (
        <div
          className={cn(
            "px-6 py-5 flex items-center justify-between",
            headerGradient
              ? `${gradientClasses[gradient]} text-white`
              : "bg-white border-b",
          )}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  "p-2 rounded-full",
                  headerGradient ? "bg-white/20" : "bg-wealth-primary/10",
                )}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3
                  className={cn(
                    "font-semibold",
                    headerGradient ? "text-white" : "text-foreground",
                  )}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className={cn(
                    "text-sm",
                    headerGradient ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="bg-white p-6">{children}</div>
    </div>
  );
};

export default WealthCard;
