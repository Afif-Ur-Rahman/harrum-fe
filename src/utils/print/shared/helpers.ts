import { formatPrice } from "../../price-format";

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const money = (value: number) => `${formatPrice(value)}/-`;

export const FileNameSafeDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export const StatementFileName = (partyName: string, date: Date) => {
  const safeName = partyName
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return `Statement-${safeName}-${FileNameSafeDate(date)}`;
};

export const getOrigin = () => (typeof window !== "undefined" ? window.location.origin : "");
