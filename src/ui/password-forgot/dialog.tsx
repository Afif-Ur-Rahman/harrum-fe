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

const PasswordForgotDialog = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.FormForgot);

  return (
    <Dialog.Root onOpenChange={() => setCurrentStep(STEPS.FormForgot)}>
      <Dialog.Trigger>
        <button className="text-sm font-semibold text-gray-900 hover:underline transition-colors">
          Forgot password?
        </button>
      </Dialog.Trigger>

      <Dialog.Content className="!p-0 !rounded-2xl !overflow-hidden !max-w-md !w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <Dialog.Title className="!text-base !font-bold !text-gray-900 !mb-0">
              {currentStep === STEPS.FormForgot && "Reset your password"}
              {currentStep === STEPS.OtpVerification && "Check your email"}
              {currentStep === STEPS.ResetPassword && "Create new password"}
            </Dialog.Title>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentStep === STEPS.FormForgot && "We'll send a reset code to your email"}
              {currentStep === STEPS.OtpVerification && "Enter the 6-digit code we sent you"}
              {currentStep === STEPS.ResetPassword && "Choose a strong password"}
            </p>
          </div>
          <Dialog.Close>
            <button
              onClick={() => setCurrentStep(STEPS.FormForgot)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </Dialog.Close>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1 px-6 pt-4">
          {[STEPS.FormForgot, STEPS.OtpVerification, STEPS.ResetPassword].map((step, i) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                [STEPS.FormForgot, STEPS.OtpVerification, STEPS.ResetPassword].indexOf(currentStep) >= i
                  ? "bg-gray-900"
                  : "bg-gray-100"
              }`}
            />
          ))}
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PasswordForgotDialog;
