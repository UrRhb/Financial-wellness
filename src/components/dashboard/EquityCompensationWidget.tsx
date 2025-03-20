import React from "react";
import WealthCard from "./WealthCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Briefcase, TrendingUp, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquityGrant {
  id: string;
  company: string;
  grantType: "ISO" | "NSO" | "RSU" | "ESPP" | "PSU";
  grantDate: string;
  sharesTotal: number;
  sharesVested: number;
  currentPrice: number;
  grantPrice: number;
  vestingSchedule: {
    date: string;
    shares: number;
    estimatedValue: number;
  }[];
  estimatedValue: number;
  unrealizedGain: number;
  taxImpact: number;
}

interface EquityCompensationWidgetProps {
  grants?: EquityGrant[];
  className?: string;
}

const EquityCompensationWidget = ({
  grants = [
    {
      id: "1",
      company: "Tech Innovators Inc.",
      grantType: "RSU" as const,
      grantDate: "2021-06-15",
      sharesTotal: 5000,
      sharesVested: 2500,
      currentPrice: 185.75,
      grantPrice: 120.5,
      vestingSchedule: [
        { date: "2022-06-15", shares: 1250, estimatedValue: 232187.5 },
        { date: "2023-06-15", shares: 1250, estimatedValue: 232187.5 },
        { date: "2024-06-15", shares: 1250, estimatedValue: 232187.5 },
        { date: "2025-06-15", shares: 1250, estimatedValue: 232187.5 },
      ],
      estimatedValue: 928750,
      unrealizedGain: 326250,
      taxImpact: 121875,
    },
    {
      id: "2",
      company: "Future Mobility Co.",
      grantType: "ISO" as const,
      grantDate: "2022-03-10",
      sharesTotal: 2000,
      sharesVested: 500,
      currentPrice: 420.3,
      grantPrice: 280.75,
      vestingSchedule: [
        { date: "2023-03-10", shares: 500, estimatedValue: 210150 },
        { date: "2024-03-10", shares: 500, estimatedValue: 210150 },
        { date: "2025-03-10", shares: 500, estimatedValue: 210150 },
        { date: "2026-03-10", shares: 500, estimatedValue: 210150 },
      ],
      estimatedValue: 840600,
      unrealizedGain: 279100,
      taxImpact: 69775,
    },
    {
      id: "3",
      company: "Quantum Ventures",
      grantType: "PSU" as const,
      grantDate: "2022-09-01",
      sharesTotal: 1500,
      sharesVested: 0,
      currentPrice: 95.2,
      grantPrice: 75.8,
      vestingSchedule: [
        { date: "2023-09-01", shares: 500, estimatedValue: 47600 },
        { date: "2024-09-01", shares: 500, estimatedValue: 47600 },
        { date: "2025-09-01", shares: 500, estimatedValue: 47600 },
      ],
      estimatedValue: 142800,
      unrealizedGain: 29100,
      taxImpact: 10912.5,
    },
  ],
  className,
}: EquityCompensationWidgetProps) => {
  // Calculate totals
  const totalValue = grants.reduce(
    (sum, grant) => sum + grant.estimatedValue,
    0,
  );
  const totalVestedValue = grants.reduce(
    (sum, grant) => sum + grant.sharesVested * grant.currentPrice,
    0,
  );
  const totalUnvestedValue = totalValue - totalVestedValue;

  // Generate vesting schedule data for the chart
  const generateVestingData = () => {
    const vestingMap = new Map();

    grants.forEach((grant) => {
      grant.vestingSchedule.forEach((schedule) => {
        const year = schedule.date.substring(0, 4);
        const existingValue = vestingMap.get(year) || 0;
        vestingMap.set(year, existingValue + schedule.estimatedValue);
      });
    });

    return Array.from(vestingMap.entries()).map(([year, value]) => ({
      year,
      value,
    }));
  };

  const vestingData = generateVestingData();

  // Generate price history data (mock data for demonstration)
  const generatePriceHistoryData = () => {
    const data = [];
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;

    for (let year = startYear; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        if (year === currentYear && month > new Date().getMonth() + 1) break;

        data.push({
          date: `${year}-${month.toString().padStart(2, "0")}-01`,
          "Tech Innovators Inc.": Math.round(
            120.5 *
              (1 + (Math.random() * 0.5 + 0.5) * ((year - startYear) / 3)),
          ),
          "Future Mobility Co.": Math.round(
            280.75 *
              (1 + (Math.random() * 0.5 + 0.3) * ((year - startYear) / 3)),
          ),
          "Quantum Ventures": Math.round(
            75.8 * (1 + (Math.random() * 0.3 + 0.2) * ((year - startYear) / 3)),
          ),
        });
      }
    }

    return data;
  };

  const priceHistoryData = generatePriceHistoryData();

  // Get grant type badge color
  const getGrantTypeColor = (type: string) => {
    switch (type) {
      case "RSU":
        return "bg-blue-100 text-blue-800";
      case "ISO":
        return "bg-purple-100 text-purple-800";
      case "NSO":
        return "bg-green-100 text-green-800";
      case "ESPP":
        return "bg-amber-100 text-amber-800";
      case "PSU":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <WealthCard
      title="Equity Compensation"
      subtitle="Stock options, RSUs, and equity grants"
      gradient="primary"
      className={className}
      icon={<Briefcase className="h-5 w-5 text-white" />}
      action={
        <Button
          size="sm"
          variant="outline"
          className="text-white border-white/30 hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Grant
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Equity Value</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Vested Value</p>
            <p className="text-2xl font-bold">
              ${totalVestedValue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Unvested Value</p>
            <p className="text-2xl font-bold">
              ${totalUnvestedValue.toLocaleString()}
            </p>
          </div>
        </div>

        <Tabs defaultValue="grants" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="grants">Equity Grants</TabsTrigger>
            <TabsTrigger value="vesting">Vesting Schedule</TabsTrigger>
            <TabsTrigger value="performance">Price Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="grants">
            <div className="space-y-4">
              {grants.map((grant) => {
                const vestedPercentage = Math.round(
                  (grant.sharesVested / grant.sharesTotal) * 100,
                );
                const vestedValue = grant.sharesVested * grant.currentPrice;

                return (
                  <div
                    key={grant.id}
                    className="p-4 rounded-lg border hover:shadow-wealth-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{grant.company}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded-full",
                              getGrantTypeColor(grant.grantType),
                            )}
                          >
                            {grant.grantType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Granted: {grant.grantDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${grant.estimatedValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {grant.sharesTotal.toLocaleString()} shares
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Price
                        </p>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">
                            ${grant.currentPrice.toFixed(2)}
                          </p>
                          {grant.currentPrice > grant.grantPrice && (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Grant Price
                        </p>
                        <p className="font-medium">
                          ${grant.grantPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Vesting Progress</span>
                        <span>
                          {grant.sharesVested.toLocaleString()} /{" "}
                          {grant.sharesTotal.toLocaleString()} shares (
                          {vestedPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-wealth-primary h-2 rounded-full"
                          style={{ width: `${vestedPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vested Value</p>
                        <p className="font-medium">
                          ${vestedValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Unrealized Gain</p>
                        <p className="font-medium text-green-600">
                          ${grant.unrealizedGain.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. Tax Impact</p>
                        <p className="font-medium text-amber-600">
                          ${grant.taxImpact.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium mb-2">
                        Upcoming Vesting Events
                      </p>
                      <div className="space-y-2">
                        {grant.vestingSchedule
                          .filter(
                            (event) =>
                              new Date(event.date) > new Date() &&
                              new Date(event.date) <
                                new Date(
                                  new Date().setFullYear(
                                    new Date().getFullYear() + 1,
                                  ),
                                ),
                          )
                          .slice(0, 2)
                          .map((event, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-wealth-primary" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span>
                                  {event.shares.toLocaleString()} shares
                                </span>
                                <span className="font-medium">
                                  ~${event.estimatedValue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="vesting">
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vestingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${Number(value).toLocaleString()}`,
                        "Vesting Value",
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--wealth-primary))"
                      name="Vesting Value"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Upcoming Vesting Events</h4>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Company</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Shares</div>
                    <div className="col-span-3">Est. Value</div>
                  </div>
                  {grants
                    .flatMap((grant) =>
                      grant.vestingSchedule
                        .filter((event) => new Date(event.date) > new Date())
                        .map((event) => ({
                          date: event.date,
                          company: grant.company,
                          type: grant.grantType,
                          shares: event.shares,
                          value: event.estimatedValue,
                        })),
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                    )
                    .slice(0, 5)
                    .map((event, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 p-3 border-t text-sm"
                      >
                        <div className="col-span-2">{event.date}</div>
                        <div className="col-span-3">{event.company}</div>
                        <div className="col-span-2">
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded-full",
                              getGrantTypeColor(event.type),
                            )}
                          >
                            {event.type}
                          </span>
                        </div>
                        <div className="col-span-2">
                          {event.shares.toLocaleString()}
                        </div>
                        <div className="col-span-3 font-medium">
                          ${event.value.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={priceHistoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Tech Innovators Inc."
                      stroke="#4F46E5"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Future Mobility Co."
                      stroke="#10B981"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Quantum Ventures"
                      stroke="#F59E0B"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {grants.map((grant) => {
                  const growthPercentage =
                    ((grant.currentPrice - grant.grantPrice) /
                      grant.grantPrice) *
                    100;
                  return (
                    <div key={grant.id} className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">{grant.company}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Current
                          </p>
                          <p className="font-medium">
                            ${grant.currentPrice.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grant</p>
                          <p className="font-medium">
                            ${grant.grantPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Growth</p>
                        <p
                          className={cn(
                            "font-medium",
                            growthPercentage >= 0
                              ? "text-green-600"
                              : "text-red-600",
                          )}
                        >
                          {growthPercentage >= 0 ? "+" : ""}
                          {growthPercentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </WealthCard>
  );
};

export default EquityCompensationWidget;
