export interface User {
  coverImage: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  isVerified: boolean;
  _id: string;
  email: string;
  interests: string[];
  otp: string;
  otpExpires: string;
  type: "normal" | "owner" | "admin" | "superAdmin" | "worker" | "accountant";
  location?: {
    coordinates?: [number, number];
  };
  phone: string;
  channels: string[];
  createdAt: string;
  updatedAt: string;
  city: string;
  dob: string;
  fullName: string;
  image: string;
  username: string;
  device: string;
  platform: string;
  token: string;
  address?: string;
  cartEnabled: boolean;
  currency: string;
  restaurant?: User;
  hasAnthropicKey?: boolean;
}
export interface UserResponse {
  message: string;
  data: User;
}
