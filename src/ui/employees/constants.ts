import { Home, IdCard, Lock, Mail, MapPin, Phone, Type, UserRound } from "lucide-react";

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
    field: "cnic",
    type: "text",
    placeholder: "NIC (12345-1234567-1)",
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
