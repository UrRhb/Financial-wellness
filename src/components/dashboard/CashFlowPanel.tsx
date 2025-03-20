import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  FilterIcon,
  DownloadIcon,
} from "lucide-react";
import CashFlowWidget from "./CashFlowWidget";

interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeSource {
  source: string;
  amount: number;
  percentage: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface CashFlowPanelProps {
  cashFlowData?: CashFlowData[];
  incomeSources?: IncomeSource[];
  expenseCategories?: ExpenseCategory[];
  ytdSavings?: number;
  ytdSavingsPercentage?: number;
  visible?: boolean;
}

const CashFlowPanel = ({
  cashFlowData = [
    { month: "Jan", income: 5200, expenses: 4100 },
    { month: "Feb", income: 5300, expenses: 4200 },
    { month: "Mar", income: 5400, expenses: 4000 },
    { month: "Apr", income: 5500, expenses: 4300 },
    { month: "May", income: 5600, expenses: 4400 },
    { month: "Jun", income: 5700, expenses: 4500 },
    { month: "Jul", income: 5800, expenses: 4600 },
    { month: "Aug", income: 5900, expenses: 4700 },
    { month: "Sep", income: 6000, expenses: 4800 },
    { month: "Oct", income: 6100, expenses: 4900 },
    { month: "Nov", income: 6200, expenses: 5000 },
    { month: "Dec", income: 6300, expenses: 5100 },
  ],
  incomeSources = [
    { source: "Salary", amount: 4500, percentage: 75 },
    { source: "Investments", amount: 800, percentage: 13 },
    { source: "Side Business", amount: 500, percentage: 8 },
    { source: "Other", amount: 200, percentage: 4 },
  ],
  expenseCategories = [
    { category: "Housing", amount: 1800, percentage: 40 },
    { category: "Food", amount: 800, percentage: 18 },
    { category: "Transportation", amount: 600, percentage: 13 },
    { category: "Utilities", amount: 400, percentage: 9 },
    { category: "Entertainment", amount: 300, percentage: 7 },
    { category: "Other", amount: 600, percentage: 13 },
  ],
  ytdSavings = 12600,
  ytdSavingsPercentage = 18,
  visible = false,
}: CashFlowPanelProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeframe, setTimeframe] = useState("monthly");

  // Calculate totals
  const totalIncome = incomeSources.reduce(
    (sum, source) => sum + source.amount,
    0,
  );
  const totalExpenses = expenseCategories.reduce(
    (sum, category) => sum + category.amount,
    0,
  );
  const monthlySavings = totalIncome - totalExpenses;
  const savingsRate = Math.round((monthlySavings / totalIncome) * 100);

  if (!visible) return null;

  return (
    <div className="w-full h-full p-6 bg-background overflow-y-auto">
      <DashboardHeader
        title="Cash Flow Management"
        description="Track your income, expenses, and savings over time"
      />

      <div className="flex items-center justify-between mb-6">
        <Tabs
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-[400px]"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 mr-1 text-green-500" />
                <span>5.2% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowDownIcon className="h-4 w-4 mr-1 text-green-500" />
                <span>2.1% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-bold text-blue-600">
                ${monthlySavings.toLocaleString()}
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
                <span>{savingsRate}% of income</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Cash Flow Chart</p>
            </div>
          </CardContent>
        </Card>

        {/* Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{source.source}</span>
                    <span>${source.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-xs text-muted-foreground">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.category}</span>
                    <span>${category.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-xs text-muted-foreground">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* YTD Savings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Year-to-Date Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-3xl font-bold">
                  ${ytdSavings.toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  {ytdSavingsPercentage}% of total income
                </p>
              </div>
              <div className="w-full md:w-2/3 bg-slate-100 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${ytdSavingsPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Widget */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowWidget
              title=""
              incomeThisMonth={totalIncome}
              expensesThisMonth={totalExpenses}
              incomeLastMonth={5300}
              expensesLastMonth={4200}
              yearToDateSavings={ytdSavings}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashFlowPanel;
