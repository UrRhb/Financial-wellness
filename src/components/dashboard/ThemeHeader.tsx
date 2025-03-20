import React from "react";
import { ThemeToggle } from "../ui/theme-toggle";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ThemeHeaderProps {
  title: string;
  description?: string;
}

const ThemeHeader = ({ title, description }: ThemeHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] pl-8 md:w-[300px] rounded-full bg-background"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ThemeHeader;
