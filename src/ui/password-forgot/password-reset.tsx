"use client";

import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useForgot } from "./useForgot";
import { useForgotForm } from "./form";
import { Lock } from "lucide-react";
import { FormInput } from "@/components";

const ResetPassword = () => {
  const { resetForgotPassword } = useForgot();
  const form = useForgotForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedOtp = sessionStorage.getItem("otp");

    form.setValue("email", storedEmail || "");
    form.setValue("otp", storedOtp || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    const email = sessionStorage.getItem("email") || "";
    const otp = sessionStorage.getItem("otp") || "";

    setIsLoading(true);

    await form.handleSubmit(async (data) => {
      const res = await resetForgotPassword({ ...data, email, otp });

      setIsLoading(false);

      if (res?.data || !res?.error) {
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("otp");
        window.location.reload();
      }
    })();

    setIsLoading(false);
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-5">
        <FormInput
          label="New Password"
          field="newPassword"
          type="password"
          placeholder="At least 8 characters"
          icon={Lock}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating…
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </FormProvider>
  );
};

export default ResetPassword;
