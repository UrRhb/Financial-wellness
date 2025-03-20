import React from "react";
import DashboardHeader from "./DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import NetWorthWidget from "./NetWorthWidget";
import AccountSummaryWidget from "./AccountSummaryWidget";
import BudgetWidget from "./BudgetWidget";
import CashFlowWidget from "./CashFlowWidget";
import RecentTransactionsWidget from "./RecentTransactionsWidget";
import GlobalAccountsWidget from "./GlobalAccountsWidget";
import AlternativeAssetsWidget from "./AlternativeAssetsWidget";
import DebtOptimizationWidget from "./DebtOptimizationWidget";
import RetirementPlanningWidget from "./RetirementPlanningWidget";
import EquityCompensationWidget from "./EquityCompensationWidget";

interface WealthManagementDashboardProps {
  isVisible?: boolean;
}

const WealthManagementDashboard: React.FC<WealthManagementDashboardProps> = ({
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <div className="w-full h-full p-6 bg-background overflow-y-auto">
      <DashboardHeader
        title="Wealth Management Dashboard"
        description="Your comprehensive financial overview and wealth management tools."
      />

      <Tabs defaultValue="overview" className="w-full mt-6">
        <TabsList className="grid grid-cols-3 w-[400px] mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wealth">Wealth</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top row widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-[300px]">
              <NetWorthWidget />
            </div>
            <div className="h-[300px]">
              <AccountSummaryWidget />
            </div>
          </div>

          {/* Middle row widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-[300px]">
              <BudgetWidget />
            </div>
            <div className="h-[300px]">
              <CashFlowWidget />
            </div>
          </div>

          {/* Bottom row - full width widget */}
          <div className="mb-6">
            <RecentTransactionsWidget />
          </div>
        </TabsContent>

        <TabsContent value="wealth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GlobalAccountsWidget className="h-[500px]" />
            <AlternativeAssetsWidget className="h-[500px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EquityCompensationWidget className="h-[500px]" />
            <DebtOptimizationWidget className="h-[500px]" />
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <div className="mb-6">
            <RetirementPlanningWidget className="h-[600px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Tax Optimization</h3>
              <p className="text-muted-foreground">
                Advanced tax planning tools and strategies coming soon.
              </p>
            </Card>
            <Card className="p-6 h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Estate Planning</h3>
              <p className="text-muted-foreground">
                Comprehensive estate planning and wealth transfer tools coming
                soon.
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WealthManagementDashboard;
