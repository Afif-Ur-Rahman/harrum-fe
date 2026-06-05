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
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { AuthField } from "@/components/inputs/AuthField";

// alias for local use
const Field = AuthField;

// ── Login page ────────────────────────────────────────────
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
        document.cookie = `rememberEmail=${encodeURIComponent(data.email)}; path=/; max-age=${60 * 60 * 24 * 30}`;
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
          <Field
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@restaurant.com"
            icon={<Mail size={16} />}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock size={16} />}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setRememberMe((v) => !v)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${rememberMe ? "bg-gray-900 border-gray-900" : "border-gray-300 group-hover:border-gray-400"}`}
              >
                {rememberMe && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
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
              <span className="text-sm text-gray-600 select-none">
                Remember me
              </span>
            </label>
            <PasswordForgotDialog />
          </div>

          {/* Sign in button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-gray-900 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </FormProvider>
    </OnboardingLayout>
  );
}

export default Login;
