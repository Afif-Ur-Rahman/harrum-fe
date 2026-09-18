"use client";

import React, { useMemo } from "react";
import { Calculator, Edit, PersonStanding, Trash2 } from "lucide-react";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Table, Column } from "@/components/ui/table";
import { Employee } from "@/types";

export type EmployeeType = Employee & {
  roleLabel: string;
};

interface EmployeeTableProps {
  filtered: EmployeeType[];
  onDeleteEmployee: (
    id: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
  onEditEmployee: (employee: Employee) => void;
  roleStyles?: Record<string, string>;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  filtered,
  onDeleteEmployee,
  onEditEmployee,
  roleStyles = {},
}) => {
  const columns: Column<EmployeeType>[] = useMemo(
    () => [
      {
        key: "username",
        header: "Employee",
        align: "left",
        className: "min-w-52",
        render: (employee) => (
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/10">
              {employee.type === "worker" ? (
                <PersonStanding className="h-5 w-5 text-cyan-300" />
              ) : (
                <Calculator className="h-5 w-5 text-fuchsia-300" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {employee.username}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {employee._id}
              </p>
            </div>
          </div>
        ),
      },

      {
        key: "email",
        header: "Email",
        align: "left",
        className: "min-w-60",
        render: (employee: Employee) => (
          <span className="block max-w-64 truncate" title={employee.email}>
            {employee.email || "—"}
          </span>
        ),
      },

      {
        key: "phone",
        header: "Phone",
        align: "left",
        className: "min-w-40",
        render: (employee) => employee.phone || "—",
      },

      {
        key: "roleLabel",
        header: "Role",
        align: "center",
        className: "min-w-32",
        render: (employee) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              roleStyles[employee.roleLabel] ??
              "bg-white/10 text-slate-200 ring-1 ring-inset ring-white/10"
            }`}
          >
            {employee.roleLabel}
          </span>
        ),
      },

      {
        key: "guardianName",
        header: "Guardian",
        align: "left",
        className: "min-w-48",
        render: (employee) => employee.guardianName || "—",
      },

      {
        key: "guardianPhone",
        header: "Guardian Phone",
        align: "left",
        className: "min-w-44",
        render: (employee) => employee.guardianPhone || "—",
      },

      {
        key: "permanentAddress",
        header: "Permanent Address",
        align: "left",
        className: "min-w-72",
        render: (employee) => (
          <span
            className="block max-w-80 truncate"
            title={employee.permanentAddress}
          >
            {employee.permanentAddress || "—"}
          </span>
        ),
      },

      {
        key: "currentAddress",
        header: "Current Address",
        align: "left",
        className: "min-w-72",
        render: (employee) => (
          <span
            className="block max-w-80 truncate"
            title={employee.currentAddress}
          >
            {employee.currentAddress || "—"}
          </span>
        ),
      },

      {
        key: "actions",
        header: "Action",
        align: "right",
        className: "min-w-28",
        render: (employee) => (
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditEmployee(employee)}
              aria-label={`Edit ${employee.username}`}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-200"
            >
              <Edit className="h-4 w-4" />
            </button>

            <ConfirmationDialog
              title="Delete Employee"
              description="Are you sure you want to delete this employee? This action cannot be undone."
              saveButtonTitle="Delete"
              confirmAction={() => onDeleteEmployee(employee._id)}
              trigger={
                <button
                  type="button"
                  aria-label={`Delete ${employee.username}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              }
            />
          </div>
        ),
      },
    ],
    [onDeleteEmployee, onEditEmployee, roleStyles],
  );

  return <Table data={filtered} columns={columns} title="employees" />;
};
