"use client";

import { ReceiptText, UserRound } from "lucide-react";

import { Bill } from "@/types";
import { formatDateTime, formatPrice } from "@/utils";

export const BillCard = ({ bill }: { bill: Bill }) => {
  const createdBy =
    typeof bill.createdBy === "object"
      ? bill.createdBy.username
      : bill.createdBy;

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 gap-2">
      <div className="flex flex-col items-start justify-between gap-2">
        <div className="w-full flex justify-between gap-2">
          {/* Bill ID */}
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 shrink-0 text-slate-400" />

            <p className="truncate text-sm font-semibold text-white">
              {bill.billId}
            </p>
          </div>
          <span className="shrink-0 text-lg font-semibold text-rose-300">
            {formatPrice(bill.amount)}{" "}
            <span className="text-xs font-normal text-slate-400">PKR</span>
          </span>
        </div>

        <div className="w-full flex items-center justify-between flex-wrap">
          {/* Created by */}
          {createdBy && (
            <div className="flex items-center gap-1.5 text-xs">
              <UserRound className="h-3.5 w-3.5 text-slate-500" />

              <span className="text-slate-500">Created by</span>

              <span className="font-medium text-slate-300">{createdBy}</span>
            </div>
          )}

          {/* Date */}
          <p className="text-xs text-slate-500">
            {formatDateTime(bill.createdAt, true)}
          </p>
        </div>
      </div>

      {bill.note && (
        <p className="rounded-xl bg-black/20 px-3 py-2 text-xs text-slate-300">
          {bill.note}
        </p>
      )}
    </div>
  );
};
