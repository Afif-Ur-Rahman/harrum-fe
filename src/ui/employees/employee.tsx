"use client";

import { Plus, Users } from "lucide-react";
import { useEmployees } from "./useEmployee";
import {
  AddEmployees,
  EditEmployee,
  EmployeesSearch,
  EmployeeTable,
} from "./blocks";
import { ROLE_STYLES } from "./constants";
import { ReuseableDialog } from "@/components";
import { PageLayout } from "@/components/layout";

const Employees = () => {
  const {
    loading,
    onAddEmployee,
    onUpdateEmployee,
    onDeleteEmployee,
    open,
    setOpen,
    editOpen,
    setEditOpen,
    selectedEmployee,
    setSelectedEmployee,
    flatEmployees,
    filtered,
    search,
    setSearch,
  } = useEmployees();

  return (
    <PageLayout>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
          <Users className="h-5 w-5 text-cyan-300" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Employees
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            {flatEmployees.length} employee
            {flatEmployees.length !== 1 ? "s" : ""}
            {search ? ` · ${filtered.length} matching` : ""}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <EmployeesSearch value={search} onChange={setSearch} />

        <ReuseableDialog
          title="Add New Employee"
          open={open}
          setOpen={setOpen}
          triggerButton={
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
          }
          content={
            <AddEmployees onAddEmployee={onAddEmployee} loading={loading} />
          }
        />

        <ReuseableDialog
          title="Edit Employee"
          open={editOpen}
          setOpen={setEditOpen}
          content={
            selectedEmployee ? (
              <EditEmployee
                employee={selectedEmployee}
                loading={loading}
                onUpdateEmployee={(data) =>
                  onUpdateEmployee(selectedEmployee._id, data)
                }
              />
            ) : null
          }
        />
      </div>

      <EmployeeTable
        filtered={filtered}
        loading={loading}
        onDeleteEmployee={onDeleteEmployee}
        onEditEmployee={(employee) => {
          setSelectedEmployee(employee);
          setEditOpen(true);
        }}
        roleStyles={ROLE_STYLES}
      />
    </PageLayout>
  );
};

export { Employees };
