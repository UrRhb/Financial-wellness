import React from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  value: string;
  active?: boolean;
}

interface TopNavigationProps {
  items: NavItem[];
  onSelect: (value: string) => void;
  className?: string;
}

const TopNavigation = ({ items, onSelect, className }: TopNavigationProps) => {
  return (
    <div
      className={cn(
        "flex space-x-2 bg-wealth-neutral-50 p-2 rounded-xl shadow-sm",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className={cn(
            "px-6 py-3 rounded-lg text-sm font-medium transition-colors",
            item.active
              ? "bg-wealth-primary text-white shadow-sm"
              : "text-slate-600 hover:bg-wealth-neutral-100",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default TopNavigation;
