import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { orderFormSchema, OrderFormType } from "./schema";

export const useOrderForm = (defaultValues?: OrderFormType) => {
  return useForm<OrderFormType>({
    resolver: zodResolver(
      orderFormSchema,
    ) as unknown as Resolver<OrderFormType>,
    reValidateMode: "onChange",
    defaultValues,
  });
};

export type {
  OrderFormType,
  OrderItemFormType,
  OrderItemVariantFormType,
} from "./schema";
