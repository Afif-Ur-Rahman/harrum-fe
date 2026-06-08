"use client";

import { KeyRound, Lock } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components";
import { useProfile } from "@/ui/profile/useProfile";

export const ProfileUpdate = () => {
  const { form, loading, submit } = useProfile();

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-200">
            Password Settings
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Change Password
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Use a strong password with at least 8 characters.
          </p>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-cyan-500 via-fuchsia-500 to-indigo-600 p-3 text-white shadow-lg shadow-fuchsia-500/20">
          <KeyRound className="h-6 w-6" />
        </div>
      </div>

      <FormProvider {...form}>
        <div className="space-y-4">
          <FormInput
            field="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            icon={Lock}
          />

          <FormInput
            field="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            icon={Lock}
          />

          <FormInput
            field="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            icon={Lock}
          />

          <button
            type="button"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-fuchsia-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-fuchsia-500/20 transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={submit}
          >
            <Lock className="h-4 w-4" />
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </FormProvider>
    </div>
  );
};
