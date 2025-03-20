import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlaid } from "@/context/PlaidContext";
import PlaidLinkButton from "./PlaidLinkButton";
import {
  Building2,
  CheckCircle,
  Wallet,
  CreditCard,
  Landmark,
  RefreshCw,
} from "lucide-react";
import { usePlaidAPI } from "@/hooks/usePlaidAPI";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../dashboard/LoadingSpinner";

const ConnectAccountSection = () => {
  const { isConnected, connectedAccounts } = usePlaid();

  const { getAccounts, isLoading } = usePlaidAPI();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch accounts on component mount if connected
  useEffect(() => {
    if (isConnected && connectedAccounts.length === 0) {
      getAccounts();
    }
  }, [isConnected, connectedAccounts.length, getAccounts]);

  // Handle refreshing accounts
  const handleRefreshAccounts = async () => {
    setRefreshing(true);
    await getAccounts();
    setRefreshing(false);
  };

  // Get the appropriate icon based on account type
  const getAccountIcon = (type: string, subtype?: string) => {
    if (type === "depository") {
      return <Building2 className="h-5 w-5 text-primary" />;
    } else if (type === "credit") {
      return <CreditCard className="h-5 w-5 text-primary" />;
    } else if (type === "investment") {
      return <Landmark className="h-5 w-5 text-primary" />;
    } else {
      return <Wallet className="h-5 w-5 text-primary" />;
    }
  };

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "--";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Financial Accounts</CardTitle>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAccounts}
            disabled={refreshing}
          >
            {refreshing ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : isConnected && connectedAccounts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Your accounts are connected</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                      {getAccountIcon(account.type, account.subtype)}
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.institution} •••• {account.mask}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(account.balance?.current)}
                    </p>
                    {account.balance?.available !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(account.balance.available)} available
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <PlaidLinkButton
                buttonText="Connect Another Account"
                variant="outline"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium">Connect your financial accounts</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Connect your bank accounts, credit cards, and investment
                accounts to see all your finances in one place.
              </p>
            </div>
            <PlaidLinkButton buttonText="Connect Your Accounts" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectAccountSection;
