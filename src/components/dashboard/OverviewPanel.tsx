import React from "react";
import WealthManagementDashboard from "./WealthManagementDashboard";

interface OverviewPanelProps {
  isVisible?: boolean;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return <WealthManagementDashboard isVisible={isVisible} />;
};

export default OverviewPanel;
