import { z } from "zod";

export const BillSchema = z.object({
  billId: z.string().trim().min(1, "Bill ID is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => Number(value) > 0, "Amount must be greater than 0"),
  note: z.string().optional(),
});

export type BillFormType = z.infer<typeof BillSchema>;
