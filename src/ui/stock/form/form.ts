import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { stockFormSchema, StockFormType } from "./schema";

export const useStockForm = (defaultValues?: StockFormType) => {
  return useForm<StockFormType>({
    resolver: zodResolver(stockFormSchema) as unknown as Resolver<StockFormType>,
    defaultValues,
  });
};

export type {
  StockFormType,
  StockItemType,
  StockVariantFormType,
} from "./schema";
