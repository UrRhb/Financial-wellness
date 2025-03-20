import React from "react";
import TopNavigation from "../dashboard/TopNavigation";

export default function TopNavigationStory() {
  const items = [
    { label: "Overview", value: "overview", active: true },
    { label: "Transactions", value: "transactions", active: false },
    { label: "Budget", value: "budget", active: false },
    { label: "Recurring", value: "recurring", active: false },
    { label: "Saving Goals", value: "saving-goals", active: false },
  ];

  return (
    <div className="p-4 bg-slate-100">
      <TopNavigation items={items} onSelect={(value) => console.log(value)} />
    </div>
  );
}
