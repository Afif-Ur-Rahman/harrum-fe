import { z } from "zod";

export const EmployeeSchema = z.object({
  username: z.string().min(3, "Username is required"),
  type: z.string().min(1, "Type is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type EmployeeFormType = z.infer<typeof EmployeeSchema>;
