import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorFormType, VendorSchema } from "./schema";

const useVendorForm = (initialValues?: VendorFormType) => {
  const form = useForm({
    resolver: zodResolver(VendorSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useVendorForm };
