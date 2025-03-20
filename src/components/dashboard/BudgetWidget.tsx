import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface BudgetWidgetProps {
  title?: string;
  totalBudget?: number;
  totalSpent?: number;
  categories?: BudgetCategory[];
}

const BudgetWidget = ({
  title = "BUDGETING",
  totalBudget = 18000,
  totalSpent = 9479.58,
  categories = [
    { name: "Mortgage", spent: 4087.08, budget: 4500, color: "bg-blue-800" },
    { name: "Shopping", spent: 1885, budget: 2000, color: "bg-blue-600" },
    { name: "Restaurants", spent: 564, budget: 800, color: "bg-blue-400" },
    { name: "Groceries", spent: 428, budget: 600, color: "bg-blue-300" },
    { name: "All Others", spent: 2515.5, budget: 3000, color: "bg-blue-200" },
  ],
}: BudgetWidgetProps) => {
  const totalPercentage = Math.min(
    Math.round((totalSpent / totalBudget) * 100),
    100,
  );
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;

  return (
    <Card className="w-full h-full bg-white shadow-wealth-card hover:shadow-wealth-card-hover transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-[180px] h-[180px]">
            {/* Circular progress indicator */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              {/* Progress circle - using stroke-dasharray and stroke-dashoffset to create partial circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--wealth-primary))"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * totalPercentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-2xl font-bold">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                ${totalBudget.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">{totalPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((category, index) => {
            const percentage = Math.min(
              Math.round((category.spent / category.budget) * 100),
              100,
            );

            return (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${category.color} mr-2`}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">
                  ${category.spent.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetWidget;
