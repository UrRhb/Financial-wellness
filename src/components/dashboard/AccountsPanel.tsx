import React, { useState } from "react";
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
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: "cash" | "investment" | "credit";
  balance: number;
  change: number;
  institution: string;
  lastUpdated: string;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface AccountsPanelProps {
  accounts?: Account[];
  activeTab?: string;
  visible?: boolean;
}

const AccountsPanel = ({
  accounts = [
    {
      id: "1",
      name: "Checking Account",
      type: "cash",
      balance: 12450.75,
      change: 2.5,
      institution: "Chase Bank",
      lastUpdated: "2023-06-15",
      transactions: [
        {
          id: "t1",
          date: "2023-06-14",
          description: "Grocery Store",
          amount: -78.52,
          category: "Food",
        },
        {
          id: "t2",
          date: "2023-06-12",
          description: "Salary Deposit",
          amount: 3200.0,
          category: "Income",
        },
        {
          id: "t3",
          date: "2023-06-10",
          description: "Electric Bill",
          amount: -145.3,
          category: "Utilities",
        },
      ],
    },
    {
      id: "2",
      name: "Savings Account",
      type: "cash",
      balance: 38750.42,
      change: 1.2,
      institution: "Chase Bank",
      lastUpdated: "2023-06-15",
      transactions: [
        {
          id: "t4",
          date: "2023-06-01",
          description: "Transfer from Checking",
          amount: 1000.0,
          category: "Transfer",
        },
        {
          id: "t5",
          date: "2023-05-15",
          description: "Interest Payment",
          amount: 12.42,
          category: "Interest",
        },
      ],
    },
    {
      id: "3",
      name: "Investment Portfolio",
      type: "investment",
      balance: 142680.33,
      change: 3.8,
      institution: "Fidelity",
      lastUpdated: "2023-06-15",
      transactions: [
        {
          id: "t6",
          date: "2023-06-05",
          description: "Stock Purchase - AAPL",
          amount: -2500.0,
          category: "Investment",
        },
        {
          id: "t7",
          date: "2023-06-01",
          description: "Dividend Payment",
          amount: 320.15,
          category: "Dividend",
        },
      ],
    },
    {
      id: "4",
      name: "Credit Card",
      type: "credit",
      balance: -4250.18,
      change: -1.5,
      institution: "American Express",
      lastUpdated: "2023-06-15",
      transactions: [
        {
          id: "t8",
          date: "2023-06-13",
          description: "Restaurant",
          amount: -125.4,
          category: "Dining",
        },
        {
          id: "t9",
          date: "2023-06-11",
          description: "Gas Station",
          amount: -48.62,
          category: "Transportation",
        },
        {
          id: "t10",
          date: "2023-06-08",
          description: "Online Shopping",
          amount: -89.99,
          category: "Shopping",
        },
      ],
    },
  ],
  activeTab = "all",
  visible = false,
}: AccountsPanelProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(activeTab);

  if (!visible) return null;

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  const filteredAccounts = accounts.filter((account) => {
    if (currentTab === "all") return true;
    return account.type === currentTab;
  });

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <Wallet className="h-5 w-5" />;
      case "investment":
        return <Landmark className="h-5 w-5" />;
      case "credit":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getAccountDetails = () => {
    if (!selectedAccount) return null;
    const account = accounts.find((acc) => acc.id === selectedAccount);
    if (!account) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-3 rounded-full",
                account.type === "cash"
                  ? "bg-blue-100"
                  : account.type === "investment"
                    ? "bg-green-100"
                    : "bg-red-100",
              )}
            >
              {getAccountIcon(account.type)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{account.name}</h3>
              <p className="text-sm text-muted-foreground">
                {account.institution}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-2xl font-bold",
                account.balance < 0 ? "text-red-600" : "text-slate-900",
              )}
            >
              {account.balance < 0 ? "-" : ""}$
              {Math.abs(account.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-end gap-1">
              {account.change > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <p
                className={cn(
                  "text-sm",
                  account.change > 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {Math.abs(account.change)}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Recent Transactions</h4>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Search transactions..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium">
              <div className="col-span-3">Date</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            {account.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="grid grid-cols-12 gap-4 p-4 border-t"
              >
                <div className="col-span-3 text-sm">{transaction.date}</div>
                <div className="col-span-5">{transaction.description}</div>
                <div className="col-span-2">
                  <Badge variant="outline">{transaction.category}</Badge>
                </div>
                <div
                  className={cn(
                    "col-span-2 text-right font-medium",
                    transaction.amount < 0 ? "text-red-600" : "text-green-600",
                  )}
                >
                  {transaction.amount < 0 ? "-" : "+"}$
                  {Math.abs(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">
                    $
                    {totalBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <Separator />

                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="cash">Cash</TabsTrigger>
                    <TabsTrigger value="investment">Invest</TabsTrigger>
                    <TabsTrigger value="credit">Credit</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-3">
                  {filteredAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedAccount === account.id &&
                          "bg-muted/50 border-primary",
                      )}
                      onClick={() => setSelectedAccount(account.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            account.type === "cash"
                              ? "bg-blue-100"
                              : account.type === "investment"
                                ? "bg-green-100"
                                : "bg-red-100",
                          )}
                        >
                          {getAccountIcon(account.type)}
                        </div>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {account.institution}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-medium",
                            account.balance < 0
                              ? "text-red-600"
                              : "text-slate-900",
                          )}
                        >
                          {account.balance < 0 ? "-" : ""}$
                          {Math.abs(account.balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {selectedAccount ? (
                getAccountDetails()
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Select an Account
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose an account from the list to view detailed
                    information, recent transactions, and account analytics.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountsPanel;
