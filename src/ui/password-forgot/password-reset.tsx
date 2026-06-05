"use client";

import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useForgot } from "./useForgot";
import { useForgotForm } from "./form";
import { AuthField } from "@/components/inputs/AuthField";
import { Lock } from "lucide-react";

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
        <AuthField
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="At least 8 characters"
          icon={<Lock size={16} />}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
