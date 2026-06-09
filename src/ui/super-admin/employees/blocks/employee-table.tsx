"use client";
import React from "react";
import {
  PersonStanding,
  Calculator,
  UserRound,
  Users,
  Trash2,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import type { User } from "@/types";

export type EmployeeWithRole = User & {
  roleLabel: string;
};

interface EmployeeTableProps {
  filtered: EmployeeWithRole[];
  loading: boolean;
  onDeleteEmployee: (
    id: string,
  ) => Promise<{ state: boolean; message?: string; error?: string }>;
  roleStyles?: Record<string, string>;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  filtered,
  loading,
  onDeleteEmployee,
  roleStyles = {},
}) => {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 shadow-2xl shadow-black/25 backdrop-blur-xl">
      {loading ? (
        <div className="flex min-h-70 flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 rounded-2xl bg-cyan-400/10 p-4 text-cyan-200">
            <Users className="h-7 w-7" />
          </div>
          <p className="text-base font-semibold text-white">
            Loading employees...
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Fetching the latest staff records.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-70 flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 rounded-2xl bg-white/10 p-4 text-slate-200">
            <UserRound className="h-7 w-7" />
          </div>
          <p className="text-base font-semibold text-white">
            No employees found
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Try adjusting your search or role filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-black/10 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Employee
                </th>
                <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 md:table-cell">
                  Email
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Role
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filtered.map((employee: EmployeeWithRole) => (
                <tr
                  key={employee._id}
                  className="group transition hover:bg-white/4"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center h-11 w-11 overflow-hidden rounded-2xl ring-1 ring-white/10">
                        {employee.type === "worker" ? (
                          <PersonStanding />
                        ) : (
                          <Calculator />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {employee.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="hidden max-w-65 px-5 py-4 text-slate-300 md:table-cell">
                    <span className="block truncate">{employee.email}</span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        roleStyles[employee.roleLabel] ??
                        "bg-white/10 text-slate-200 ring-1 ring-inset ring-white/10"
                      }`}
                    >
                      {employee.roleLabel}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex opacity-100 transition xl:opacity-0 xl:group-hover:opacity-100">
                      <ConfirmationDialog
                        title="Delete Employee"
                        description="Are you sure you want to delete this employee? This action cannot be undone."
                        saveButtonTitle="Delete"
                        confirmAction={() => onDeleteEmployee(employee._id)}
                        trigger={
                          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
