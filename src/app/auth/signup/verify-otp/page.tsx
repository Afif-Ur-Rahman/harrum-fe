"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import OnboardingLayout from "@/components/OnboardingLayout";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "@/api/api-call/auth-api";
import { showToast } from "@/utils/toast";
import { Mail } from "lucide-react";

const COOLDOWN_SECONDS = 60;

type FormData = { otp: string; email: string };

const computeInitialCooldown = () => {
  if (typeof window === "undefined") return 0;
  const sentAt = sessionStorage.getItem("otp_sent_at");
  if (!sentAt) return 0;
  const elapsed = Math.floor((Date.now() - parseInt(sentAt, 10)) / 1000);
  const remaining = COOLDOWN_SECONDS - elapsed;
  return remaining > 0 ? remaining : 0;
};

const VerifyOtpPage = () => {
  const { handleSubmit, control } = useForm<FormData>();
  const { push } = useRouter();
  const [email] = useState(() =>
    typeof window !== "undefined"
      ? (sessionStorage.getItem("signup_email") ?? "")
      : "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(computeInitialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const response = await verifyOtp({ ...data, email });
    setIsLoading(false);
    if (response?.error || !response?.data) {
      showToast("error", response?.error || "OTP Verification Failed");
      return;
    }
    showToast(
      "success",
      response?.data?.message || "OTP Verified Successfully",
    );
    sessionStorage.setItem("signup_otp", data.otp);
    push("/auth/signup/complete-profile");
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    const response = await resendOtp(email);
    setIsResending(false);
    if (!response?.data) {
      const retryAfter = (response as any)?.retryAfter;
      const msg = response?.error || "Failed to resend OTP";
      showToast(
        "error",
        retryAfter ? `Please wait ${retryAfter}s before retrying.` : msg,
      );
      if (retryAfter) setCooldown(retryAfter);
      return;
    }
    sessionStorage.setItem("otp_sent_at", Date.now().toString());
    setCooldown(COOLDOWN_SECONDS);
    showToast("success", "A new OTP has been sent to your email.");
  };

  return (
    <OnboardingLayout
      heading="Check your email"
      text="We sent a 6-digit code to your address"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Email indicator */}
        {email && (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Mail size={16} className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600 truncate">{email}</span>
          </div>
        )}

        {/* OTP inputs */}
        <Controller
          name="otp"
          control={control}
          defaultValue=""
          rules={{ required: "Please enter the OTP" }}
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
                    className="w-11! h-12! border-2 border-gray-200 rounded-xl text-center text-lg font-semibold text-gray-900 bg-gray-50 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  />
                )}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify & Continue"
          )}
        </button>

        {/* Resend */}
        <p className="text-center text-sm text-gray-400">
          Didn&apos;t receive the code?{" "}
          {cooldown > 0 ? (
            <span className="text-gray-400">
              Resend in{" "}
              <span className="font-semibold tabular-nums text-gray-600">
                {cooldown}s
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-gray-900 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending…" : "Resend"}
            </button>
          )}
        </p>
      </form>
    </OnboardingLayout>
  );
};

export default VerifyOtpPage;
