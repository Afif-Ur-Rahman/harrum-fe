import { z } from 'zod'

export const forgotSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z
    .string()
    .min(6, { message: 'OTP must be at least 6 characters long' })
    .optional(),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional(),
})

export type ForgotFormType = z.infer<typeof forgotSchema>