import { User, Mail, Phone } from "lucide-react";

import { OrderFormType } from "./form";

interface CustomerFormField {
  field: keyof Pick<OrderFormType, "customerName" | "email" | "phone">;
  placeholder: string;
  icon: React.ElementType;
  type?: "text" | "number" | "email" | "date" | "select";
  required?: boolean;
  options?: { label: string; value: string }[];
  border?: string;
}

export const CUSTOMER_FORM_FIELDS: CustomerFormField[] = [
  {
    field: "customerName",
    placeholder: "Customer Name",
    icon: User,
    required: true,
    border: "rounded-lg",
  },
  {
    field: "email",
    placeholder: "Email",
    icon: Mail,
    type: "email",
    required: false,
    border: "rounded-lg",
  },
  {
    field: "phone",
    placeholder: "Phone",
    icon: Phone,
    required: true,
    border: "rounded-lg",
  },
];
