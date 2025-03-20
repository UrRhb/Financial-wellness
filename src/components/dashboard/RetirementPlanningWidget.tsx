import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Sparkles, Target, Calendar, Sliders } from "lucide-react";

interface RetirementPlanningWidgetProps {
  currentAge?: number;
  retirementAge?: number;
  currentSavings?: number;
  monthlyContribution?: number;
  targetAmount?: number;
  projectedAmount?: number;
  className?: string;
}

const RetirementPlanningWidget = ({
  currentAge = 42,
  retirementAge = 65,
  currentSavings = 850000,
  monthlyContribution = 5000,
  targetAmount = 3500000,
  projectedAmount = 4200000,
  className,
}: RetirementPlanningWidgetProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((currentSavings / targetAmount) * 100),
    100,
  );

  // Calculate years remaining
  const yearsRemaining = retirementAge - currentAge;

  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    let currentYear = new Date().getFullYear();
    let savings = currentSavings;

    for (let age = currentAge; age <= retirementAge; age++) {
      // Simple compound interest calculation (7% annual return)
      savings = savings * 1.07 + monthlyContribution * 12;
      data.push({
        age: age,
        year: currentYear,
        projected: Math.round(savings),
        target: Math.round(
          targetAmount * ((age - currentAge) / (retirementAge - currentAge)),
        ),
      });
      currentYear++;
    }

    return data;
  };

  const projectionData = generateProjectionData();

  // Generate monthly contribution impact data
  const generateContributionImpactData = () => {
    const data = [];
    const baseContribution = monthlyContribution;

    // Show impact of different contribution levels
    [-500, -250, 0, 250, 500, 1000].forEach((adjustment) => {
      const newContribution = baseContribution + adjustment;
      if (newContribution <= 0) return;

      let savings = currentSavings;
      for (let year = 0; year < yearsRemaining; year++) {
        savings = savings * 1.07 + newContribution * 12;
      }

      data.push({
        contribution: newContribution,
        result: Math.round(savings),
        difference: adjustment,
      });
    });

    return data;
  };

  const contributionImpactData = generateContributionImpactData();

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-100">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle>AI Retirement Planning</CardTitle>
            <p className="text-sm text-muted-foreground">
              Personalized retirement projections
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-wealth-secondary" />
                <h4 className="font-medium">Time Horizon</h4>
              </div>
              <p className="text-2xl font-bold">{yearsRemaining} years</p>
              <p className="text-sm text-muted-foreground">
                Current age: {currentAge} | Target: {retirementAge}
              </p>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-wealth-secondary" />
                <h4 className="font-medium">Target Amount</h4>
              </div>
              <p className="text-2xl font-bold">
                ${targetAmount.toLocaleString()}
              </p>
              <div className="space-y-1 mt-1">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {progressPercentage}% funded
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="h-4 w-4 text-wealth-secondary" />
                <h4 className="font-medium">Monthly Contribution</h4>
              </div>
              <p className="text-2xl font-bold">
                ${monthlyContribution.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                ${(monthlyContribution * 12).toLocaleString()} annually
              </p>
            </div>
          </div>

          <Tabs defaultValue="projection" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="projection">Projection</TabsTrigger>
              <TabsTrigger value="contribution">
                Contribution Impact
              </TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="projection">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={projectionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="age"
                        label={{
                          value: "Age",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value / 1000000}M`}
                        label={{
                          value: "Portfolio Value",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `$${Number(value).toLocaleString()}`,
                          undefined,
                        ]}
                        labelFormatter={(label) => `Age: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="projected"
                        stroke="hsl(var(--wealth-secondary))"
                        fill="hsl(var(--wealth-secondary))"
                        fillOpacity={0.2}
                        name="Projected Savings"
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="hsl(var(--wealth-primary))"
                        fill="hsl(var(--wealth-primary))"
                        fillOpacity={0.1}
                        name="Target Path"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 rounded-lg bg-wealth-secondary/5 border border-wealth-secondary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-wealth-secondary/10 mt-1">
                      <Sparkles className="h-5 w-5 text-wealth-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-wealth-secondary mb-1">
                        AI Projection
                      </h4>
                      <p className="text-sm">
                        Based on your current savings rate and investment
                        strategy, you're projected to have{" "}
                        <strong>${projectedAmount.toLocaleString()}</strong> by
                        age {retirementAge}, exceeding your target by{" "}
                        <strong>
                          ${(projectedAmount - targetAmount).toLocaleString()}
                        </strong>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contribution">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={contributionImpactData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="contribution"
                        label={{
                          value: "Monthly Contribution ($)",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value / 1000000}M`}
                        label={{
                          value: "Projected Amount",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `$${Number(value).toLocaleString()}`,
                          undefined,
                        ]}
                        labelFormatter={(label) => `$${label}/month`}
                      />
                      <Line
                        type="monotone"
                        dataKey="result"
                        stroke="hsl(var(--wealth-secondary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Projected Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contributionImpactData
                    .filter((item) => item.difference !== 0)
                    .map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <h4 className="font-medium mb-1">
                          ${item.contribution.toLocaleString()}/month
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.difference > 0 ? "+" : ""}${item.difference}
                          /month from current
                        </p>
                        <p className="text-lg font-bold">
                          ${item.result.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.result > projectedAmount ? "+" : ""}$
                          {(item.result - projectedAmount).toLocaleString()}{" "}
                          from projection
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scenarios">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Early Retirement (60)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Required Monthly</span>
                        <span className="text-sm font-medium">$7,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Projected Amount</span>
                        <span className="text-sm font-medium">$3,100,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Probability of Success</span>
                        <span className="text-sm font-medium text-amber-500">
                          78%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Conservative Growth</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Annual Return</span>
                        <span className="text-sm font-medium">5% (vs 7%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Projected Amount</span>
                        <span className="text-sm font-medium">$3,400,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Shortfall</span>
                        <span className="text-sm font-medium text-red-500">
                          -$800,000
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Aggressive Growth</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Annual Return</span>
                        <span className="text-sm font-medium">9% (vs 7%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Projected Amount</span>
                        <span className="text-sm font-medium">$5,200,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Surplus</span>
                        <span className="text-sm font-medium text-green-500">
                          +$1,000,000
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Inflation Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">High Inflation</span>
                        <span className="text-sm font-medium">
                          4% (vs 2.5%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Purchasing Power</span>
                        <span className="text-sm font-medium">$2,800,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Required Adjustment</span>
                        <span className="text-sm font-medium text-amber-500">
                          +$800/month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button className="w-full">
                    <Sliders className="h-4 w-4 mr-2" />
                    Create Custom Scenario
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetirementPlanningWidget;
