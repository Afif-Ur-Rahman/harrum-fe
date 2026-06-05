"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import OTPInput from "react-otp-input";
import { useForgotForm } from "./form";
import { OtpVerificationData } from "@/types";
import { resendOtp, resetVerifyOtp } from "@/api/api-call/auth-api";
import { ForgotFormType } from "./schema";
import { showToast } from "@/utils/toast";
import { Mail } from "lucide-react";

type FormData = { otp: string; email: string };

const OtpVerify = ({
  setCurrentStep,
  steps,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  steps: { FormForgot: string; OtpVerification: string; ResetPassword: string };
}) => {
  const { handleSubmit, control } = useForm<FormData>();
  const form = useForgotForm();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("email");
    form.setValue("email", stored || "");
    if (stored) setEmail(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ForgotFormType) => {
    setIsLoading(true);
    const result = await resetVerifyOtp({ ...data, email } as OtpVerificationData);
    setIsLoading(false);
    if (result?.error || !result?.data) {
      showToast("error", result?.error || "Request Failed");
      return;
    }
    showToast("success", result?.data?.message || "OTP Verified Successfully");
    sessionStorage.setItem("otp", data.otp || "");
    setCurrentStep(steps.ResetPassword);
  };

  const handleResend = async () => {
    setIsResending(true);
    const result = await resendOtp(email);
    setIsResending(false);
    if (result?.error || !result?.data) {
      showToast("error", result?.error || "Request Failed");
      return;
    }
    showToast("success", result?.data?.message || "Code resent successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {email && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <Mail size={16} className="text-gray-400 shrink-0" />
          <span className="text-sm text-gray-600 truncate">{email}</span>
        </div>
      )}

      <Controller
        name="otp"
        control={control}
        defaultValue=""
        rules={{ required: "OTP is required" }}
        render={({ field, fieldState }) => (
          <div className="flex flex-col items-center gap-3">
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              numInputs={6}
              renderSeparator={<span className="w-2" />}
              renderInput={(props) => (
                <input
                  {...props}
                  className="!w-11 !h-12 border-2 border-gray-200 rounded-xl text-center text-lg font-semibold text-gray-900 bg-gray-50 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                />
              )}
            />
            {fieldState.error && (
              <p className="text-red-500 text-xs">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying…
          </>
        ) : (
          "Verify Code"
        )}
      </button>

      <p className="text-center text-sm text-gray-400">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-gray-900 font-semibold hover:underline disabled:opacity-50"
        >
          {isResending ? "Sending…" : "Resend"}
        </button>
      </p>
    </form>
  );
};

export default OtpVerify;
