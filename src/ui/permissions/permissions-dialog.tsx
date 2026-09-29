"use client";

import { Check, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";

import { ReuseableDialog } from "@/components";
import { Employee } from "@/types";
import { PagePermission, PermissionPage } from "@/types/permissions";

import { PAGES } from "./constants";

interface EmployeePermissionsDialogProps {
  employee: Employee;
  onUpdatePermissions: (employeeId: string, pages: PagePermission[]) => Promise<boolean>;
  permissionLoading?: boolean;
}

export const EmployeePermissionsDialog = ({
  employee,
  onUpdatePermissions,
  permissionLoading = false,
}: EmployeePermissionsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState<PagePermission[]>([]);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (value) {
      setPermissions(employee.permissions || []);
    } else {
      setPermissions([]);
    }
  };

  const isAllowed = (key: PermissionPage) => {
    return permissions.some(permission => permission.key === key && permission.allowed);
  };

  const togglePermission = (key: PermissionPage) => {
    setPermissions(current =>
      PAGES.map(page => {
        const existing = current.find(permission => permission.key === page.key);

        const allowed = existing?.allowed ?? false;

        return page.key === key
          ? {
              key: page.key,
              allowed: !allowed,
            }
          : {
              key: page.key,
              allowed,
            };
      }),
    );
  };

  const handleSave = async () => {
    const success = await onUpdatePermissions(employee._id, permissions);

    if (success) {
      setOpen(false);
      setPermissions([]);
    }
  };

  const allowedCount = (employee.permissions || []).filter(permission => permission.allowed).length;

  return (
    <ReuseableDialog
      title={`Permissions · ${employee.username}`}
      open={open}
      setOpen={handleOpenChange}
      triggerButton={
        <button
          type="button"
          onClick={() => handleOpenChange(true)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-left transition hover:border-cyan-400/20 hover:bg-cyan-500/5"
        >
          <span className="flex items-center gap-2.5">
            <KeyRound className="h-4 w-4 text-cyan-300" />

            <span>
              <span className="block text-xs font-medium text-slate-200">Permissions</span>

              <span className="block text-[10px] text-slate-500">
                {allowedCount} of {PAGES.length} pages allowed
              </span>
            </span>
          </span>

          <span className="text-[10px] font-medium text-slate-500">Manage</span>
        </button>
      }
      content={
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PAGES.map(page => {
              const checked = isAllowed(page.key);

              return (
                <label
                  key={page.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
                    checked
                      ? "border-cyan-400/20 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePermission(page.key)}
                    className="sr-only"
                  />

                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                      checked
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/20 bg-white/5"
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>

                  <span className="text-xs font-medium text-slate-300">{page.label}</span>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            disabled={permissionLoading}
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {permissionLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      }
    />
  );
};
