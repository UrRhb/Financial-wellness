import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NetWorthWidget from "./NetWorthWidget";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface NetWorthPanelProps {
  visible?: boolean;
}

const NetWorthPanel: React.FC<NetWorthPanelProps> = ({ visible = false }) => {
  const [timeRange, setTimeRange] = useState("1Y");
  const [assetView, setAssetView] = useState("all");

  // Mock data for the charts
  const monthlyNetWorthData = [
    { date: "Jan", assets: 120000, liabilities: 45000, netWorth: 75000 },
    { date: "Feb", assets: 125000, liabilities: 44000, netWorth: 81000 },
    { date: "Mar", assets: 130000, liabilities: 43000, netWorth: 87000 },
    { date: "Apr", assets: 132000, liabilities: 42000, netWorth: 90000 },
    { date: "May", assets: 135000, liabilities: 41000, netWorth: 94000 },
    { date: "Jun", assets: 140000, liabilities: 40000, netWorth: 100000 },
    { date: "Jul", assets: 145000, liabilities: 39000, netWorth: 106000 },
    { date: "Aug", assets: 150000, liabilities: 38000, netWorth: 112000 },
    { date: "Sep", assets: 155000, liabilities: 37000, netWorth: 118000 },
    { date: "Oct", assets: 160000, liabilities: 36000, netWorth: 124000 },
    { date: "Nov", assets: 165000, liabilities: 35000, netWorth: 130000 },
    { date: "Dec", assets: 170000, liabilities: 34000, netWorth: 136000 },
  ];

  const assetBreakdownData = [
    { name: "Cash", value: 35000, color: "#4ade80" },
    { name: "Investments", value: 85000, color: "#60a5fa" },
    { name: "Real Estate", value: 45000, color: "#f59e0b" },
    { name: "Other Assets", value: 5000, color: "#8b5cf6" },
  ];

  const liabilityBreakdownData = [
    { name: "Mortgage", value: 25000, color: "#f87171" },
    { name: "Student Loans", value: 5000, color: "#fb923c" },
    { name: "Credit Cards", value: 3000, color: "#fbbf24" },
    { name: "Auto Loan", value: 1000, color: "#a3e635" },
  ];

  const growthTrendData = [
    { month: "Jan", growth: 2.5 },
    { month: "Feb", growth: 3.2 },
    { month: "Mar", growth: 1.8 },
    { month: "Apr", growth: 2.1 },
    { month: "May", growth: 3.5 },
    { month: "Jun", growth: 2.8 },
    { month: "Jul", growth: 3.1 },
    { month: "Aug", growth: 2.9 },
    { month: "Sep", growth: 3.3 },
    { month: "Oct", growth: 2.7 },
    { month: "Nov", growth: 3.0 },
    { month: "Dec", growth: 3.4 },
  ];

  if (!visible) return null;

  return (
    <div className="w-full h-full p-6 bg-background overflow-y-auto">
      <div className="flex flex-col space-y-6">
        <DashboardHeader
          title="Net Worth"
          description="Track your assets, liabilities, and overall financial growth"
        />
        <div className="flex space-x-4">
          <Tabs
            value={timeRange}
            onValueChange={setTimeRange}
            className="w-[300px]"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="6M">6M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={assetView} onValueChange={setAssetView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="cash">Cash Only</SelectItem>
              <SelectItem value="investments">Investments Only</SelectItem>
              <SelectItem value="property">Property Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Net Worth Chart */}
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Net Worth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyNetWorthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    undefined,
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="assets"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Assets"
                />
                <Line
                  type="monotone"
                  dataKey="liabilities"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Liabilities"
                />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Net Worth"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Current Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-bold">$136,000</span>
              <div className="flex items-center text-green-600">
                <span className="text-sm">+$6,000 (4.6%) from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-bold">$170,000</span>
              <div className="flex items-center text-green-600">
                <span className="text-sm">+$5,000 (3.0%) from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <span className="text-3xl font-bold">$34,000</span>
              <div className="flex items-center text-green-600">
                <span className="text-sm">-$1,000 (2.9%) from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset and Liability Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Asset Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {assetBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {assetBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">
                    {item.name}: ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Liability Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={liabilityBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {liabilityBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {liabilityBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">
                    {item.name}: ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trend */}
      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Monthly Growth Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} />
                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetWorthPanel;
