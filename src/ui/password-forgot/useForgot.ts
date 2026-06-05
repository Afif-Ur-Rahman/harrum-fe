import {
  forgotPassword,
  resetPassword,
} from "@/api/api-call/auth-api";
import { ForgotFormType } from "./schema";
import { PasswordResetData } from "@/types";
import { showToast } from "@/utils/toast";

const useForgot = () => {


  const onForgot = async (data: ForgotFormType) => {
    const result = await forgotPassword(data.email);
    if (result?.error || !result?.data) {
    
      showToast("error",result?.error || "Request Failed")
      return;
    }
    showToast("success",result?.data?.message ||"OTP Sent Successfully")
    sessionStorage.setItem("email", data.email);

    return result;
  };


  const resetForgotPassword = async (data: ForgotFormType) => {
    const result = await resetPassword(data as PasswordResetData);
    if (result?.error || !result?.data) {
      showToast("error",result?.error || "Request Failed")
      return;
    }
    showToast("success",result?.data?.message ||"Password Reset Successfully")
    sessionStorage.setItem("otp", data.otp || "");

    return result;
  };

  return {
    onForgot,
    resetForgotPassword,
  };
};

export { useForgot };
