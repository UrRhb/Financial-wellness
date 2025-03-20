import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  Wallet,
  Landmark,
  Search,
  Plus,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AccountType {
  id: string;
  name: string;
  type: "cash" | "investment" | "credit";
  balance: number;
  change: number;
  icon: React.ReactNode;
  institution?: string;
  lastUpdated?: string;
}

interface AccountSummaryWidgetProps {
  accounts?: AccountType[];
  title?: string;
}

const AccountSummaryWidget = ({
  accounts = [
    {
      id: "1",
      name: "Checking Account",
      type: "cash",
      balance: 12450.75,
      change: 2.5,
      icon: <DollarSign className="h-4 w-4" />,
      institution: "Wells Fargo",
      lastUpdated: "4 mins ago",
    },
    {
      id: "2",
      name: "Savings Account",
      type: "cash",
      balance: 38750.42,
      change: 1.2,
      icon: <Wallet className="h-4 w-4" />,
      institution: "Chase Bank",
      lastUpdated: "2023/04/28",
    },
    {
      id: "3",
      name: "Investment Portfolio",
      type: "investment",
      balance: 142680.33,
      change: 3.8,
      icon: <Landmark className="h-4 w-4" />,
      institution: "Fidelity",
      lastUpdated: "2023/04/21",
    },
    {
      id: "4",
      name: "Credit Card",
      type: "credit",
      balance: -4250.18,
      change: -1.5,
      icon: <CreditCard className="h-4 w-4" />,
      institution: "American Express",
      lastUpdated: "2023/04/21",
    },
  ],
  title = "ACCOUNTS",
}: AccountSummaryWidgetProps) => {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  // Group accounts by type
  const cashAccounts = accounts.filter((account) => account.type === "cash");
  const investmentAccounts = accounts.filter(
    (account) => account.type === "investment",
  );
  const creditAccounts = accounts.filter(
    (account) => account.type === "credit",
  );

  return (
    <Card className="w-full h-full bg-white shadow-wealth-card hover:shadow-wealth-card-hover transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-wealth-primary-light text-wealth-primary hover:bg-wealth-primary-light/80 hover:text-wealth-primary-dark"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Accounts"
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-wealth-primary mb-4">
            $
            {totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Assets</span>
              <span className="text-sm font-medium">
                $
                {(
                  totalBalance +
                  Math.abs(
                    accounts.find((a) => a.type === "credit")?.balance || 0,
                  )
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-wealth-primary h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Liabilities</span>
              <span className="text-sm font-medium">
                $
                {Math.abs(
                  accounts.find((a) => a.type === "credit")?.balance || 0,
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>
        </div>

        {cashAccounts.length > 0 && (
          <div className="bg-wealth-neutral-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Cash</h3>
              <div className="flex items-center">
                <span className="font-bold">
                  $
                  {cashAccounts
                    .reduce((sum, account) => sum + account.balance, 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </span>
                <ChevronUp className="h-5 w-5 ml-1" />
              </div>
            </div>

            <div className="space-y-3">
              {cashAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-gray-500">
                      {account.institution}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      $
                      {account.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {account.lastUpdated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {investmentAccounts.length > 0 && (
          <div className="bg-wealth-neutral-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Investments</h3>
              <div className="flex items-center">
                <span className="font-bold">
                  $
                  {investmentAccounts
                    .reduce((sum, account) => sum + account.balance, 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </span>
                <ChevronUp className="h-5 w-5 ml-1" />
              </div>
            </div>

            <div className="space-y-3">
              {investmentAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-gray-500">
                      {account.institution}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      $
                      {account.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {account.lastUpdated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {creditAccounts.length > 0 && (
          <div className="bg-wealth-neutral-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Credit Card</h3>
              <div className="flex items-center">
                <span className="font-bold text-red-600">
                  -$
                  {Math.abs(
                    creditAccounts.reduce(
                      (sum, account) => sum + account.balance,
                      0,
                    ),
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <ChevronUp className="h-5 w-5 ml-1" />
              </div>
            </div>

            <div className="space-y-3">
              {creditAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-gray-500">
                      {account.institution}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      -$
                      {Math.abs(account.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {account.lastUpdated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountSummaryWidget;
