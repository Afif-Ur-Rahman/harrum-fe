import { z } from "zod";

export const CustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.email("Invalid email address").optional().or(z.literal("")),
  remainingAmount: z.string().optional(),
});

export type CustomerFormType = z.infer<typeof CustomerSchema>;
