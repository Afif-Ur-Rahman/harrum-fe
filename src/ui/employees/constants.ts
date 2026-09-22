import { Home, Lock, Mail, MapPin, Phone, Type, UserRound } from "lucide-react";

export const ROLE_STYLES: Record<string, string> = {
  Salesman: "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Accountant: "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30",
};

export const ROLE_PANEL_STYLES: Record<
  string,
  { accent: string; glow: string; iconClass: string }
> = {
  Salesman: {
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
