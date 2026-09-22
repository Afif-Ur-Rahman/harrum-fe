import { z } from "zod";

export const orderItemVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  quantity: z.string().min(1, "Quantity is required"),
  price: z.string(),
});

export const orderItemSchema = z
  .object({
    stockId: z.string().min(1, "Item is required"),
    name: z.string().min(1),
    priceType: z.enum(["purchase", "wholesale", "sale", "custom"]).default("sale"),
    hasVariants: z.boolean().default(true),
    quantity: z.string().optional(),
    price: z.string().optional(),
    variants: z.array(orderItemVariantSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.hasVariants) {
      if (!data.variants || data.variants.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one color is required",
          path: ["variants"],
        });
      }
    } else if (!data.quantity?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantity is required",
        path: ["quantity"],
      });
    }
  });

export const orderFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  salesmanId: z.string().min(1, "Salesman is required"),
  totalPrice: z.string(),
  discount: z.string().optional().default("0"),
  isPaid: z.boolean().default(true),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export type OrderItemVariantFormType = z.infer<typeof orderItemVariantSchema>;
export type OrderItemFormType = z.infer<typeof orderItemSchema>;
export type OrderFormType = z.infer<typeof orderFormSchema>;
