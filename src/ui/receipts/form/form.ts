import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptFormType, ReceiptSchema } from "./schema";

const useReceiptForm = (initialValues?: ReceiptFormType) => {
  const form = useForm({
    resolver: zodResolver(ReceiptSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useReceiptForm };
