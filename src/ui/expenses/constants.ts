import { Wallet, FileText, Tag, CreditCard } from "lucide-react";

import { ExpenseCategory } from "@/types";

import { ExpenseFormType } from "./form";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Rent",
  "Utilities",
  "Salary",
  "Transport",
  "Maintenance",
  "Misc",
];

export const EXPENSE_CATEGORY_OPTIONS = [
  { label: "Rent", value: "Rent" },
  { label: "Utilities", value: "Utilities" },
  { label: "Salary", value: "Salary" },
  { label: "Transport", value: "Transport" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Misc", value: "Misc" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

export const DEFAULT_EXPENSE_FORM: ExpenseFormType = {
  amount: "",
  note: "",
  category: "Misc",
  paymentMethod: "cash",
};

export const EMPTY_EXPENSE_FILTERS = {
  categories: [] as string[],
  paymentMethods: [] as string[],
  from: "",
  to: "",
};

export const EXPENSES_PER_PAGE = 30;

type FieldType = "text" | "number" | "select" | "textarea";

interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ExpenseField {
  name: string;
  type: FieldType;
  placeholder: string;
  icon?: React.ElementType;
  required?: boolean;
  options?: FieldOption[];
  label?: string; // optional if you want to drive the FormInput label from here too
}

export const EXPENSE_FIELDS: ExpenseField[] = [
  {
    name: "amount",
    type: "number",
    placeholder: "0",
    icon: Wallet,
    required: true,
    label: "Amount",
  },
  {
    name: "category",
    type: "select",
    placeholder: "Select category",
    icon: Tag,
    required: true,
    options: EXPENSE_CATEGORY_OPTIONS,
    label: "Category",
  },
  {
    name: "paymentMethod",
    type: "select",
    placeholder: "Select payment method",
    icon: CreditCard,
    required: true,
    options: PAYMENT_METHOD_OPTIONS,
    label: "Payment Method",
  },
  {
    name: "note",
    type: "textarea",
    placeholder: "What was this expense for?",
    icon: FileText,
    required: false,
    label: "Note",
  },
];
