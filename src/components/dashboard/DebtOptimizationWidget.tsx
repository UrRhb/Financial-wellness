import React from "react";
import WealthCard from "./WealthCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, ArrowDown, Zap, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  recommendedPayment: number;
  payoffDate: string;
  optimizedPayoffDate: string;
  interestSaved: number;
  timeSaved: number; // in months
}

interface DebtOptimizationWidgetProps {
  debts?: DebtItem[];
  className?: string;
  totalDebt?: number;
  totalInterestSaved?: number;
  totalTimeSaved?: number;
}

const DebtOptimizationWidget = ({
  debts = [
    {
      id: "1",
      name: "Mortgage",
      balance: 450000,
      interestRate: 3.5,
      minimumPayment: 2200,
      recommendedPayment: 3000,
      payoffDate: "2048-06",
      optimizedPayoffDate: "2041-03",
      interestSaved: 78500,
      timeSaved: 87,
    },
    {
      id: "2",
      name: "Investment Property Loan",
      balance: 320000,
      interestRate: 4.2,
      minimumPayment: 1800,
      recommendedPayment: 2500,
      payoffDate: "2045-09",
      optimizedPayoffDate: "2039-11",
      interestSaved: 62000,
      timeSaved: 70,
    },
    {
      id: "3",
      name: "Business Loan",
      balance: 150000,
      interestRate: 5.8,
      minimumPayment: 3200,
      recommendedPayment: 4500,
      payoffDate: "2028-04",
      optimizedPayoffDate: "2026-08",
      interestSaved: 18500,
      timeSaved: 20,
    },
    {
      id: "4",
      name: "Credit Line",
      balance: 75000,
      interestRate: 7.2,
      minimumPayment: 1500,
      recommendedPayment: 2800,
      payoffDate: "2027-10",
      optimizedPayoffDate: "2025-12",
      interestSaved: 12800,
      timeSaved: 22,
    },
  ],
  className,
  totalDebt = 995000,
  totalInterestSaved = 171800,
  totalTimeSaved = 87,
}: DebtOptimizationWidgetProps) => {
  // Sort debts by interest rate (highest first) for the avalanche method
  const avalancheDebts = [...debts].sort(
    (a, b) => b.interestRate - a.interestRate,
  );

  // Sort debts by balance (lowest first) for the snowball method
  const snowballDebts = [...debts].sort((a, b) => a.balance - b.balance);

  return (
    <WealthCard
      title="Debt Optimization"
      subtitle="AI-powered debt paydown strategies"
      gradient="primary"
      className={className}
      icon={<TrendingDown className="h-5 w-5 text-white" />}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className="text-2xl font-bold">${totalDebt.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Potential Savings</p>
            <div className="flex items-center justify-end gap-2">
              <ArrowDown className="h-4 w-4 text-wealth-success" />
              <p className="text-lg font-semibold text-wealth-success">
                ${totalInterestSaved.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="avalanche">Avalanche Method</TabsTrigger>
            <TabsTrigger value="snowball">Snowball Method</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-wealth-primary/5 border border-wealth-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-wealth-primary/10 mt-1">
                    <Zap className="h-5 w-5 text-wealth-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-wealth-primary mb-1">
                      AI Recommendation
                    </h4>
                    <p className="text-sm">
                      Based on your cash flow and financial goals, we recommend
                      the <strong>Avalanche Method</strong> to save up to{" "}
                      <strong>${totalInterestSaved.toLocaleString()}</strong> in
                      interest and pay off your debt{" "}
                      <strong>{totalTimeSaved} months</strong> sooner.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Avalanche Method</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Pay off highest interest rate debts first
                  </p>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Interest Saved</span>
                    <span className="text-sm font-medium text-wealth-success">
                      ${totalInterestSaved.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Saved</span>
                    <span className="text-sm font-medium text-wealth-success">
                      {totalTimeSaved} months
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Snowball Method</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Pay off smallest balance debts first
                  </p>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Interest Saved</span>
                    <span className="text-sm font-medium text-wealth-success">
                      ${Math.round(totalInterestSaved * 0.85).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Saved</span>
                    <span className="text-sm font-medium text-wealth-success">
                      {Math.round(totalTimeSaved * 0.9)} months
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Create Custom Payoff Plan
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avalanche">
            <DebtMethodContent debts={avalancheDebts} methodName="Avalanche" />
          </TabsContent>

          <TabsContent value="snowball">
            <DebtMethodContent debts={snowballDebts} methodName="Snowball" />
          </TabsContent>
        </Tabs>
      </div>
    </WealthCard>
  );
};

interface DebtMethodContentProps {
  debts: DebtItem[];
  methodName: string;
}

const DebtMethodContent = ({ debts, methodName }: DebtMethodContentProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {methodName === "Avalanche"
          ? "Paying off highest interest rate debts first"
          : "Paying off smallest balance debts first"}
      </p>

      <div className="space-y-4">
        {debts.map((debt) => (
          <div
            key={debt.id}
            className="p-4 rounded-lg border hover:shadow-wealth-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{debt.name}</h4>
              <div
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  "bg-wealth-primary/10 text-wealth-primary",
                )}
              >
                {debt.interestRate}% APR
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-lg font-bold">
                  ${debt.balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Recommended Payment
                </p>
                <p className="text-lg font-bold text-wealth-primary">
                  ${debt.recommendedPayment.toLocaleString()}/mo
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Payoff Progress</span>
                <span className="font-medium">32%</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Standard Payoff</p>
                <p>{debt.payoffDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Optimized Payoff</p>
                <p className="text-wealth-success font-medium">
                  {debt.optimizedPayoffDate}
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Interest Saved</p>
                <p className="text-wealth-success font-medium">
                  ${debt.interestSaved.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Time Saved</p>
                <p className="text-wealth-success font-medium">
                  {debt.timeSaved} months
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebtOptimizationWidget;
