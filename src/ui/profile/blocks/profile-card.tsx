"use client";

import { Mail, UserRound } from "lucide-react";
import React from "react";

import { User } from "@/types";
import { EMPLOYEE_OPTIONS, ROLE_ICON_STYLES, ROLE_ICONS } from "@/ui/employees/constants";

export const ProfileCard = ({ user }: { user: User }) => {
  const employeeType = user?.type;

  const employeeLabel =
    EMPLOYEE_OPTIONS.find(option => option.value === employeeType)?.label ||
    (employeeType === "owner" ? "Owner" : "Logged-in User");

  const RoleIcon =
    employeeType && employeeType in ROLE_ICONS
      ? ROLE_ICONS[employeeType as keyof typeof ROLE_ICONS]
      : null;

  const roleIconStyle =
    ROLE_ICON_STYLES[employeeType as keyof typeof ROLE_ICON_STYLES] ||
    "border-cyan-400/20 bg-cyan-500/10 text-cyan-300";

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-5 sm:p-6">
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex size-24 items-center justify-center rounded-full border-3 shadow-2xl ${roleIconStyle}`}
        >
          {RoleIcon
            ? React.createElement(RoleIcon, {
                size: 40,
                strokeWidth: 1.6,
              })
            : React.createElement(UserRound, {
                size: 40,
                strokeWidth: 1.6,
              })}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-white">{user?.username || "User"}</h2>

        <p className="mt-1 text-xs text-slate-400">{employeeLabel}</p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-200">
              <Mail className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.18em] text-slate-500 uppercase">Email</p>
              <p className="mt-1 truncate text-xs font-medium text-slate-100">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-linear-to-r from-cyan-500/20 to-fuchsia-500/20 p-4">
          <p className="text-[11px] tracking-[0.18em] text-slate-300 uppercase">Security Status</p>
          <p className="mt-2 text-sm font-semibold text-white">Password protected</p>
        </div>
      </div>
    </div>
  );
};
