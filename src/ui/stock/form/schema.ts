import { z } from "zod";

export const StockItemType = z.object({
  _id: z.string().optional(),
  name: z.string(),
  remainingQuantity: z.string(),
  newQuantity: z.string().or(z.number()),
  oldPrice: z.string(),
  newPrice: z.string(),
  unit: z.string(),
});

export type StockItemType = z.infer<typeof StockItemType>;

export const StockSchema = z.object({
  stockItems: z.array(StockItemType),
  selectedStock: z.array(z.string()).optional(),
});

export type StockFormType = z.infer<typeof StockSchema>;
