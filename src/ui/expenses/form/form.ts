import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ExpenseFormType, ExpenseSchema } from "./schema";

const useExpenseForm = (initialValues?: ExpenseFormType) => {
  const form = useForm({
    resolver: zodResolver(ExpenseSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useExpenseForm };
