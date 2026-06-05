import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockFormType, StockSchema } from "./schema";

const useStockForm = (initialValues?: StockFormType) => {
  const form = useForm({
    resolver: zodResolver(StockSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  return form;
};

export { useStockForm };
