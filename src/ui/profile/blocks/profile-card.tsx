"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import { User } from "@/types";

export const ProfileCard = ({ user }: { user: User }) => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 sm:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-2xl shadow-cyan-500/20">
          <Image
            src={
              user?.type
                ? `/assets/svgs/${user.type}.svg`
                : "/assets/svgs/owner.svg"
            }
            alt={user?.type || "Owner"}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-white">
          {user?.username || "User"}
        </h2>

        <p className="mt-1 text-xs capitalize text-slate-400">
          {user?.type || "Logged-in User"}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-200">
              <Mail className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Email
              </p>
              <p className="mt-1 truncate text-xs font-medium text-slate-100">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-linear-to-r from-cyan-500/20 to-fuchsia-500/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
            Security Status
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            Password protected
          </p>
        </div>
      </div>
    </div>
  );
};
