import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { ChevronDown } from "lucide-react";

interface NetWorthWidgetProps {
  netWorth?: number;
  netWorthChange?: number;
  netWorthChangePercentage?: number;
  timeRange?: string;
  chartData?: Array<{
    date: string;
    assets: number;
    liabilities: number;
    netWorth: number;
  }>;
}

const defaultChartData = [
  { date: "Jan", assets: 120000, liabilities: 45000, netWorth: 75000 },
  { date: "Feb", assets: 125000, liabilities: 44000, netWorth: 81000 },
  { date: "Mar", assets: 130000, liabilities: 43000, netWorth: 87000 },
  { date: "Apr", assets: 132000, liabilities: 42000, netWorth: 90000 },
  { date: "May", assets: 135000, liabilities: 41000, netWorth: 94000 },
  { date: "Jun", assets: 140000, liabilities: 40000, netWorth: 100000 },
];

const NetWorthWidget: React.FC<NetWorthWidgetProps> = ({
  netWorth = 498041.74,
  netWorthChange = 7089,
  netWorthChangePercentage = 1.44,
  timeRange = "This Month",
  chartData = defaultChartData,
}) => {
  return (
    <Card className="w-full h-full bg-white shadow-wealth-card hover:shadow-wealth-card-hover transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
        <CardTitle className="text-xl font-bold">NET WORTH</CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <span>{timeRange}</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-2">
            ${netWorth.toLocaleString()}
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-sm">This Month</span>
            <div className="flex items-center">
              <span className="text-sm text-green-600 font-medium">
                +${netWorthChange.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 ml-2">1-Day</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="netWorthGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--wealth-primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--wealth-primary))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value / 1000}k`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 10000", "dataMax + 10000"]}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()}`,
                  undefined,
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="hsl(var(--wealth-primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#netWorthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-xs text-gray-500">90-Day</span>
            <span className="text-sm text-green-600 font-medium ml-2">
              +${netWorthChange.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthWidget;
