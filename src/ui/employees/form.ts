import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CreateEmployeeSchema, EmployeeFormType, EmployeeSchema } from "./schema";

const EMPTY_EMPLOYEE_VALUES: EmployeeFormType = {
  username: "",
  email: "",
  password: "",
  phone: "",
  guardianName: "",
  guardianPhone: "",
  permanentAddress: "",
  currentAddress: "",
  type: "salesman",
};

export const useEmployeeForm = (isEdit = false) => {
  return useForm<EmployeeFormType>({
    resolver: zodResolver(isEdit ? EmployeeSchema : CreateEmployeeSchema),
    defaultValues: EMPTY_EMPLOYEE_VALUES,
  });
};
