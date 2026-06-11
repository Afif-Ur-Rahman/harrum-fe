import { useState } from "react";

export const useDashboard = () => {
  const statusOptions = [
    { value: "Today", label: "Today" },
    { value: "Current week", label: "Current week" },
    { value: "Current Month", label: "Current Month" },
    { value: "custom", label: "Custom" },
  ];
  const [selectedStatus, setSelectedStatus] = useState("Current Month");

  return {
    statusOptions,
    selectedStatus,
    setSelectedStatus,
  };
};
