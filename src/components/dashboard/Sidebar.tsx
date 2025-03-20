import React, { useState } from "react";
import { ThemeToggle } from "../ui/theme-toggle";
import {
  LayoutDashboard,
  TrendingUp,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { DashboardSection } from "./DashboardLayout";

interface SidebarProps {
  className?: string;
  activeSection?: DashboardSection;
  onSectionChange?: (section: DashboardSection) => void;
}

const Sidebar = ({
  className = "",
  activeSection = "overview",
  onSectionChange,
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "HOME",
      path: "/",
      id: "home" as DashboardSection,
    },
    {
      icon: TrendingUp,
      label: "Financial Wellness",
      path: "/financial-wellness",
      id: "financial-wellness" as DashboardSection,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r transition-all duration-300 ease-in-out shadow-sm",
        collapsed ? "w-20" : "w-[280px]",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mrs"
                alt="User"
              />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Mrs. MADONI</span>
            </div>
          </div>
        )}
        {collapsed && (
          <Avatar className="h-10 w-10 mx-auto">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mrs"
              alt="User"
            />
            <AvatarFallback>MM</AvatarFallback>
          </Avatar>
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="p-4">
        <div className="bg-wealth-neutral-50 rounded-xl p-4 mb-6 shadow-wealth-sm border border-wealth-neutral-100">
          <h3 className="text-sm font-medium">Complete Account Setup</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Set up your investment accounts to proceed
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 rounded-full p-0 ml-auto flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 py-6">
        <h3 className="px-4 text-xs font-semibold text-muted-foreground mb-2">
          EXPLORE
        </h3>
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <TooltipProvider
                delayDuration={0}
                disableHoverableContent={!collapsed}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        onSectionChange && onSectionChange(item.id)
                      }
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left",
                        activeSection === item.id
                          ? "font-medium bg-wealth-primary-light text-wealth-primary"
                          : "text-slate-700 hover:bg-wealth-neutral-100",
                      )}
                    >
                      <div className="flex items-center justify-center w-6 h-6">
                        <item.icon className="h-5 w-5" />
                      </div>
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 flex justify-center">
        <div className="flex items-center gap-2">
          <img
            src="/wealth-logo.svg"
            alt="Wealth"
            className="h-6"
            onError={(e) => {
              e.currentTarget.src =
                "https://api.dicebear.com/7.x/shapes/svg?seed=Wealth&backgroundColor=6366f1&shape=circle&size=24";
            }}
          />
          {!collapsed && <span className="font-semibold">Wealth</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
