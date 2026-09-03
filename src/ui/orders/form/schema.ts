import { z } from "zod";

export const orderItemSchema = z.object({
  stockId: z.string().min(1, "Item is required"),
  name: z.string().min(1),
  color: z.string().min(1, "Color is required"),
  quantity: z.string().min(1, "Quantity is required"),
});

export const orderFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export type OrderItemFormType = z.infer<typeof orderItemSchema>;
export type OrderFormType = z.infer<typeof orderFormSchema>;
