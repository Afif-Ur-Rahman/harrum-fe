"use server";

import type {
  AuthRequest,
  PasswordResetData,
  PasswordResetResponse,
  User,
  SimpleResponse,
  AuthResponse,
  OtpVerificationData,
} from "@/types";
import { serverAction } from "../server-action";

export const login = async (data: AuthRequest) => {
  try {
    const response = await serverAction({
      url: "/auth/login",
      method: "POST",
      body: data,
    });
    console.log("Login response:", response);
    return response as AuthResponse;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

// Server action for logout - runs on server, secure
export const logout = async () => {
  try {
    const response = await serverAction({
      url: "/auth/logout",
      method: "POST",
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

// Server action for username validation
export const validateUsername = async (username: string) => {
  try {
    const response = await serverAction({
      url: `/auth/register/username?username=${username}`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Error validating username:", error);
    return false;
  }
};

// Server action for registration
export const register = async (data: AuthRequest) => {
  try {
    const response = await serverAction({
      url: "/auth/register",
      method: "POST",
      body: data,
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

// Server action for OTP verification
export const verifyOtp = async (data: OtpVerificationData) => {
  try {
    const response = await serverAction({
      url: "/auth/register/otp-verify",
      method: "POST",
      body: data,
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return null;
  }
};

// Server action for OTP resend
export const resendOtp = async (email: string) => {
  try {
    const response = await serverAction({
      url: "/auth/otp-resend",
      method: "POST",
      body: { email },
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error during profile completion:", error);
    return null;
  }
};

// Server action for profile completion
export const completeProfile = async (data: FormData) => {
  try {
    const response = await serverAction({
      url: "/auth/register/profile-update",
      method: "POST",
      body: data,
    });

    return response as AuthResponse;
  } catch (error) {
    console.error("Error during profile completion:", error);
    return null;
  }
};

// Server action for forgot password
export const forgotPassword = async (email: string) => {
  try {
    const response = await serverAction({
      url: "/auth/forgot-password-otp",
      method: "POST",
      body: { email },
    });

    return response as AuthResponse;
  } catch (error) {
    console.error("Error during profile completion:", error);
    return null;
  }
};

// Server action for reset OTP verification
export const resetVerifyOtp = async (data: OtpVerificationData) => {
  try {
    const response = await serverAction({
      url: "/auth/validate-otp",
      method: "POST",
      body: data,
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error during profile completion:", error);
    return null;
  }
};

// Server action for password reset
export const resetPassword = async (data: PasswordResetData) => {
  try {
    const response = await serverAction({
      url: "/auth/reset-password",
      method: "POST",
      body: data,
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error during password reset:", error);
    return null;
  }
};

export const changePassword = async (
  data: PasswordResetData,
): Promise<PasswordResetResponse | null> => {
  try {
    const response = await serverAction({
      url: `/profile/change-password`,
      method: "PUT",
      body: data,
    });
    if (!response.state) {
      console.error("Password reset failed:", response.error);
      return null;
    }

    return (await response.data) as PasswordResetResponse;
  } catch (error) {
    console.error("Error during password reset:", error);
    return null;
  }
};

export const updateProfile = async (data: FormData): Promise<User | null> => {
  try {
    const response = await serverAction({
      url: "/store/update-profile",
      method: "PUT",
      body: data,
    });

    if (response.state && response.data) {
      const userData = (response.data as { data: User }).data;
      return userData || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

export const updateSuperAdminProfile = async (
  data: FormData,
): Promise<User | null> => {
  try {
    const response = await serverAction({
      url: "/profile",
      method: "PUT",
      body: data,
    });

    if (response.state && response.data) {
      const userData = (response.data as { data: User }).data;
      return userData || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

// Remove the object export - only export individual functions in "use server" files
