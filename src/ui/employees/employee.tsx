"use client";

import { Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { ReuseableDialog } from "@/components";
import { PageLayout } from "@/components/layout";
import { Loader } from "@/components/ui/loader";
import type { EmployeeRole } from "@/types";

import { EmployeeCards, EmployeeForm, EmployeesSearch, EmployeeTabs } from "./blocks";
import { useEmployees } from "./useEmployee";

const Employees = () => {
  const {
    loading,
    permissionLoading,
    onAddEmployee,
    onUpdateEmployee,
    onUpdatePermissions,
    onDeleteEmployee,
    open,
    setOpen,
    editOpen,
    setEditOpen,
    selectedEmployee,
    setSelectedEmployee,
    employees,
    filtered,
    filteredEmployees,
    search,
    setSearch,
  } = useEmployees();

  const [activeTab, setActiveTab] = useState<EmployeeRole | "all">("all");

  const tabEmployees = useMemo(() => {
    if (activeTab === "all") return filtered;

    return filtered.filter(employee => employee.type === activeTab);
  }, [activeTab, filtered]);

  return (
    <PageLayout>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
          <Users className="h-5 w-5 text-cyan-300" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Employees</h1>

          <p className="mt-1 text-xs text-slate-400">
            {tabEmployees.length} employee
            {tabEmployees.length !== 1 ? "s" : ""}
            {search ? ` · ${tabEmployees.length} matching` : ""}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <EmployeesSearch value={search} onChange={setSearch} />

        <ReuseableDialog
          title="Add New Employee"
          open={open}
          setOpen={setOpen}
          triggerButton={
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
          }
          content={<EmployeeForm loading={loading} onSubmit={onAddEmployee} />}
        />

        <ReuseableDialog
          title="Edit Employee"
          open={editOpen}
          setOpen={setEditOpen}
          content={
            selectedEmployee ? (
              <EmployeeForm
                key={selectedEmployee._id}
                employee={selectedEmployee}
                loading={loading}
                onSubmit={data => onUpdateEmployee(selectedEmployee._id, data)}
              />
            ) : null
          }
        />
      </div>

      <EmployeeTabs
        employees={employees}
        filteredEmployees={filteredEmployees}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <div className="flex min-h-70 items-center justify-center rounded-2xl border border-white/10 bg-white/8 px-6 py-16 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Loader label="employees" />
        </div>
      ) : (
        <div role="tabpanel">
          <EmployeeCards
            filtered={tabEmployees}
            onDeleteEmployee={onDeleteEmployee}
            onEditEmployee={employee => {
              setSelectedEmployee(employee);
              setEditOpen(true);
            }}
            onUpdatePermissions={onUpdatePermissions}
            permissionLoading={permissionLoading}
          />
        </div>
      )}
    </PageLayout>
  );
};

export { Employees };
