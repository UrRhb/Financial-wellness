import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import OverviewPanel from "./OverviewPanel";
import AccountsPanel from "./AccountsPanel";
import NetWorthPanel from "./NetWorthPanel";
import BudgetPanel from "./BudgetPanel";
import CashFlowPanel from "./CashFlowPanel";
import ProfilePanel from "./ProfilePanel";
import TopNavigation from "./TopNavigation";
import FinancialWellnessPanel from "./FinancialWellnessPanel";
import RetirementPlanningWidget from "./RetirementPlanningWidget";
import TransactionPanel from "./TransactionPanel";

export type DashboardSection =
  | "home"
  | "financial-wellness"
  | "overview"
  | "accounts"
  | "net-worth"
  | "budget"
  | "cash-flow"
  | "profile"
  | "transactions"
  | "recurring"
  | "saving-goals"
  | "retirement";

export type FinancialTab =
  | "overview"
  | "transactions"
  | "budget"
  | "recurring"
  | "saving-goals"
  | "retirement";

interface DashboardLayoutProps {
  defaultSection?: DashboardSection;
}

const DashboardLayout = ({
  defaultSection = "financial-wellness",
}: DashboardLayoutProps) => {
  // State to track viewport height for fixed layout
  const [viewportHeight, setViewportHeight] = useState("100vh");

  // Update viewport height on resize
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    // Set initial height
    updateViewportHeight();

    // Add event listener
    window.addEventListener("resize", updateViewportHeight);

    // Cleanup
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>(defaultSection);
  const [activeTab, setActiveTab] = useState<FinancialTab>("overview");

  const navItems = [
    { label: "Overview", value: "overview", active: activeTab === "overview" },
    {
      label: "Transactions",
      value: "transactions",
      active: activeTab === "transactions",
    },
    { label: "Budget", value: "budget", active: activeTab === "budget" },
    {
      label: "Cash Flow",
      value: "cash-flow",
      active: activeTab === "cash-flow",
    },
    {
      label: "Saving Goals",
      value: "saving-goals",
      active: activeTab === "saving-goals",
    },
    {
      label: "Retirement",
      value: "retirement",
      active: activeTab === "retirement",
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value as FinancialTab);
  };

  return (
    <div
      className="flex w-full bg-wealth-neutral-50 overflow-hidden"
      style={{ height: viewportHeight }}
    >
      <Sidebar
        className="h-screen flex-shrink-0"
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 overflow-auto">
        {activeSection === "home" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Home</h1>
            <p>Welcome to your financial dashboard.</p>
          </div>
        )}

        {activeSection === "financial-wellness" && (
          <div className="p-6">
            <TopNavigation
              items={navItems}
              onSelect={handleTabChange}
              className="mb-6"
            />

            {activeTab === "overview" && <FinancialWellnessPanel />}
            {activeTab === "transactions" && (
              <TransactionPanel height={viewportHeight} />
            )}
            {activeTab === "budget" && <BudgetPanel visible={true} />}
            {activeTab === "cash-flow" && <CashFlowPanel visible={true} />}
            {activeTab === "saving-goals" && (
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Saving Goals</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Home Down Payment",
                        target: 100000,
                        current: 45000,
                        deadline: "Dec 2025",
                        color: "bg-blue-500",
                      },
                      {
                        title: "Emergency Fund",
                        target: 30000,
                        current: 24000,
                        deadline: "Aug 2023",
                        color: "bg-green-500",
                      },
                      {
                        title: "Vacation",
                        target: 8000,
                        current: 3200,
                        deadline: "Jul 2024",
                        color: "bg-purple-500",
                      },
                    ].map((goal, index) => (
                      <div
                        key={index}
                        className="p-6 bg-white border rounded-lg shadow-sm"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          {goal.title}
                        </h3>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500">Target</span>
                          <span className="font-medium">
                            ${goal.target.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500">Current</span>
                          <span className="font-medium">
                            ${goal.current.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            Deadline
                          </span>
                          <span className="font-medium">{goal.deadline}</span>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`${goal.color} h-2.5 rounded-full`}
                              style={{
                                width: `${(goal.current / goal.target) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              ${goal.current.toLocaleString()}
                            </span>
                            <span className="text-xs font-medium">
                              {Math.round((goal.current / goal.target) * 100)}%
                            </span>
                            <span className="text-xs text-gray-500">
                              ${goal.target.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "retirement" && (
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <RetirementPlanningWidget className="h-auto" />
              </div>
            )}
          </div>
        )}

        <OverviewPanel isVisible={activeSection === "overview"} />
        <NetWorthPanel visible={activeSection === "net-worth"} />
        <CashFlowPanel visible={activeSection === "cash-flow"} />
        <ProfilePanel visible={activeSection === "profile"} />
      </div>
    </div>
  );
};

export default DashboardLayout;
