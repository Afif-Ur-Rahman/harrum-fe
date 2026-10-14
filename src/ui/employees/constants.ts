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
  PersonStanding,
  ShieldUser,
  SprayCan,
  Waves,
} from "lucide-react";

import type { Employee } from "@/types";

export const ROLE_STYLES: Record<string, string> = {
  Cleaner: "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-400/30",
  "Mop Boy": "bg-orange-500/15 text-orange-200 ring-1 ring-inset ring-orange-400/30",
  Salesman: "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Accountant: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
  Manager: "bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-400/30",
  "Senior Salesman": "bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/30",
};

export const ROLE_ICONS: Record<Employee["type"], React.ElementType> = {
  cleaner: SprayCan,
  mop_boy: Waves,
  salesman: PersonStanding,
  accountant: Calculator,
  manager: BriefcaseBusiness,
  senior_salesman: ShieldUser,
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
    placeholder: "Select employee role",
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
