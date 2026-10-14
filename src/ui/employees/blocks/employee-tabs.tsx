"use client";

import { Employees, EmployeeRole } from "@/types/employees";

import { EMPLOYEE_SECTIONS } from "../constants";

type EmployeeTab = "all" | EmployeeRole;

interface EmployeeTabsProps {
  employees: Employees;
  filteredEmployees: Employees;
  activeTab: EmployeeTab;
  onTabChange: (tab: EmployeeTab) => void;
}

export const EmployeeTabs = ({
  employees,
  filteredEmployees,
  activeTab,
  onTabChange,
}: EmployeeTabsProps) => {
  const allCount = Object.values(filteredEmployees).reduce(
    (total, group) => total + group.length,
    0,
  );

  const availableTabs = EMPLOYEE_SECTIONS.filter(({ key }) => employees[key].length > 0);

  const tabs = [
    { key: "all" as const, label: "All Employees", count: allCount },
    ...availableTabs.map(({ key, roleLabel }) => ({
      key,
      label: roleLabel,
      count: filteredEmployees[key].length,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
      {tabs.map(({ key, label, count }) => {
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{label}</span>

            <span
              className={`rounded-md px-1.5 py-0.5 text-xs ${
                isActive ? "bg-primary/15 text-primary" : "bg-white/5 text-slate-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
