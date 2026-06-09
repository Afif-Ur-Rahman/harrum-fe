import type { StockAlertItem } from "./types";

export const getStatusStyles = (status: StockAlertItem["status"]) => {
  if (status === "Critical") {
    return "bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-400/30";
  }

  if (status === "Low") {
    return "bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-300/30";
  }

  return "bg-sky-500/15 text-sky-100 ring-1 ring-inset ring-sky-300/30";
};
