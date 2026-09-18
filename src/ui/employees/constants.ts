import { Home, Lock, Mail, MapPin, Pen, Phone, UserRound } from "lucide-react";

export const ROLE_STYLES: Record<string, string> = {
  Worker:
    "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Accountant: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
};

export const ROLE_PANEL_STYLES: Record<
  string,
  { accent: string; glow: string; iconClass: string }
> = {
  Worker: {
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/10",
    iconClass: "bg-emerald-500/15 text-emerald-200",
  },
  Accountant: {
    accent: "from-sky-500 via-indigo-500 to-blue-600",
    glow: "shadow-sky-500/10",
    iconClass: "bg-sky-500/15 text-sky-100",
  },
};

export const EMPLOYEE_FORM_INPUTS = [
  {
    field: "username",
    label: "Username",
    type: "text",
    placeholder: "username",
    icon: Pen,
    required: true,
  },
  {
    field: "email",
    label: "Email",
    type: "email",
    placeholder: "employee@example.com",
    icon: Mail,
    required: true,
  },
  {
    field: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "0300 1234567",
    icon: Phone,
    required: true,
  },
  {
    field: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 8 characters",
    icon: Lock,
    required: false,
  },
  {
    field: "guardianName",
    label: "Father / Guardian Name",
    type: "text",
    placeholder: "Father or guardian name",
    icon: UserRound,
    required: true,
  },
  {
    field: "guardianPhone",
    label: "Father / Guardian Number",
    type: "text",
    placeholder: "0300 1234567",
    icon: Phone,
    required: true,
  },
  {
    field: "permanentAddress",
    label: "Permanent Address",
    type: "textarea",
    placeholder: "Permanent address",
    icon: MapPin,
    required: true,
  },
  {
    field: "currentAddress",
    label: "Current Address",
    type: "textarea",
    placeholder: "Current address",
    icon: Home,
    required: true,
  },
] as const;

export const EMPLOYEE_TABLE_HEADERS = [
  {
    key: "username",
    label: "Employee",
    className: "px-5 py-4",
  },
  {
    key: "email",
    label: "Email",
    className: "hidden px-5 py-4 md:table-cell",
  },
  {
    key: "phone",
    label: "Phone",
    className: "hidden px-5 py-4 lg:table-cell",
  },
  {
    key: "type",
    label: "Role",
    className: "px-5 py-4",
  },
  {
    key: "guardianName",
    label: "Guardian",
    className: "hidden px-5 py-4 xl:table-cell",
  },
  {
    key: "guardianPhone",
    label: "Guardian Phone",
    className: "hidden px-5 py-4 xl:table-cell",
  },
  {
    key: "permanentAddress",
    label: "Permanent Address",
    className: "hidden px-5 py-4 2xl:table-cell",
  },
  {
    key: "currentAddress",
    label: "Current Address",
    className: "hidden px-5 py-4 2xl:table-cell",
  },
  {
    key: "actions",
    label: "Action",
    className: "px-5 py-4 text-right",
  },
] as const;
