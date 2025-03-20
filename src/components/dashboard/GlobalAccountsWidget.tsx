import React from "react";
import WealthCard from "./WealthCard";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Plus,
  ChevronRight,
  DollarSign,
  Euro,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalAccount {
  id: string;
  name: string;
  institution: string;
  country: string;
  currency: string;
  balance: number;
  currencySymbol: string;
  exchangeRate: number;
  lastUpdated: string;
  icon: React.ReactNode;
}

interface GlobalAccountsWidgetProps {
  accounts?: GlobalAccount[];
  className?: string;
}

const GlobalAccountsWidget = ({
  accounts = [
    {
      id: "1",
      name: "International Investment Account",
      institution: "UBS",
      country: "Switzerland",
      currency: "CHF",
      balance: 1250000,
      currencySymbol: "CHF",
      exchangeRate: 1.12,
      lastUpdated: "2023-06-15",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      id: "2",
      name: "European Growth Fund",
      institution: "Deutsche Bank",
      country: "Germany",
      currency: "EUR",
      balance: 850000,
      currencySymbol: "€",
      exchangeRate: 1.08,
      lastUpdated: "2023-06-15",
      icon: <Euro className="h-4 w-4" />,
    },
    {
      id: "3",
      name: "Asian Markets Portfolio",
      institution: "Nomura",
      country: "Japan",
      currency: "JPY",
      balance: 120000000,
      currencySymbol: "¥",
      exchangeRate: 0.0072,
      lastUpdated: "2023-06-14",
      icon: <Banknote className="h-4 w-4" />,
    },
  ],
  className,
}: GlobalAccountsWidgetProps) => {
  // Calculate total in USD
  const totalUSD = accounts.reduce(
    (sum, account) => sum + account.balance * account.exchangeRate,
    0,
  );

  return (
    <WealthCard
      title="Global Financial Accounts"
      subtitle="Multi-currency accounts across institutions"
      gradient="primary"
      className={className}
      icon={<Globe className="h-5 w-5 text-white" />}
      action={
        <Button
          size="sm"
          variant="outline"
          className="text-white border-white/30 hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Account
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Value (USD)</p>
            <p className="text-2xl font-bold">${totalUSD.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => {
            const usdValue = account.balance * account.exchangeRate;

            return (
              <div
                key={account.id}
                className="p-4 rounded-lg border hover:shadow-wealth-sm transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn("p-2 rounded-full bg-wealth-primary/10")}
                    >
                      {account.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {account.institution} • {account.country}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">
                      {account.currencySymbol}{" "}
                      {account.balance.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${usdValue.toLocaleString()} USD
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Exchange Rate
                    </p>
                    <p className="text-sm">
                      1 {account.currency} = ${account.exchangeRate} USD
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="w-full">
            View All Global Accounts
          </Button>
        </div>
      </div>
    </WealthCard>
  );
};

export default GlobalAccountsWidget;
