import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormType, EmployeeSchema } from "./schema";

const useEmployeeForm = (initialValues?: EmployeeFormType) => {
  const form = useForm({
    resolver: zodResolver(EmployeeSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useEmployeeForm };
