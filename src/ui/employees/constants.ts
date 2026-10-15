import {
  Home,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Type,
  UserRound,
  BriefcaseBusiness,
  Calculator,
  ShieldUser,
  SprayCan,
  Waves,
} from "lucide-react";

import type { Employee, EmployeeRole } from "@/types";

export type EmployeeTab = "all" | EmployeeRole;

export const ROLE_STYLES: Record<string, string> = {
  Cleaner: "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-400/30",
  "Mop Boy": "bg-orange-500/15 text-orange-200 ring-1 ring-inset ring-orange-400/30",
  Salesman: "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Accountant: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
  Manager: "bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-400/30",
  "Senior Salesman": "bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/30",
};

export const ROLE_ICONS: Record<Employee["type"], React.ElementType> = {
  manager: BriefcaseBusiness,
  accountant: Calculator,
  senior_salesman: ShieldUser,
  salesman: UserRound,
  cleaner: SprayCan,
  mop_boy: Waves,
};

export const ROLE_ICON_STYLES: Record<Employee["type"], string> = {
  cleaner: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  mop_boy: "border-sky-400/20 bg-sky-500/10 text-sky-300",
  salesman: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
  accountant: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300",
  manager: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  senior_salesman: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
};

export const ROLE_ACCENT_STYLES: Record<Employee["type"], string> = {
  cleaner: "bg-amber-400",
  mop_boy: "bg-sky-400",
  salesman: "bg-cyan-400",
  accountant: "bg-fuchsia-400",
  manager: "bg-violet-400",
  senior_salesman: "bg-emerald-400",
};

export const TAB_COLORS: Record<EmployeeTab, { active: string; hover: string }> = {
  all: {
    active: "bg-slate-700/60 text-white ring-1 ring-inset ring-slate-500/40 shadow-sm",
    hover: "hover:bg-slate-800/70 hover:text-white",
  },
  manager: {
    active: "bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-400/30",
    hover: "hover:bg-violet-500/10 hover:text-violet-200",
  },
  accountant: {
    active: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
    hover: "hover:bg-sky-500/10 hover:text-sky-100",
  },
  senior_salesman: {
    active: "bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/30",
    hover: "hover:bg-indigo-500/10 hover:text-indigo-200",
  },
  salesman: {
    active: "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
    hover: "hover:bg-emerald-500/10 hover:text-emerald-200",
  },
  cleaner: {
    active: "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-400/30",
    hover: "hover:bg-amber-500/10 hover:text-amber-200",
  },
  mop_boy: {
    active: "bg-orange-500/15 text-orange-200 ring-1 ring-inset ring-orange-400/30",
    hover: "hover:bg-orange-500/10 hover:text-orange-200",
  },
};

export const EMPLOYEE_SECTIONS = [
  { key: "manager", roleLabel: "Manager" },
  { key: "accountant", roleLabel: "Accountant" },
  { key: "senior_salesman", roleLabel: "Senior Salesman" },
  { key: "salesman", roleLabel: "Salesman" },
  { key: "cleaner", roleLabel: "Cleaner" },
  { key: "mop_boy", roleLabel: "Mop Boy" },
] as const satisfies {
  key: EmployeeRole;
  roleLabel: string;
}[];

export const EMPLOYEE_FORM_INPUTS = [
  {
    field: "cnic",
    type: "text",
    placeholder: "CNIC (12345-1234567-1)",
    icon: IdCard,
    required: true,
    rules: {
      required: "CNIC is required",
      pattern: {
        value: /^\d{5}-\d{7}-\d$/,
        message: "Enter a valid CNIC (12345-1234567-1)",
      },
    },
    className: "",
  },
  {
    field: "username",
    type: "text",
    placeholder: "Username",
    icon: Type,
    required: true,
    className: "",
  },
  {
    field: "email",
    type: "email",
    placeholder: "Email",
    icon: Mail,
    required: true,
    className: "",
  },
  {
    field: "phone",
    type: "text",
    placeholder: "Phone Number",
    icon: Phone,
    required: true,
    className: "",
  },
  {
    field: "password",
    type: "password",
    placeholder: "Password Min. 8 characters",
    icon: Lock,
    required: false,
    className: "",
  },
  {
    field: "guardianName",
    type: "text",
    placeholder: "Father / Guardian name",
    icon: UserRound,
    required: true,
    className: "",
  },
  {
    field: "guardianPhone",
    type: "text",
    placeholder: "Father / Guardian Number",
    icon: Phone,
    required: true,
    className: "",
  },
  {
    field: "type",
    type: "select",
    placeholder: "Select employee type",
    icon: BriefcaseBusiness,
    required: true,
    options: [
      { label: "Cleaner", value: "cleaner" },
      { label: "Mop Boy", value: "mop_boy" },
      { label: "Salesman", value: "salesman" },
      { label: "Accountant", value: "accountant" },
      { label: "Manager", value: "manager" },
      { label: "Senior Salesman", value: "senior_salesman" },
    ],
    className: "",
  },
  {
    field: "permanentAddress",
    type: "textarea",
    placeholder: "Permanent address",
    icon: MapPin,
    required: true,
    className: "sm:col-span-2",
  },
  {
    field: "currentAddress",
    type: "textarea",
    placeholder: "Current address",
    icon: Home,
    required: true,
    className: "sm:col-span-2",
  },
] as const;
