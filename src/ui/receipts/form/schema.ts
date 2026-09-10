import { z } from "zod";

export const ReceiptSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  note: z.string().optional(),
  paymentMethod: z.enum(["cash", "online"], {
    message: "Payment method is required",
  }),
});

export type ReceiptFormType = z.infer<typeof ReceiptSchema>;
