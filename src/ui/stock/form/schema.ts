import { z } from "zod";
import { NO_COLOR_VARIANT_TYPES } from "../constants";

export const stockVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const stockItemSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    brand: z.string().min(1, "Brand is required"),
    vendor: z.string().min(1, "Vendor is required"),
    type: z.string().default("cotton"),
    size: z.string().default("meters"),

    purchasePrice: z.string().min(1, "Purchase price is required"),
    wholesalePrice: z.string().min(1, "Wholesale price is required"),
    salePrice: z.string().min(1, "Sale price is required"),

    variants: z.array(stockVariantSchema).default([]),
    quantity: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasNoColorVariants = NO_COLOR_VARIANT_TYPES.includes(data.type);

    if (hasNoColorVariants) {
      if (!data.quantity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity is required",
          path: ["quantity"],
        });
      }
    } else if (data.variants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one variant is required",
        path: ["variants"],
      });
    }
  });

export const stockFormSchema = z.object({
  stockItems: z.array(stockItemSchema).default([]),
});

export type StockVariantFormType = z.infer<typeof stockVariantSchema>;
export type StockItemType = z.infer<typeof stockItemSchema>;
export type StockFormType = z.infer<typeof stockFormSchema>;
