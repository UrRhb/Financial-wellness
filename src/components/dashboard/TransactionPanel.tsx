import React, { useState, useMemo } from "react";
import DashboardHeader from "./DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  Wallet,
  Landmark,
  Search,
  Plus,
  Filter,
  BarChart3,
  ArrowUpDown,
  Download,
  Calendar,
  ChevronDown,
  Clock,
  Tag,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay, isSameMonth, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DayPicker } from "react-day-picker";
import chroma from "chroma-js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  type: "income" | "expense" | "transfer";
  status: "completed" | "pending" | "failed";
}

interface Account {
  id: string;
  name: string;
  type: "cash" | "investment" | "credit";
  balance: number;
  institution: string;
}

interface TransactionPanelProps {
  transactions?: Transaction[];
  accounts?: Account[];
  visible?: boolean;
  height?: string;
}

const TransactionPanel = ({
  transactions = [
    {
      id: "t1",
      date: "2023-06-14",
      description: "Grocery Store",
      amount: -78.52,
      category: "Food",
      account: "Checking Account",
      type: "expense",
      status: "completed",
    },
    {
      id: "t2",
      date: "2023-06-12",
      description: "Salary Deposit",
      amount: 3200.0,
      category: "Income",
      account: "Checking Account",
      type: "income",
      status: "completed",
    },
    {
      id: "t3",
      date: "2023-06-10",
      description: "Electric Bill",
      amount: -145.3,
      category: "Utilities",
      account: "Checking Account",
      type: "expense",
      status: "completed",
    },
    {
      id: "t4",
      date: "2023-06-01",
      description: "Transfer from Checking",
      amount: 1000.0,
      category: "Transfer",
      account: "Savings Account",
      type: "transfer",
      status: "completed",
    },
    {
      id: "t5",
      date: "2023-05-15",
      description: "Interest Payment",
      amount: 12.42,
      category: "Interest",
      account: "Savings Account",
      type: "income",
      status: "completed",
    },
    {
      id: "t6",
      date: "2023-06-05",
      description: "Stock Purchase - AAPL",
      amount: -2500.0,
      category: "Investment",
      account: "Investment Portfolio",
      type: "expense",
      status: "completed",
    },
    {
      id: "t7",
      date: "2023-06-01",
      description: "Dividend Payment",
      amount: 320.15,
      category: "Dividend",
      account: "Investment Portfolio",
      type: "income",
      status: "completed",
    },
    {
      id: "t8",
      date: "2023-06-13",
      description: "Restaurant",
      amount: -125.4,
      category: "Dining",
      account: "Credit Card",
      type: "expense",
      status: "completed",
    },
    {
      id: "t9",
      date: "2023-06-11",
      description: "Gas Station",
      amount: -48.62,
      category: "Transportation",
      account: "Credit Card",
      type: "expense",
      status: "completed",
    },
    {
      id: "t10",
      date: "2023-06-08",
      description: "Online Shopping",
      amount: -89.99,
      category: "Shopping",
      account: "Credit Card",
      type: "expense",
      status: "completed",
    },
    {
      id: "t11",
      date: "2023-06-18",
      description: "Upcoming Rent Payment",
      amount: -1500.0,
      category: "Housing",
      account: "Checking Account",
      type: "expense",
      status: "pending",
    },
    {
      id: "t12",
      date: "2023-06-20",
      description: "Freelance Payment",
      amount: 750.0,
      category: "Income",
      account: "Checking Account",
      type: "income",
      status: "pending",
    },
  ],
  accounts = [
    {
      id: "1",
      name: "Checking Account",
      type: "cash",
      balance: 12450.75,
      institution: "Chase Bank",
    },
    {
      id: "2",
      name: "Savings Account",
      type: "cash",
      balance: 38750.42,
      institution: "Chase Bank",
    },
    {
      id: "3",
      name: "Investment Portfolio",
      type: "investment",
      balance: 142680.33,
      institution: "Fidelity",
    },
    {
      id: "4",
      name: "Credit Card",
      type: "credit",
      balance: -4250.18,
      institution: "American Express",
    },
  ],
  visible = true,
  height = "100vh",
}: TransactionPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    undefined,
  );
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined,
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );
  const [currentTab, setCurrentTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  if (!visible) return null;

  // Aggregate transaction data by day
  const dailySpending = useMemo(() => {
    const result: Record<
      string,
      { total: number; transactions: Transaction[] }
    > = {};

    transactions.forEach((transaction) => {
      const day = transaction.date;
      if (!result[day]) {
        result[day] = { total: 0, transactions: [] };
      }
      // For expenses, use the absolute value
      const amount =
        transaction.type === "expense" ? Math.abs(transaction.amount) : 0;
      result[day].total += amount;
      result[day].transactions.push(transaction);
    });

    return result;
  }, [transactions]);

  // Find the maximum daily spending for color scaling
  const maxDailySpending = useMemo(() => {
    return Math.max(...Object.values(dailySpending).map((day) => day.total), 1);
  }, [dailySpending]);

  // Create a color scale from light to dark blue
  const colorScale = chroma
    .scale(["#e6f2ff", "#0066cc"])
    .domain([0, maxDailySpending]);

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search query
    if (
      searchQuery &&
      !transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.account.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by date
    if (
      selectedDate &&
      format(selectedDate, "yyyy-MM-dd") !== transaction.date
    ) {
      return false;
    }

    // Filter by category
    if (selectedCategory && transaction.category !== selectedCategory) {
      return false;
    }

    // Filter by account
    if (selectedAccount && transaction.account !== selectedAccount) {
      return false;
    }

    // Filter by type
    if (selectedType && transaction.type !== selectedType) {
      return false;
    }

    // Filter by status
    if (selectedStatus && transaction.status !== selectedStatus) {
      return false;
    }

    // Filter by tab
    if (currentTab === "income" && transaction.type !== "income") {
      return false;
    }
    if (currentTab === "expenses" && transaction.type !== "expense") {
      return false;
    }
    if (currentTab === "transfers" && transaction.type !== "transfer") {
      return false;
    }
    if (currentTab === "pending" && transaction.status !== "pending") {
      return false;
    }

    return true;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netCashFlow = totalIncome - totalExpenses;

  // Get unique categories for filter
  const categories = Array.from(
    new Set(transactions.map((t) => t.category)),
  ).sort();

  // Get unique accounts for filter
  const accountNames = Array.from(
    new Set(transactions.map((t) => t.account)),
  ).sort();

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDate(undefined);
    setSelectedCategory(undefined);
    setSelectedAccount(undefined);
    setSelectedType(undefined);
    setSelectedStatus(undefined);
  };

  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayData = dailySpending[dayStr];
    const amount = dayData?.total || 0;
    const backgroundColor = amount > 0 ? colorScale(amount).hex() : undefined;
    const textColor =
      amount > 0 && chroma(backgroundColor!).luminance() < 0.5
        ? "white"
        : undefined;

    return (
      <div
        className={cn(
          "h-full w-full flex flex-col items-center justify-center rounded-md",
          !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
        )}
        style={{ backgroundColor }}
      >
        <div className={cn("text-center", textColor && "text-white")}>
          {format(day, "d")}
        </div>
        {amount > 0 && (
          <div className={cn("text-xs font-medium", textColor && "text-white")}>
            ${amount.toFixed(0)}
          </div>
        )}
      </div>
    );
  };

  // Get transactions for a specific day
  const getTransactionsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return dailySpending[dayStr]?.transactions || [];
  };

  return (
    <div
      className="w-full h-full bg-background p-6 overflow-hidden flex flex-col"
      style={{ height }}
    >
      <DashboardHeader
        title="Transactions"
        description="View and manage all your financial transactions"
      />

      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="bg-muted rounded-lg p-1 flex">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-r-none"
          >
            List View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className="rounded-l-none"
          >
            Calendar View
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-xl font-bold">
                  ${totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-xl font-bold">
                  ${totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    netCashFlow >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {netCashFlow >= 0 ? "+" : "-"}$
                  {Math.abs(netCashFlow).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Transactions/Calendar */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "PP") : "Date"}
                    {selectedDate && (
                      <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[150px] h-10">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger className="w-[150px] h-10">
                  <Wallet className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Accounts</SelectItem>
                  {accountNames.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px] h-10">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px] h-10">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                className="h-10"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>

          {viewMode === "list" ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="rounded-md border flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Account</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                <div className="flex-1 overflow-auto">
                  {filteredTransactions.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No transactions found
                      </p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="grid grid-cols-12 gap-4 p-4 border-t hover:bg-muted/20 cursor-pointer"
                      >
                        <div className="col-span-2 text-sm">
                          {transaction.date}
                        </div>
                        <div className="col-span-3">
                          {transaction.description}
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-sm">
                          {transaction.account}
                        </div>
                        <div className="col-span-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100",
                            )}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <div
                          className={cn(
                            "col-span-2 text-right font-medium",
                            transaction.amount < 0
                              ? "text-red-600"
                              : "text-green-600",
                          )}
                        >
                          {transaction.amount < 0 ? "-" : "+"}$
                          {Math.abs(transaction.amount).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {filteredTransactions.length > 0 && (
                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                  <div>Showing {filteredTransactions.length} transactions</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Spending Calendar</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Color intensity indicates spending amount for each day
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: colorScale(0).hex() }}
                    ></div>
                    <span className="text-xs">$0</span>
                  </div>
                  <div
                    className="w-16 h-2 rounded-sm"
                    style={{
                      background: `linear-gradient(to right, ${colorScale(0).hex()}, ${colorScale(maxDailySpending).hex()})`,
                    }}
                  ></div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor: colorScale(maxDailySpending).hex(),
                      }}
                    ></div>
                    <span className="text-xs">
                      ${maxDailySpending.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  modifiers={{
                    hasTransactions: (date) => {
                      const dayStr = format(date, "yyyy-MM-dd");
                      return !!dailySpending[dayStr];
                    },
                  }}
                  modifiersStyles={{
                    hasTransactions: { fontWeight: "bold" },
                  }}
                  components={{
                    Day: ({ date, ...props }) => {
                      return (
                        <div {...props} className="h-14 w-full p-1">
                          {renderDay(date)}
                        </div>
                      );
                    },
                  }}
                  className="w-full max-w-none"
                  styles={{
                    caption: { marginBottom: "0.5rem" },
                    months: { width: "100%" },
                    month: { width: "100%" },
                    table: { width: "100%" },
                    head_cell: { padding: "0.5rem" },
                    cell: { padding: "0.25rem" },
                  }}
                />
              </div>

              {selectedDate && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">
                    Transactions for {format(selectedDate, "MMMM d, yyyy")}
                  </h3>
                  <div className="space-y-2 max-h-[200px] overflow-auto">
                    {getTransactionsForDay(selectedDate).length === 0 ? (
                      <p className="text-muted-foreground">
                        No transactions for this day
                      </p>
                    ) : (
                      getTransactionsForDay(selectedDate).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex justify-between items-center p-2 border-b"
                        >
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {transaction.account}
                              </span>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "font-medium",
                              transaction.amount < 0
                                ? "text-red-600"
                                : "text-green-600",
                            )}
                          >
                            {transaction.amount < 0 ? "-" : "+"}$
                            {Math.abs(transaction.amount).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPanel;
