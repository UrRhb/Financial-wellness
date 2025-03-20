import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Calendar, ChevronDown, Filter, Plus } from "lucide-react";
import BudgetWidget from "./BudgetWidget";

interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface MonthlyBudget {
  month: string;
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

interface BudgetPanelProps {
  currentMonth?: string;
  budgetData?: MonthlyBudget[];
  visible?: boolean;
}

const BudgetPanel = ({
  currentMonth = "June 2023",
  budgetData = [
    {
      month: "June 2023",
      totalBudget: 5000,
      totalSpent: 3250,
      categories: [
        { name: "Housing", spent: 1500, budget: 1800, color: "#4F46E5" },
        { name: "Food", spent: 850, budget: 1000, color: "#10B981" },
        { name: "Transportation", spent: 400, budget: 600, color: "#F59E0B" },
        { name: "Entertainment", spent: 350, budget: 400, color: "#8B5CF6" },
        { name: "Utilities", spent: 150, budget: 200, color: "#EF4444" },
      ],
    },
    {
      month: "May 2023",
      totalBudget: 5000,
      totalSpent: 4200,
      categories: [
        { name: "Housing", spent: 1800, budget: 1800, color: "#4F46E5" },
        { name: "Food", spent: 950, budget: 1000, color: "#10B981" },
        { name: "Transportation", spent: 550, budget: 600, color: "#F59E0B" },
        { name: "Entertainment", spent: 500, budget: 400, color: "#8B5CF6" },
        { name: "Utilities", spent: 180, budget: 200, color: "#EF4444" },
        { name: "Shopping", spent: 220, budget: 200, color: "#EC4899" },
      ],
    },
    {
      month: "April 2023",
      totalBudget: 4800,
      totalSpent: 4100,
      categories: [
        { name: "Housing", spent: 1800, budget: 1800, color: "#4F46E5" },
        { name: "Food", spent: 920, budget: 900, color: "#10B981" },
        { name: "Transportation", spent: 480, budget: 500, color: "#F59E0B" },
        { name: "Entertainment", spent: 380, budget: 350, color: "#8B5CF6" },
        { name: "Utilities", spent: 190, budget: 200, color: "#EF4444" },
        { name: "Shopping", spent: 330, budget: 300, color: "#EC4899" },
      ],
    },
  ],
  visible = false,
}: BudgetPanelProps) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [activeTab, setActiveTab] = useState("overview");

  if (!visible) return null;

  // Find the budget data for the selected month
  const currentBudgetData =
    budgetData.find((budget) => budget.month === selectedMonth) ||
    budgetData[0];

  // Prepare data for pie chart
  const pieChartData = currentBudgetData.categories.map((category) => ({
    name: category.name,
    value: category.spent,
    color: category.color,
  }));

  // Prepare data for comparison chart
  const comparisonData = currentBudgetData.categories.map((category) => ({
    name: category.name,
    Budget: category.budget,
    Spent: category.spent,
  }));

  // Calculate monthly spending trends
  const trendData = budgetData
    .map((budget) => ({
      month: budget.month,
      Budget: budget.totalBudget,
      Spent: budget.totalSpent,
    }))
    .reverse();

  const COLORS = currentBudgetData.categories.map((cat) => cat.color);

  return (
    <div className="w-full h-full p-6 bg-gray-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget & Spending</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {budgetData.map((budget, index) => (
                  <SelectItem key={index} value={budget.month}>
                    {budget.month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Budget
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="settings">Budget Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Summary Card */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Budget</span>
                      <span className="text-sm font-medium">
                        ${currentBudgetData.totalSpent.toLocaleString()} / $
                        {currentBudgetData.totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (currentBudgetData.totalSpent /
                          currentBudgetData.totalBudget) *
                        100
                      }
                      className="h-2"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span
                        className={
                          currentBudgetData.totalSpent >
                          currentBudgetData.totalBudget
                            ? "text-red-500 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {currentBudgetData.totalSpent >
                        currentBudgetData.totalBudget
                          ? "Over budget by"
                          : "Remaining"}
                        : $
                        {Math.abs(
                          currentBudgetData.totalBudget -
                            currentBudgetData.totalSpent,
                        ).toLocaleString()}
                      </span>
                      <span className="text-gray-500">
                        {Math.round(
                          (currentBudgetData.totalSpent /
                            currentBudgetData.totalBudget) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-4">
                      Spending Distribution
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`$${value}`, "Amount"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Comparison */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Category Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      <Legend />
                      <Bar dataKey="Budget" fill="#8884d8" />
                      <Bar dataKey="Spent" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentBudgetData.categories.map((category, index) => {
                  const percentage = Math.min(
                    Math.round((category.spent / category.budget) * 100),
                    100,
                  );
                  const remaining = category.budget - category.spent;
                  const isOverBudget = remaining < 0;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span>
                          ${category.spent.toLocaleString()} / $
                          {category.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2"
                        style={{ backgroundColor: "#e5e7eb" }}
                        indicatorStyle={{ backgroundColor: category.color }}
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={
                            isOverBudget ? "text-red-500" : "text-green-600"
                          }
                        >
                          {isOverBudget ? "Over by" : "Left"}: $
                          {Math.abs(remaining).toLocaleString()}
                        </span>
                        <span className="text-gray-500">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBudgetData.categories.map((category, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Budget</span>
                        <span className="text-sm font-medium">
                          ${category.spent.toLocaleString()} / $
                          {category.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(category.spent / category.budget) * 100}
                        className="h-2"
                        style={{ backgroundColor: "#e5e7eb" }}
                        indicatorStyle={{ backgroundColor: category.color }}
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={
                            category.spent > category.budget
                              ? "text-red-500"
                              : "text-green-600"
                          }
                        >
                          {category.spent > category.budget
                            ? "Over by"
                            : "Left"}
                          : $
                          {Math.abs(
                            category.budget - category.spent,
                          ).toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          {Math.round((category.spent / category.budget) * 100)}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">
                        Recent Transactions
                      </h4>
                      <div className="space-y-2">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="flex justify-between items-center text-sm py-1 border-b border-gray-100"
                          >
                            <span className="text-gray-700">
                              Transaction {item}
                            </span>
                            <span className="font-medium">-$25.00</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-xs"
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Legend />
                    <Bar dataKey="Budget" fill="#8884d8" />
                    <Bar dataKey="Spent" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Top Spending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBudgetData.categories
                    .sort((a, b) => b.spent - a.spent)
                    .slice(0, 5)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">
                          ${category.spent.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Budget Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBudgetData.categories
                    .sort((a, b) => a.spent / a.budget - b.spent / b.budget)
                    .slice(0, 5)
                    .map((category, index) => {
                      const efficiency = Math.round(
                        (category.spent / category.budget) * 100,
                      );
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <span className="font-medium">
                              {efficiency}% used
                            </span>
                          </div>
                          <Progress
                            value={efficiency}
                            className="h-2"
                            style={{ backgroundColor: "#e5e7eb" }}
                            indicatorStyle={{ backgroundColor: category.color }}
                          />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Budget Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Configure your budget settings and categories here.
                </p>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPanel;
