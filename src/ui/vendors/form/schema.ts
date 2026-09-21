import { z } from "zod";

export const VendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.email("Invalid email address").optional().or(z.literal("")),
});

export type VendorFormType = z.infer<typeof VendorSchema>;
