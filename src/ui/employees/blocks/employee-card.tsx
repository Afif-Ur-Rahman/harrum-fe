"use client";

import { Edit, Mail, MapPin, Phone, ShieldUser, Trash2, UserRound, IdCard } from "lucide-react";
import React from "react";

import { EmptyState } from "@/components";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Employee } from "@/types";
import { PagePermission } from "@/types/permissions";
import { EmployeePermissionsDialog } from "@/ui/permissions";

import { ROLE_ACCENT_STYLES, ROLE_ICON_STYLES, ROLE_ICONS, ROLE_STYLES } from "../constants";

export type EmployeeType = Employee & { roleLabel: string };

interface EmployeeCardsProps {
  filtered: EmployeeType[];
  onDeleteEmployee: (id: string) => Promise<{ state: boolean; message?: string; error?: string }>;
  onEditEmployee: (employee: Employee) => void;
  onUpdatePermissions: (employeeId: string, pages: PagePermission[]) => Promise<boolean>;
  permissionLoading?: boolean;
}

export const EmployeeCards: React.FC<EmployeeCardsProps> = ({
  filtered,
  onDeleteEmployee,
  onEditEmployee,
  onUpdatePermissions,
  permissionLoading = false,
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
}

const EmployeeCard = ({
  employee,
  onDeleteEmployee,
  onEditEmployee,
  onUpdatePermissions,
  permissionLoading,
}: EmployeeCardProps) => {
  const RoleIcon = ROLE_ICONS[employee.type] ?? UserRound;
  const iconStyle = ROLE_ICON_STYLES[employee.type] ?? "border-white/10 bg-white/5 text-slate-300";
  const accentStyle = ROLE_ACCENT_STYLES[employee.type] ?? "bg-slate-500";

  return (
    <article className="group relative isolate overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-slate-900">
      {/* Minimal role accent */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${accentStyle} opacity-70 transition-opacity group-hover:opacity-100`}
      />

      <div className="relative p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconStyle}`}
            >
              <RoleIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-100">{employee.username}</h3>

              <span
                className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${
                  ROLE_STYLES[employee.roleLabel] ??
                  "bg-white/5 text-slate-300 ring-1 ring-white/10 ring-inset"
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
              className="rounded-lg border border-white/8 bg-white/3 p-2 text-slate-400 transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-200"
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
                  className="rounded-lg border border-white/8 bg-white/3 p-2 text-slate-400 transition-colors hover:border-rose-400/25 hover:bg-rose-400/10 hover:text-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              }
            />
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-5 space-y-3 rounded-xl border border-white/5 bg-black/10 p-3.5">
          <InfoRow icon={IdCard} label="CNIC" value={employee.cnic} />
          <InfoRow icon={Mail} label="Email" value={employee.email} />
          <InfoRow icon={Phone} label="Phone" value={employee.phone} />
        </div>

        {/* Guardian */}
        <section className="mt-5">
          <SectionHeading icon={ShieldUser} title="Guardian" />

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-white/1.5 p-3.5">
            <DetailItem label="Name" value={employee.guardianName} />
            <DetailItem label="Phone" value={employee.guardianPhone} />
          </div>
        </section>

        {/* Addresses */}
        <section className="mt-5">
          <SectionHeading icon={MapPin} title="Address" />

          <div className="space-y-3 rounded-xl border border-white/5 bg-white/1.5 p-3.5">
            <AddressItem label="Current" value={employee.currentAddress} />
            <div className="border-t border-white/5" />
            <AddressItem label="Permanent" value={employee.permanentAddress} />
          </div>
        </section>

        {/* Permissions */}
        <div className="mt-5 border-t border-white/8 pt-4">
          <EmployeePermissionsDialog
            key={employee._id}
            employee={employee}
            onUpdatePermissions={onUpdatePermissions}
            permissionLoading={permissionLoading}
          />
        </div>
      </div>
    </article>
  );
};

interface SectionHeadingProps {
  icon: React.ElementType;
  title: string;
}

const SectionHeading = ({ icon: Icon, title }: SectionHeadingProps) => (
  <div className="mb-2.5 flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-slate-500" />
    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
      {title}
    </span>
  </div>
);

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value?: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex min-w-0 items-start gap-2.5">
    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
    <span className="w-12 shrink-0 text-[11px] text-slate-500">{label}</span>
    <span className="min-w-0 flex-1 text-xs leading-5 break-all text-slate-300">
      {value || "—"}
    </span>
  </div>
);

interface DetailItemProps {
  label: string;
  value?: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div className="min-w-0">
    <p className="text-[10px] text-slate-500">{label}</p>
    <p className="mt-1 truncate text-xs font-medium text-slate-300">{value || "—"}</p>
  </div>
);

interface AddressItemProps {
  label: string;
  value?: string;
}

const AddressItem = ({ label, value }: AddressItemProps) => (
  <div className="flex items-start gap-3">
    <span className="w-14 shrink-0 pt-0.5 text-[10px] text-slate-500">{label}</span>
    <span className="min-w-0 flex-1 text-xs leading-5 wrap-break-word text-slate-300">
      {value || "—"}
    </span>
  </div>
);
