"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import OTPInput from "react-otp-input";
import { useForgotForm } from "./form";
import { OtpVerificationData } from "@/types";
import { forgotPassword, resetVerifyOtp } from "@/api/api-call/auth-api";
import { ForgotFormType } from "./schema";
import { showToast } from "@/utils/toast";
import { Mail } from "lucide-react";
import { Flex } from "@radix-ui/themes";

type FormData = { otp: string; email: string };

const RESEND_TIME = 60;

const OtpVerify = ({
  setCurrentStep,
  steps,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  steps: { FormForgot: string; OtpVerification: string; ResetPassword: string };
}) => {
  const { handleSubmit, control } = useForm<FormData>();
  const form = useForgotForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIME);

  const canResend = timer === 0 && !isResending;

  const [email] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("email") || "";
  });

  useEffect(() => {
    form.setValue("email", email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (data: ForgotFormType) => {
    setIsLoading(true);

    const result = await resetVerifyOtp({
      ...data,
      email,
    } as OtpVerificationData);

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
    if (!canResend) return;

    setIsResending(true);

    const result = await forgotPassword(email);

    setIsResending(false);

    if (result?.error || !result?.data) {
      showToast("error", result?.error || "Request Failed");
      return;
    }

    showToast("success", result?.data?.message || "Code resent successfully");

    // Restart countdown after successful resend
    setTimer(RESEND_TIME);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {email && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-md">
          <Mail size={16} className="shrink-0 text-cyan-300" />
          <span className="truncate text-sm text-slate-300">{email}</span>
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
                  className="h-12! w-11! rounded-xl border-2 border-white/10 bg-white/8 text-center text-lg font-semibold text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/12 focus:shadow-lg focus:shadow-cyan-950/30"
                />
              )}
            />

            {fieldState.error && (
              <p className="text-xs text-red-400">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Verifying…
          </>
        ) : (
          "Verify Code"
        )}
      </button>

      <Flex justify="center" align="center" gap="2" className="min-h-5">
        <p className="text-center text-sm text-slate-400">
          Didn&apos;t receive the code?
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Sending…" : "Resend"}
        </button>

        <span className="inline-block min-w-9 text-left text-sm text-slate-500 tabular-nums">
          {timer > 0 ? `${timer}s` : ""}
        </span>
      </Flex>
    </form>
  );
};

export default OtpVerify;
