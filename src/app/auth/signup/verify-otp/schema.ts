import { z } from 'zod'

export const verifyOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string(),
})

export type VerifyOtpFormType = z.infer<typeof verifyOtpSchema>