"use client";

import { useEffect, useState } from "react";
import OnboardingLayout from "@/components/OnboardingLayout";
import { login } from "@/api/api-call/auth-api";
import { useLoginForm } from "./form";
import { FormProvider } from "react-hook-form";
import { setClientAuthCookies } from "@/utils/client-cookies";
import { usePersistStore } from "@/store/presistStore";
import { useRouter } from "next/navigation";
import PasswordForgotDialog from "@/ui/password-forgot/dialog";
import { showToast } from "@/utils/toast";
import { Mail, Lock } from "lucide-react";
import { FormInput } from "@/components";

function Login() {
  const form = useLoginForm();
  const { setUser, setToken } = usePersistStore();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      },
      {} as Record<string, string>,
    );

    if (cookies.rememberEmail) {
      form.setValue("email", cookies.rememberEmail);
      setTimeout(() => setRememberMe(true), 0);
    }
  }, [form]);

  const handleSubmit = async () => {
    setIsLoading(true);

    await form.handleSubmit(async (data) => {
      const result = await login({ ...data, rememberMe });

      if (result?.error || !result?.data) {
        showToast("error", result?.error || "Login Failed");
        setIsLoading(false);
        return;
      }

      const user = result?.data?.data;

      if (!user.token) {
        showToast("error", "Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setUser(user);
      setToken(user.token);
      setClientAuthCookies({ user, accessToken: user.token });

      if (rememberMe) {
        document.cookie = `rememberEmail=${encodeURIComponent(
          data.email,
        )}; path=/; max-age=${60 * 60 * 24 * 30}`;
      } else {
        document.cookie = `rememberEmail=; path=/; max-age=0`;
      }

      showToast("success", result?.data?.message || "Login Successfully");
      setIsLoading(false);

      if (user.type === "owner") {
        router.replace("/super-admin/dashboard");
      } else if (user.type === "accountant") {
        router.replace("/accountant/dashboard");
      } else {
        router.replace("/auth/login");
      }
    })();
  };

  return (
    <OnboardingLayout
      heading="Welcome back"
      text="Sign in to your management portal"
    >
      <FormProvider {...form}>
        <div className="space-y-5">
          <FormInput
            label="Email Address"
            field="email"
            type="email"
            placeholder="you@harrum.com"
            icon={Mail}
          />

          <FormInput
            label="Password"
            field="password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
          />

          <div className="flex items-center justify-between pt-1">
            <label
              className="group flex cursor-pointer items-center gap-2"
              onClick={() => setRememberMe((v) => !v)}
            >
              <div
                className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                  rememberMe
                    ? "border-cyan-400 bg-cyan-400"
                    : "border-white/20 bg-white/5 group-hover:border-cyan-300"
                }`}
              >
                {rememberMe && (
                  <svg
                    className="h-2.5 w-2.5 text-slate-950"
                    fill="none"
                    viewBox="0 0 10 8"
                  >
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <span className="select-none text-sm text-slate-300">
                Remember me
              </span>
            </label>

            <div className="text-sm text-cyan-300 transition hover:text-cyan-200">
              <PasswordForgotDialog />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-4 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-cyan-950/30 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </FormProvider>
    </OnboardingLayout>
  );
}

export default Login;
