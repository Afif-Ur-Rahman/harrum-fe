import { z } from "zod";

export const ExpenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(value => Number(value) > 0, "Amount must be greater than 0"),
  category: z.enum(["Rent", "Utilities", "Salary", "Transport", "Maintenance", "Misc"], {
    message: "Category is required",
  }),
  note: z.string().optional(),
  paymentMethod: z.enum(["cash", "online"], {
    message: "Payment method is required",
  }),
});

export type ExpenseFormType = z.infer<typeof ExpenseSchema>;
