"use client";

import { ShieldCheck } from "lucide-react";
import { usePersistStore } from "@/store/presistStore";
import { ProfileCard, ProfileUpdate } from "./blocks";

export const Profile = () => {
  const { user } = usePersistStore();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center rounded-[28px] text-white">
        <p className="text-lg text-slate-400">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden rounded-[28px] text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="space-y-6 p-4 sm:p-6 xl:p-8">
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)] lg:block" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
                  <ShieldCheck className="h-4 w-4" />
                  Account Security
                </div>

                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl xl:text-5xl">
                  My Profile
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  View your account information and update your password
                  securely from one place.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.4fr]">
            <ProfileCard user={user} />
            <ProfileUpdate />
          </section>
        </div>
      </div>
    </div>
  );
};
