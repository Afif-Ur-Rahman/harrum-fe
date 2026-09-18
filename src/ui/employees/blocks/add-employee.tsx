"use client";

import { EmployeeForm } from "./employee-form";
import { EmployeeFormType } from "../schema";

export const AddEmployees = ({
  onAddEmployee,
  loading,
}: {
  onAddEmployee: (data: EmployeeFormType) => Promise<void>;
  loading: boolean;
}) => {
  return <EmployeeForm onSubmit={onAddEmployee} loading={loading} />;
};
