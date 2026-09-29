"use client";

import {
  Calculator,
  Edit,
  Mail,
  MapPin,
  Phone,
  PersonStanding,
  ShieldUser,
  Trash2,
  UserRound,
} from "lucide-react";
import React from "react";

import { EmptyState } from "@/components";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Employee } from "@/types";
import { PagePermission } from "@/types/permissions";
import { EmployeePermissionsDialog } from "@/ui/permissions";

export type EmployeeType = Employee & { roleLabel: string };

interface EmployeeCardsProps {
  filtered: EmployeeType[];
  onDeleteEmployee: (id: string) => Promise<{ state: boolean; message?: string; error?: string }>;
  onEditEmployee: (employee: Employee) => void;
  onUpdatePermissions: (employeeId: string, pages: PagePermission[]) => Promise<boolean>;
  permissionLoading?: boolean;
  roleStyles?: Record<string, string>;
}

export const EmployeeCards: React.FC<EmployeeCardsProps> = ({
  filtered,
  onDeleteEmployee,
  onEditEmployee,
  onUpdatePermissions,
  permissionLoading = false,
  roleStyles = {},
}) => {
  if (!filtered.length) {
    return (
      <EmptyState
        icon={UserRound}
        title="No employees found"
        description="Try adjusting your search or add a new employee."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map(employee => (
        <EmployeeCard
          key={employee._id}
          employee={employee}
          onDeleteEmployee={onDeleteEmployee}
          onEditEmployee={onEditEmployee}
          onUpdatePermissions={onUpdatePermissions}
          permissionLoading={permissionLoading}
          roleStyles={roleStyles}
        />
      ))}
    </div>
  );
};

interface EmployeeCardProps {
  employee: EmployeeType;
  onDeleteEmployee: (id: string) => Promise<{ state: boolean; message?: string; error?: string }>;
  onEditEmployee: (employee: Employee) => void;
  onUpdatePermissions: (employeeId: string, pages: PagePermission[]) => Promise<boolean>;
  permissionLoading: boolean;
  roleStyles: Record<string, string>;
}

const EmployeeCard = ({
  employee,
  onDeleteEmployee,
  onEditEmployee,
  onUpdatePermissions,
  permissionLoading,
  roleStyles,
}: EmployeeCardProps) => {
  const isSalesman = employee.type === "salesman";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4.5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6">
      {/* Subtle glow */}
      <div
        className={`pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl ${
          isSalesman ? "bg-cyan-500/10" : "bg-fuchsia-500/10"
        }`}
      />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                isSalesman
                  ? "border-cyan-400/20 bg-cyan-500/10"
                  : "border-fuchsia-400/20 bg-fuchsia-500/10"
              }`}
            >
              {isSalesman ? (
                <PersonStanding className="h-5 w-5 text-cyan-300" />
              ) : (
                <Calculator className="h-5 w-5 text-fuchsia-300" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">{employee.username}</h3>

              <span
                className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  roleStyles[employee.roleLabel] ??
                  "bg-white/10 text-slate-300 ring-1 ring-white/10 ring-inset"
                }`}
              >
                {employee.roleLabel}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEditEmployee(employee)}
              aria-label={`Edit ${employee.username}`}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-200"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>

            <ConfirmationDialog
              title="Delete Employee"
              description="Are you sure you want to delete this employee? This action cannot be undone."
              saveButtonTitle="Delete"
              confirmAction={() => onDeleteEmployee(employee._id)}
              trigger={
                <button
                  type="button"
                  aria-label={`Delete ${employee.username}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              }
            />
          </div>
        </div>

        {/* Contact */}
        <div className="mt-5 space-y-2.5">
          <InfoRow icon={Mail} label="Email" value={employee.email} />
          <InfoRow icon={Phone} label="Phone" value={employee.phone} />
        </div>

        <div className="my-4 border-t border-white/8" />

        {/* Guardian */}
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <ShieldUser className="h-3.5 w-3.5 text-slate-500" />

            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Guardian
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="Name" value={employee.guardianName} />
            <DetailItem label="Phone" value={employee.guardianPhone} />
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-4">
          <div className="mb-2.5 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />

            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Address
            </span>
          </div>

          <div className="space-y-3">
            <AddressItem label="Current" value={employee.currentAddress} />
            <AddressItem label="Permanent" value={employee.permanentAddress} />
          </div>
        </div>

        <div className="mt-5 border-t border-white/8 pt-4">
          <EmployeePermissionsDialog
            key={employee._id}
            employee={employee}
            onUpdatePermissions={onUpdatePermissions}
            permissionLoading={permissionLoading}
          />
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value?: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />

      <span className="w-12 shrink-0 text-[11px] text-slate-400">{label}</span>

      <span className="min-w-0 text-xs wrap-break-word text-slate-300">{value || "—"}</span>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value?: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400">{label}</p>

      <p className="mt-0.5 truncate text-xs font-medium text-slate-300">{value || "—"}</p>
    </div>
  );
};

interface AddressItemProps {
  label: string;
  value?: string;
}

const AddressItem = ({ label, value }: AddressItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <span className="w-14 shrink-0 pt-0.5 text-[10px] text-slate-400">{label}</span>

      <span className="min-w-0 text-xs leading-5 wrap-break-word text-slate-300">
        {value || "—"}
      </span>
    </div>
  );
};
