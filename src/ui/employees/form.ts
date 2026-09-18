import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddEmployeeSchema, EmployeeFormType, EmployeeSchema } from "./schema";

export const useEmployeeForm = (
  initialValues: Partial<EmployeeFormType>,
  isEdit = false,
) => {
  return useForm<EmployeeFormType>({
    resolver: zodResolver(isEdit ? EmployeeSchema : AddEmployeeSchema),
    defaultValues: initialValues,
  });
};
