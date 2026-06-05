import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompleteProfileFormType, completeProfileSchema } from "./schema";

const useCompleteProfileForm = (intialValues?: CompleteProfileFormType) => {
  const form = useForm({
    resolver: zodResolver(completeProfileSchema),
    reValidateMode: "onChange",
    defaultValues: intialValues,
  });

  return form;
};

export { useCompleteProfileForm };
