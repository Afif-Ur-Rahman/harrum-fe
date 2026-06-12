import { z } from "zod";

export const stockVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const stockItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  article: z.string().min(1, "Article is required"),
  size: z.string().default("meter(s)"),

  wholesalePrice: z.string().min(1, "Wholesale price is required"),
  salePrice: z.string().min(1, "Sale price is required"),

  variants: z
    .array(stockVariantSchema)
    .min(1, "At least one variant is required"),
});

export const stockFormSchema = z.object({
  stockItems: z.array(stockItemSchema).default([]),
});

export type StockVariantFormType = z.infer<typeof stockVariantSchema>;
export type StockItemType = z.infer<typeof stockItemSchema>;
export type StockFormType = z.infer<typeof stockFormSchema>;
