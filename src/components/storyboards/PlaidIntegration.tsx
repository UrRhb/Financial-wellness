import React from "react";
import ConnectAccountSection from "../plaid/ConnectAccountSection";
import { Card, CardContent } from "@/components/ui/card";

export default function PlaidIntegrationStory() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Plaid Integration</h1>
      <Card>
        <CardContent className="pt-6">
          <ConnectAccountSection />
        </CardContent>
      </Card>
    </div>
  );
}
