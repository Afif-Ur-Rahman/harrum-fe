"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useForgot } from "./useForgot";
import { useForgotForm } from "./form";
import { AuthField } from "@/components/inputs/AuthField";
import { Mail } from "lucide-react";

const Forgotpassword = ({
  setCurrentStep,
  steps,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  steps: { FormForgot: string; OtpVerification: string; ResetPassword: string };
}) => {
  const { onForgot } = useForgot();
  const form = useForgotForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await form.handleSubmit(async (data) => {
      const res = await onForgot(data);
      if (res?.error || !res?.data) {
        setCurrentStep(steps.FormForgot);
        setIsLoading(false);
        return;
      }
      setCurrentStep(steps.OtpVerification);
      setIsLoading(false);
    })();
    setIsLoading(false);
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-5">
        <AuthField
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@restaurant.com"
          icon={<Mail size={16} />}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            "Send Reset Code"
          )}
        </button>
      </div>
    </FormProvider>
  );
};

export { Forgotpassword };
