"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignupForm } from "./form";
import { FormProvider } from "react-hook-form";
import OnboardingLayout from "@/components/OnboardingLayout";
import { useSignup } from "./useSignup";
import { AuthField } from "@/components/inputs/AuthField";
import { Mail, Lock } from "lucide-react";

const SignupPage = () => {
  const { onSignup } = useSignup();
  const form = useSignupForm();
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) return;
    setIsLoading(true);
    await form.handleSubmit(async (data) => {
      await onSignup(data);
      setIsLoading(false);
    })();
    setIsLoading(false);
  };

  return (
    <OnboardingLayout
      heading="Create your account"
      text="Start managing your restaurant today"
    >
      <FormProvider {...form}>
        <div className="space-y-5">
          <AuthField
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@restaurant.com"
            icon={<Mail size={16} />}
          />
          <AuthField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            icon={<Lock size={16} />}
          />

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group pt-1">
            <div
              onClick={() => setAgreed(v => !v)}
              className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${agreed ? "bg-gray-900 border-gray-900" : "border-gray-300 group-hover:border-gray-400"}`}
            >
              {agreed && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-600 select-none leading-snug">
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="text-gray-900 font-semibold hover:underline">
                Terms &amp; Conditions
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !agreed}
            className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </FormProvider>
    </OnboardingLayout>
  );
};

export default SignupPage;
