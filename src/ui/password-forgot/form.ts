import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ForgotFormType, forgotSchema } from "./schema";

const useForgotForm = (intialValues?: ForgotFormType) => {
  const form = useForm({
    resolver: zodResolver(forgotSchema),
    reValidateMode: "onChange",
    defaultValues: intialValues,
  });

  return form;
};

export { useForgotForm };
