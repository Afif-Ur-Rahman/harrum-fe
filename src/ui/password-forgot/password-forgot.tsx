"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useForgot } from "./useForgot";
import { useForgotForm } from "./form";
import { Mail } from "lucide-react";
import { FormInput } from "@/components";

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
        <FormInput
          label="Email Address"
          field="email"
          type="email"
          placeholder="you@harrum.com"
          icon={Mail}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
