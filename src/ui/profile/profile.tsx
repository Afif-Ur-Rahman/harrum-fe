"use client";

import { ShieldCheck } from "lucide-react";
import { usePersistStore } from "@/store/presistStore";
import { ProfileCard, ProfileUpdate } from "./blocks";
import { PageLayout } from "@/components/layout";

export const Profile = () => {
  const { user } = usePersistStore();

  if (!user) {
    return (
      <div className="min-h-full flex items-center justify-center rounded-[28px] text-white">
        <p className="text-lg text-slate-400">No user data available.</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            My Profile
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            View your account information and update your password securely
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <ProfileCard user={user} />
        <ProfileUpdate />
      </section>
    </PageLayout>
  );
};
