import { User, Mail, Phone } from "lucide-react";
import { OrderFormType } from "./form";

interface CustomerFormField {
  field: keyof Pick<OrderFormType, "customerName" | "email" | "phone">;
  label: string;
  placeholder: string;
  icon: React.ElementType;
  type?: "text" | "number" | "email" | "date" | "select";
  required?: boolean;
  options?: { label: string; value: string }[];
}

export const CUSTOMER_FORM_FIELDS: CustomerFormField[] = [
  {
    field: "customerName",
    label: "Customer Name",
    placeholder: "John Doe",
    icon: User,
    required: true,
  },
  {
    field: "email",
    label: "Email",
    placeholder: "customer@example.com",
    icon: Mail,
    type: "email",
    required: false,
  },
  {
    field: "phone",
    label: "Phone",
    placeholder: "0300 1234567",
    icon: Phone,
    required: true,
  },
];
