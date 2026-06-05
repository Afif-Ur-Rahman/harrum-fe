import { User, UserResponse } from "./user";

interface AuthRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  state: boolean;
  data?: UserResponse;
  error?: string;
}

export interface SimpleResponse {
  state: boolean;
  data?: { message: string };
  error?: string;
}

export interface OtpVerificationData {
  email: string;
  otp: string;
}

interface AuthCookies {
  user: User;
  accessToken: string;
}

// Profile completion types
interface ProfileUpdateData {
  fullName?: string;
  username?: string;
  city?: string;
  dob?: string;
  interests?: string[];
  image?: File;
}



// Password reset types
interface PasswordResetData {
  email: string;
  otp: string;
  newPassword: string;
}
export interface ResetVerifyOtpResponse {
  email: string;
  otp: string;
}

interface PasswordResetResponse {
  message: string;
  success: boolean;
}

// Forgot password types
interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export type {
  User,
  AuthRequest,
  AuthCookies,
  ProfileUpdateData,
  PasswordResetData,
  PasswordResetResponse,
  ForgotPasswordResponse,
};
