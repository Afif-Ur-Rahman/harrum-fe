"use client";

import { useState } from "react";
import { Dialog } from "@radix-ui/themes";
import { Forgotpassword } from "./password-forgot";
import ResetPassword from "./password-reset";
import OtpVerify from "./password-otpVerify";
import { X } from "lucide-react";

const STEPS = {
  FormForgot: "FormForgot",
  OtpVerification: "OtpVerification",
  ResetPassword: "ResetPassword",
};

const STEP_LIST = [
  STEPS.FormForgot,
  STEPS.OtpVerification,
  STEPS.ResetPassword,
];

const PasswordForgotDialog = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.FormForgot);

  return (
    <Dialog.Root onOpenChange={() => setCurrentStep(STEPS.FormForgot)}>
      <Dialog.Trigger>
        <button className="text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200 hover:underline">
          Forgot password?
        </button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-md! w-full! overflow-hidden! rounded-3xl! border! border-white/10! bg-slate-950! p-0! shadow-2xl! shadow-black/50!">
        <div className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(17,24,39,0.98)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_36%)]" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 pb-4 pt-6">
              <div>
                <Dialog.Title className="mb-0! text-base! font-bold! text-white!">
                  {currentStep === STEPS.FormForgot && "Reset your password"}
                  {currentStep === STEPS.OtpVerification && "Check your email"}
                  {currentStep === STEPS.ResetPassword && "Create new password"}
                </Dialog.Title>

                <p className="mt-1 text-xs text-slate-400">
                  {currentStep === STEPS.FormForgot &&
                    "We'll send a reset code to your email"}
                  {currentStep === STEPS.OtpVerification &&
                    "Enter the 6-digit code we sent you"}
                  {currentStep === STEPS.ResetPassword &&
                    "Choose a strong password"}
                </p>
              </div>

              <Dialog.Close>
                <button
                  onClick={() => setCurrentStep(STEPS.FormForgot)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close dialog"
                >
                  <X size={17} />
                </button>
              </Dialog.Close>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1.5 px-6 pt-4">
              {STEP_LIST.map((step, index) => {
                const isCompletedOrActive =
                  STEP_LIST.indexOf(currentStep) >= index;

                return (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      isCompletedOrActive
                        ? "bg-linear-to-r from-cyan-400 via-blue-400 to-fuchsia-400"
                        : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>

            {/* Step content */}
            <div className="px-6 py-6">
              {currentStep === STEPS.FormForgot && (
                <Forgotpassword setCurrentStep={setCurrentStep} steps={STEPS} />
              )}

              {currentStep === STEPS.OtpVerification && (
                <OtpVerify setCurrentStep={setCurrentStep} steps={STEPS} />
              )}

              {currentStep === STEPS.ResetPassword && <ResetPassword />}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PasswordForgotDialog;
