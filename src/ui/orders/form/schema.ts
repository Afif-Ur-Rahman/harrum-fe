import { z } from "zod";

export const orderItemVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const orderItemSchema = z.object({
  stockId: z.string().min(1, "Item is required"),
  name: z.string().min(1),
  variants: z
    .array(orderItemVariantSchema)
    .min(1, "At least one color is required"),
});

export const orderFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  salesmanId: z.string().min(1, "Salesman is required"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export type OrderItemVariantFormType = z.infer<typeof orderItemVariantSchema>;
export type OrderItemFormType = z.infer<typeof orderItemSchema>;
export type OrderFormType = z.infer<typeof orderFormSchema>;
