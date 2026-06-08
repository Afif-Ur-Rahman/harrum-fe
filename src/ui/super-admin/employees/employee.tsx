"use client";

import {
  Briefcase,
  Calculator,
  PersonStanding,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import ReuseableDialog from "@/components/ui/dialog";
import AddEmployees from "./empolees-add";
import { useEmployees } from "./useEmploye";
import { ConfirmationDialog } from "@/components";
import { useMemo, useState } from "react";
import { User } from "@/types";

const ROLE_STYLES: Record<string, string> = {
  Worker:
    "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Accountant: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
};

const ROLE_PANEL_STYLES: Record<
  string,
  { accent: string; glow: string; iconClass: string }
> = {
  Worker: {
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/10",
    iconClass: "bg-emerald-500/15 text-emerald-200",
  },
  Accountant: {
    accent: "from-sky-500 via-indigo-500 to-blue-600",
    glow: "shadow-sky-500/10",
    iconClass: "bg-sky-500/15 text-sky-100",
  },
};

type EmployeeWithRole = User & {
  roleLabel: string;
};

const Employees = () => {
  const {
    employees,
    loading,
    onAddEmployee,
    onDeleteEmployee,
    open,
    setOpen,
    EMPLOYEE_SECTIONS,
  } = useEmployees();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const flatEmployees = useMemo(() => {
    return EMPLOYEE_SECTIONS.flatMap((section) =>
      (employees[section.key] || []).map((employee: User) => ({
        ...employee,
        roleLabel: section.roleLabel,
      })),
    );
  }, [employees, EMPLOYEE_SECTIONS]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return flatEmployees.filter((employee) => {
      const matchesRole =
        roleFilter === "all" || employee.roleLabel.toLowerCase() === roleFilter;

      const matchesSearch =
        !query ||
        employee.username?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [flatEmployees, search, roleFilter]);

  const tabs = [
    { value: "all", label: "All Staff" },
    ...EMPLOYEE_SECTIONS.map((section) => ({
      value: section.roleLabel.toLowerCase(),
      label: section.title,
    })),
  ];

  const countsByRole = useMemo(() => {
    return EMPLOYEE_SECTIONS.map((section) => ({
      roleLabel: section.roleLabel,
      title: section.title,
      total: employees[section.key]?.length || 0,
    }));
  }, [EMPLOYEE_SECTIONS, employees]);

  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)] lg:block" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Team Overview
                </div>

                <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl xl:text-5xl">
                  Employee Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor your workforce, filter by role, and manage staff
                  records.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 xl:min-w-105">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Total Staff
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {flatEmployees.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Filtered Result
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-cyan-200">
                    {filtered.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {countsByRole.map((item) => {
              const styles = ROLE_PANEL_STYLES[item.roleLabel];

              return (
                <div
                  key={item.roleLabel}
                  className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/8 p-5 shadow-2xl ${styles.glow} backdrop-blur-xl transition duration-300 hover:-translate-y-1`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${styles.accent}`}
                  />
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-2xl transition duration-300 group-hover:scale-125" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        {item.title}
                      </p>
                      <p className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {item.total}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl p-3 shadow-lg ${styles.iconClass}`}
                    >
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="relative mt-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
                      <Users className="h-4 w-4" />
                      {item.roleLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                  Directory Controls
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Search and filter employees
                </h2>
              </div>

              <ReuseableDialog
                title="Add New Employee"
                open={open}
                setOpen={setOpen}
                triggerButton={
                  <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Employee
                  </button>
                }
                content={
                  <AddEmployees
                    onAddEmployee={onAddEmployee}
                    loading={loading}
                  />
                }
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => {
                  const active = roleFilter === tab.value;

                  return (
                    <button
                      key={tab.value}
                      onClick={() => setRoleFilter(tab.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border border-cyan-300/30 bg-cyan-400/15 text-cyan-100"
                          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative xl:ml-auto xl:max-w-md xl:flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, username or email"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>
            </div>
          </section>

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
                          <span className="block truncate">
                            {employee.email}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              ROLE_STYLES[employee.roleLabel] ??
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
                              confirmAction={() =>
                                onDeleteEmployee(employee._id)
                              }
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
        </div>
      </div>
    </div>
  );
};

export { Employees };
