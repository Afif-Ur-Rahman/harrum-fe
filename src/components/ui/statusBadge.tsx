import React from "react";

type Status = "pending" | "accepted" | "preparing" | "ready" | "completed" | "served" | string;

const statusStyles: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  accepted:  "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  preparing: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  ready:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  served:    "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  completed: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
  cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status}
  </span>
);

export default StatusBadge;
