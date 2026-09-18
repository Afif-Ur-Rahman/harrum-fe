"use client";

import { EmployeeForm } from "./employee-form";
import { EmployeeFormType } from "../schema";
import { Employee } from "@/types";

export const EditEmployee = ({
  employee,
  onUpdateEmployee,
  loading,
}: {
  employee: Employee;
  onUpdateEmployee: (data: EmployeeFormType) => Promise<void>;
  loading: boolean;
}) => {
  return (
    <EmployeeForm
      employee={employee}
      onSubmit={onUpdateEmployee}
      loading={loading}
    />
  );
};
