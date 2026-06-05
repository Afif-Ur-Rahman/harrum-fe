import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

export type SignupFormType = z.infer<typeof signupSchema>
