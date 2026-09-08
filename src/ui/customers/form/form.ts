import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormType, CustomerSchema } from "./schema";

const useCustomerForm = (initialValues?: CustomerFormType) => {
  const form = useForm({
    resolver: zodResolver(CustomerSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useCustomerForm };
