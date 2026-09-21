import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillFormType, BillSchema } from "./schema";

const useBillForm = (initialValues?: BillFormType) => {
  const form = useForm({
    resolver: zodResolver(BillSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useBillForm };
