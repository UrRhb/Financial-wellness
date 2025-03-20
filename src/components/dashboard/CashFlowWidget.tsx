import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CashFlowWidgetProps {
  title?: string;
  incomeThisMonth?: number;
  expensesThisMonth?: number;
  incomeLastMonth?: number;
  expensesLastMonth?: number;
  yearToDateSavings?: number;
}

const CashFlowWidget = ({
  title = "CASH FLOW",
  incomeThisMonth = 4530,
  expensesThisMonth = 5798,
  incomeLastMonth = 2347,
  expensesLastMonth = 2347,
  yearToDateSavings = 2589,
}: CashFlowWidgetProps) => {
  const thisMonthBalance = incomeThisMonth - expensesThisMonth;

  return (
    <Card className="w-full h-full bg-white shadow-wealth-card hover:shadow-wealth-card-hover transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="text-sm">
          <span className="text-red-600 font-medium">
            -${Math.abs(thisMonthBalance).toLocaleString()}
          </span>
          <span className="text-gray-500 ml-1">This Month</span>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Income this month</p>
            <div className="flex items-center">
              <p className="text-lg font-bold">
                ${incomeThisMonth.toLocaleString()}
              </p>
              <div className="flex-1 h-4 bg-wealth-primary-light/30 ml-4 rounded-full">
                <div
                  className="h-full bg-wealth-primary rounded-full"
                  style={{
                    width: `${(incomeThisMonth / (incomeThisMonth + 2000)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last month ${incomeLastMonth.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Expenses this month</p>
            <div className="flex items-center">
              <p className="text-lg font-bold">
                ${expensesThisMonth.toLocaleString()}
              </p>
              <div className="flex-1 h-4 bg-red-100/50 ml-4 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${(expensesThisMonth / (expensesThisMonth + 1000)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last month ${expensesLastMonth.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              upto ${yearToDateSavings.toLocaleString()} so far this year
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowWidget;
