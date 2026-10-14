"use client";

import { Employees } from "@/types/employees";

import { EMPLOYEE_SECTIONS, EmployeeTab, TAB_COLORS } from "../constants";

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
        const colors = TAB_COLORS[key];

        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? colors.active : `text-slate-400 ${colors.hover}`
            }`}
          >
            <span>{label}</span>

            <span
              className={`rounded-md px-1.5 py-0.5 text-xs ${
                isActive ? "bg-black/10" : "bg-white/5"
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
