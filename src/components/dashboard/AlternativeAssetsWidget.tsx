import React from "react";
import WealthCard from "./WealthCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Paintbrush, Car, Watch, Building, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetItem {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  change: number;
  lastValuation: string;
}

interface AlternativeAssetsWidgetProps {
  assets?: {
    art: AssetItem[];
    vehicles: AssetItem[];
    watches: AssetItem[];
    realEstate: AssetItem[];
    other: AssetItem[];
  };
  className?: string;
}

const AlternativeAssetsWidget = ({
  assets = {
    art: [
      {
        name: "Contemporary Collection",
        value: 1250000,
        color: "#8b5cf6",
        icon: <Paintbrush className="h-4 w-4" />,
        change: 12.5,
        lastValuation: "2023-05-15",
      },
      {
        name: "Modern Art Pieces",
        value: 850000,
        color: "#a78bfa",
        icon: <Paintbrush className="h-4 w-4" />,
        change: 8.2,
        lastValuation: "2023-04-20",
      },
    ],
    vehicles: [
      {
        name: "Vintage Collection",
        value: 1850000,
        color: "#2563eb",
        icon: <Car className="h-4 w-4" />,
        change: 15.3,
        lastValuation: "2023-06-10",
      },
      {
        name: "Luxury Vehicles",
        value: 950000,
        color: "#60a5fa",
        icon: <Car className="h-4 w-4" />,
        change: 5.8,
        lastValuation: "2023-05-28",
      },
    ],
    watches: [
      {
        name: "Luxury Timepieces",
        value: 780000,
        color: "#0891b2",
        icon: <Watch className="h-4 w-4" />,
        change: 9.2,
        lastValuation: "2023-06-05",
      },
      {
        name: "Vintage Watches",
        value: 420000,
        color: "#22d3ee",
        icon: <Watch className="h-4 w-4" />,
        change: 6.5,
        lastValuation: "2023-05-12",
      },
    ],
    realEstate: [
      {
        name: "Commercial Properties",
        value: 4500000,
        color: "#16a34a",
        icon: <Building className="h-4 w-4" />,
        change: 7.8,
        lastValuation: "2023-06-15",
      },
      {
        name: "Residential Portfolio",
        value: 3200000,
        color: "#4ade80",
        icon: <Building className="h-4 w-4" />,
        change: 5.2,
        lastValuation: "2023-06-01",
      },
    ],
    other: [
      {
        name: "Wine Collection",
        value: 350000,
        color: "#e11d48",
        icon: <Diamond className="h-4 w-4" />,
        change: 4.5,
        lastValuation: "2023-05-20",
      },
      {
        name: "Jewelry",
        value: 680000,
        color: "#fb7185",
        icon: <Diamond className="h-4 w-4" />,
        change: 10.2,
        lastValuation: "2023-06-08",
      },
    ],
  },
  className,
}: AlternativeAssetsWidgetProps) => {
  // Calculate total value for all alternative assets
  const calculateTotal = (items: AssetItem[]) => {
    return items.reduce((sum, item) => sum + item.value, 0);
  };

  const totalArt = calculateTotal(assets.art);
  const totalVehicles = calculateTotal(assets.vehicles);
  const totalWatches = calculateTotal(assets.watches);
  const totalRealEstate = calculateTotal(assets.realEstate);
  const totalOther = calculateTotal(assets.other);

  const totalAlternativeAssets =
    totalArt + totalVehicles + totalWatches + totalRealEstate + totalOther;

  // Data for the overview pie chart
  const overviewData = [
    { name: "Art", value: totalArt, color: "#8b5cf6" },
    { name: "Vehicles", value: totalVehicles, color: "#2563eb" },
    { name: "Watches", value: totalWatches, color: "#0891b2" },
    { name: "Real Estate", value: totalRealEstate, color: "#16a34a" },
    { name: "Other", value: totalOther, color: "#e11d48" },
  ];

  return (
    <WealthCard
      title="Alternative Assets"
      subtitle="Collectibles, Art, Real Estate & More"
      gradient="secondary"
      className={className}
      icon={<Diamond className="h-5 w-5 text-white" />}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">
              ${totalAlternativeAssets.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Percentage of Net Worth
            </p>
            <p className="text-lg font-semibold text-wealth-secondary">32.5%</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="art">Art</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="watches">Watches</TabsTrigger>
            <TabsTrigger value="realestate">Real Estate</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {overviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `$${Number(value).toLocaleString()}`,
                        "Value",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {overviewData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${item.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((item.value / totalAlternativeAssets) * 100).toFixed(
                          1,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="art">
            <AssetCategoryContent items={assets.art} total={totalArt} />
          </TabsContent>

          <TabsContent value="vehicles">
            <AssetCategoryContent
              items={assets.vehicles}
              total={totalVehicles}
            />
          </TabsContent>

          <TabsContent value="watches">
            <AssetCategoryContent items={assets.watches} total={totalWatches} />
          </TabsContent>

          <TabsContent value="realestate">
            <AssetCategoryContent
              items={assets.realEstate}
              total={totalRealEstate}
            />
          </TabsContent>

          <TabsContent value="other">
            <AssetCategoryContent items={assets.other} total={totalOther} />
          </TabsContent>
        </Tabs>
      </div>
    </WealthCard>
  );
};

interface AssetCategoryContentProps {
  items: AssetItem[];
  total: number;
}

const AssetCategoryContent = ({ items, total }: AssetCategoryContentProps) => {
  // Data for the category pie chart
  const categoryData = items.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Value",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border hover:shadow-wealth-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  {item.icon}
                </div>
                <h4 className="font-medium">{item.name}</h4>
              </div>
              <div
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  item.change > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                )}
              >
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold">
                  ${item.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}% of category
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last valuation</p>
                <p className="text-sm">{item.lastValuation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlternativeAssetsWidget;
