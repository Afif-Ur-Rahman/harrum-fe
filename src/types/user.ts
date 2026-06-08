export interface User {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  _id: string;
  email: string;
  otp: string;
  otpExpires: string;
  type: "owner" | "worker" | "accountant";
  createdAt: string;
  updatedAt: string;
  username: string;
  token: string;
}
export interface UserResponse {
  message: string;
  data: User;
}
