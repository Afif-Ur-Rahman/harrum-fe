import { z } from "zod";

export const completeProfileSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  dob: z.any().optional(),
  image: z.any(),
  coverImage: z.any(),
  otp: z.string(),
  fullName: z.string().min(1, { message: "Store name is required" }),
  storeName: z.string().optional(),
  username: z.string().min(1, { message: "Username is required" }),
  gender: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  interests: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export type CompleteProfileFormType = z.infer<typeof completeProfileSchema>;
