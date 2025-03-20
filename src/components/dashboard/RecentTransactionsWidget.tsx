import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  type: "income" | "expense";
}

interface RecentTransactionsWidgetProps {
  transactions?: Transaction[];
  title?: string;
  maxItems?: number;
}

const RecentTransactionsWidget = ({
  transactions = [
    {
      id: "tx1",
      date: "2023-06-15",
      description: "Grocery Store",
      category: "Food & Dining",
      account: "Chase Checking",
      amount: 78.35,
      type: "expense",
    },
    {
      id: "tx2",
      date: "2023-06-14",
      description: "Salary Deposit",
      category: "Income",
      account: "Bank of America",
      amount: 3200.0,
      type: "income",
    },
    {
      id: "tx3",
      date: "2023-06-13",
      description: "Amazon.com",
      category: "Shopping",
      account: "Amex Gold",
      amount: 42.99,
      type: "expense",
    },
    {
      id: "tx4",
      date: "2023-06-12",
      description: "Uber Ride",
      category: "Transportation",
      account: "Chase Sapphire",
      amount: 24.5,
      type: "expense",
    },
    {
      id: "tx5",
      date: "2023-06-10",
      description: "Netflix Subscription",
      category: "Entertainment",
      account: "Visa Signature",
      amount: 15.99,
      type: "expense",
    },
  ],
  title = "Recent Transactions",
  maxItems = 5,
}: RecentTransactionsWidgetProps) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full h-full bg-white shadow-wealth-card hover:shadow-wealth-card-hover transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="relative w-64">
          <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full rounded-md border border-input pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, maxItems).map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.account}</TableCell>
                <TableCell className="text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    {transaction.type === "income" ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {transactions.length > maxItems && (
          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-wealth-primary hover:underline">
              View all transactions
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsWidget;
