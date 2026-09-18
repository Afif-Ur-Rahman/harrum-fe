import { z } from "zod";

export const EmployeeSchema = z.object({
  username: z.string().min(3, "Username is required"),
  type: z.enum(["worker", "accountant"], {
    message: "Employee type is required",
  }),
  email: z.email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  guardianName: z.string().min(1, "Father/Guardian name is required"),
  guardianPhone: z.string().min(1, "Father/Guardian number is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  currentAddress: z.string().min(1, "Current address is required"),
});

export type EmployeeFormType = z.infer<typeof EmployeeSchema>;

export const AddEmployeeSchema = EmployeeSchema.superRefine((data, context) => {
  if (!data.password || data.password.length < 8) {
    context.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password must be at least 8 characters",
    });
  }
});
