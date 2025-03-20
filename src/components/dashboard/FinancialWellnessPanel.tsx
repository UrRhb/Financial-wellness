import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  ChevronUp,
  TrendingUp,
  Wallet,
  PieChart,
  ArrowUpDown,
  RefreshCw,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import NetWorthWidget from "./NetWorthWidget";
import AccountSummaryWidget from "./AccountSummaryWidget";
import BudgetWidget from "./BudgetWidget";
import CashFlowWidget from "./CashFlowWidget";
import ConnectAccountSection from "../plaid/ConnectAccountSection";
import { usePlaid } from "@/context/PlaidContext";
import { usePlaidAPI } from "@/hooks/usePlaidAPI";
import LoadingSpinner from "./LoadingSpinner";
import { format } from "date-fns";

const FinancialWellnessPanel = () => {
  const {
    isConnected,
    connectedAccounts,
    financialData,
    investments,
    liabilities,
    lastUpdated,
  } = usePlaid();
  const { fetchAllFinancialData, isLoading } = usePlaidAPI();

  // Fetch financial data when component mounts if connected
  useEffect(() => {
    if (isConnected && (!financialData || !lastUpdated)) {
      fetchAllFinancialData();
    }
  }, [isConnected, financialData, lastUpdated, fetchAllFinancialData]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate asset percentage for progress bar
  const calculateAssetPercentage = () => {
    if (!financialData) return 80; // Default value
    const total = financialData.totalAssets + financialData.totalLiabilities;
    return total > 0 ? (financialData.totalAssets / total) * 100 : 80;
  };

  // Calculate liability percentage for progress bar
  const calculateLiabilityPercentage = () => {
    if (!financialData) return 20; // Default value
    const total = financialData.totalAssets + financialData.totalLiabilities;
    return total > 0 ? (financialData.totalLiabilities / total) * 100 : 20;
  };

  // Group accounts by type
  const groupAccountsByType = () => {
    if (!connectedAccounts || connectedAccounts.length === 0) return {};

    return connectedAccounts.reduce((acc, account) => {
      const type = account.type || "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(account);
      return acc;
    }, {});
  };

  // Calculate total balance for a group of accounts
  const calculateGroupBalance = (accounts) => {
    return accounts.reduce((sum, account) => {
      return sum + (account.balance?.current || 0);
    }, 0);
  };

  const accountGroups = groupAccountsByType();

  // Handle refresh
  const handleRefresh = () => {
    fetchAllFinancialData();
  };

  return (
    <div className="space-y-6">
      <ConnectAccountSection />

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Worth</p>
                <p className="text-xl font-bold">
                  {financialData
                    ? formatCurrency(financialData.netWorth)
                    : "$498,041.74"}
                </p>
                <p className="text-xs text-green-600">+1.4% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Assets</p>
                <p className="text-xl font-bold">
                  {financialData
                    ? formatCurrency(financialData.totalAssets)
                    : "$532,291.92"}
                </p>
                <p className="text-xs text-green-600">+2.1% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <ArrowUpDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Liabilities</p>
                <p className="text-xl font-bold">
                  {financialData
                    ? formatCurrency(financialData.totalLiabilities)
                    : "$34,250.18"}
                </p>
                <p className="text-xs text-green-600">-3.2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Savings</p>
                <p className="text-xl font-bold">
                  {financialData
                    ? formatCurrency(financialData.monthlySavings)
                    : "$3,732.00"}
                </p>
                <p className="text-xs text-green-600">+5.8% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <Card className="bg-white shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
          <CardTitle className="text-xl font-bold">ACCOUNTS</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
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
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                  {financialData
                    ? formatCurrency(financialData.netWorth)
                    : "$943,479.58"}
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assets</span>
                    <span className="text-sm font-medium">
                      {financialData
                        ? formatCurrency(financialData.totalAssets)
                        : "$143,276,087.08"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${calculateAssetPercentage()}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liabilities</span>
                    <span className="text-sm font-medium">
                      {financialData
                        ? formatCurrency(financialData.totalLiabilities)
                        : "$3,356,452.76"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${calculateLiabilityPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Cash Accounts */}
                {accountGroups.depository &&
                  accountGroups.depository.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Cash</h3>
                        <div className="flex items-center">
                          <span className="font-bold">
                            {formatCurrency(
                              calculateGroupBalance(accountGroups.depository),
                            )}
                          </span>
                          <ChevronUp className="h-5 w-5 ml-1" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {accountGroups.depository.map((account) => (
                          <div
                            key={account.id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-xs text-gray-500">
                                {account.institution} •••• {account.mask}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(account.balance?.current || 0)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lastUpdated
                                  ? format(new Date(lastUpdated), "MMM d, yyyy")
                                  : "4 mins ago"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Investment Accounts */}
                {(accountGroups.investment ||
                  (investments && investments.accounts.length > 0)) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Investments</h3>
                      <div className="flex items-center">
                        <span className="font-bold">
                          {formatCurrency(
                            calculateGroupBalance(
                              accountGroups.investment || [],
                            ) +
                              (investments?.holdings?.reduce(
                                (sum, holding) =>
                                  sum + (holding.institution_value || 0),
                                0,
                              ) || 0),
                          )}
                        </span>
                        <ChevronUp className="h-5 w-5 ml-1" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Show investment accounts */}
                      {accountGroups.investment &&
                        accountGroups.investment.map((account) => (
                          <div
                            key={account.id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-xs text-gray-500">
                                {account.institution} •••• {account.mask}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(account.balance?.current || 0)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lastUpdated
                                  ? format(new Date(lastUpdated), "MMM d, yyyy")
                                  : "4 mins ago"}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Show investment holdings */}
                      {investments &&
                        investments.holdings &&
                        investments.holdings
                          .slice(0, 3)
                          .map((holding, index) => {
                            const security = investments.securities.find(
                              (s) => s.security_id === holding.security_id,
                            );
                            return (
                              <div
                                key={`holding-${index}`}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">
                                    {security?.name ||
                                      holding.security_name ||
                                      "Investment"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {holding.institution ||
                                      "Investment Account"}{" "}
                                    {security?.ticker_symbol
                                      ? `(${security.ticker_symbol})`
                                      : ""}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    {formatCurrency(
                                      holding.institution_value || 0,
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {lastUpdated
                                      ? format(
                                          new Date(lastUpdated),
                                          "MMM d, yyyy",
                                        )
                                      : "4 mins ago"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                )}

                {/* Credit/Liability Accounts */}
                {(accountGroups.credit ||
                  (liabilities && liabilities.credit.length > 0)) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Credit & Loans</h3>
                      <div className="flex items-center">
                        <span className="font-bold text-red-600">
                          {formatCurrency(
                            Math.abs(
                              calculateGroupBalance(accountGroups.credit || []),
                            ) +
                              (liabilities?.credit?.reduce(
                                (sum, credit) =>
                                  sum + Math.abs(credit.balances?.current || 0),
                                0,
                              ) || 0) +
                              (liabilities?.mortgage?.reduce(
                                (sum, mortgage) =>
                                  sum +
                                  Math.abs(mortgage.balances?.current || 0),
                                0,
                              ) || 0) +
                              (liabilities?.student?.reduce(
                                (sum, student) =>
                                  sum +
                                  Math.abs(student.balances?.current || 0),
                                0,
                              ) || 0),
                          )}
                        </span>
                        <ChevronUp className="h-5 w-5 ml-1" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Show credit card accounts */}
                      {accountGroups.credit &&
                        accountGroups.credit.map((account) => (
                          <div
                            key={account.id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-xs text-gray-500">
                                {account.institution} •••• {account.mask}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">
                                {formatCurrency(
                                  Math.abs(account.balance?.current || 0),
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lastUpdated
                                  ? format(new Date(lastUpdated), "MMM d, yyyy")
                                  : "4 mins ago"}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Show credit liabilities */}
                      {liabilities &&
                        liabilities.credit &&
                        liabilities.credit.map((credit, index) => (
                          <div
                            key={`credit-${index}`}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">
                                {credit.account_name || "Credit Card"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {credit.institution} •••• {credit.account_mask}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">
                                {formatCurrency(
                                  Math.abs(credit.balances?.current || 0),
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lastUpdated
                                  ? format(new Date(lastUpdated), "MMM d, yyyy")
                                  : "4 mins ago"}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Show mortgage liabilities */}
                      {liabilities &&
                        liabilities.mortgage &&
                        liabilities.mortgage.map((mortgage, index) => (
                          <div
                            key={`mortgage-${index}`}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">
                                {mortgage.account_name || "Mortgage"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {mortgage.institution} • Mortgage
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">
                                {formatCurrency(
                                  Math.abs(mortgage.balances?.current || 0),
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lastUpdated
                                  ? format(new Date(lastUpdated), "MMM d, yyyy")
                                  : "4 mins ago"}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Show student loan liabilities */}
                      {liabilities &&
                        liabilities.student &&
                        liabilities.student.map((loan, index) => (
                          <div
                            key={`student-${index}`}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">
                                {loan.account_name || "Student Loan"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {loan.institution} • Student Loan
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">
                                {formatCurrency(
                                  Math.abs(loan.balances?.current || 0),
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lastUpdated
                                  ? format(new Date(lastUpdated), "MMM d, yyyy")
                                  : "4 mins ago"}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Net Worth Section */}
      <Card className="bg-white shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
          <CardTitle className="text-xl font-bold">NET WORTH</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-2">
              {financialData
                ? formatCurrency(financialData.netWorth)
                : "$498,041.74"}
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-sm">This Month</span>
              <div className="flex items-center">
                <span className="text-sm text-green-600 font-medium">
                  +$7,089
                </span>
                <span className="text-xs text-gray-500 ml-2">1-Day</span>
              </div>
            </div>
          </div>

          <div className="h-[200px] bg-slate-50 rounded-lg mb-4">
            {/* This would be the chart component */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Net Worth Chart</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">90-Day</span>
              <span className="text-sm text-green-600 font-medium ml-2">
                +$7,089
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budgeting Section */}
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
            <CardTitle className="text-xl font-bold">BUDGETING</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-[200px] h-[200px]">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-2xl font-bold">
                    {financialData
                      ? formatCurrency(financialData.monthlyExpenses)
                      : "$9,479.58"}
                  </p>
                  <p className="text-sm text-gray-500">$18,000.00</p>
                  <p className="text-xs text-green-600">
                    {financialData
                      ? Math.round(
                          (financialData.monthlyExpenses / 18000) * 100,
                        )
                      : 52.7}
                    %
                  </p>
                </div>
                {/* This would be the circular progress chart */}
                <div className="w-full h-full rounded-full border-8 border-blue-500 border-opacity-20"></div>
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-blue-500"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                    transform: "rotate(90deg)",
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-800 mr-2"></div>
                  <span className="text-sm">Mortgage</span>
                </div>
                <span className="text-sm font-medium">$4,087.08</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                  <span className="text-sm">Shopping</span>
                </div>
                <span className="text-sm font-medium">$1,885</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-sm">Restaurants</span>
                </div>
                <span className="text-sm font-medium">$564</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Section */}
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
            <CardTitle className="text-xl font-bold">CASH FLOW</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">This Month</span>
                <span
                  className={`text-sm font-medium ${financialData && financialData.monthlySavings < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {financialData
                    ? (financialData.monthlySavings >= 0 ? "+" : "-") +
                      formatCurrency(Math.abs(financialData.monthlySavings))
                    : "-$1,087"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Income this month
                  </p>
                  <div className="flex items-center">
                    <p className="text-lg font-bold">
                      {financialData
                        ? formatCurrency(financialData.monthlyIncome)
                        : "$4,530"}
                    </p>
                    <div className="flex-1 h-4 bg-blue-100 ml-4 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last month $2,347
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Expenses this month
                  </p>
                  <div className="flex items-center">
                    <p className="text-lg font-bold">
                      {financialData
                        ? formatCurrency(financialData.monthlyExpenses)
                        : "$5,798"}
                    </p>
                    <div className="flex-1 h-4 bg-red-100 ml-4 rounded-full">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last month $2,347
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    upto $2,589 so far this year
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialWellnessPanel;
