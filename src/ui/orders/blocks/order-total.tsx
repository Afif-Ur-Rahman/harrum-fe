"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { formatPrice } from "@/utils";
import { OrderFormType } from "../form";

interface OrderTotalProps {
  orderTotal: number;
}

export const OrderTotal = ({ orderTotal }: OrderTotalProps) => {
  const { watch, setValue, getValues } = useFormContext<OrderFormType>();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const lastTapRef = useRef(0);

  const discount = Number(watch("discount")) || 0;
  const finalTotal = Math.max(orderTotal - discount, 0);

  const startEditing = () => {
    setDraft(discount ? String(discount) : "");
    setEditing(true);
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      startEditing();
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;
  };

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    const computed = String(finalTotal);

    if (getValues("totalPrice") !== computed) {
      setValue("totalPrice", computed, { shouldDirty: true });
    }
  }, [finalTotal, getValues, setValue]);

  const commitDiscount = () => {
    const value = Number(draft);
    const safeValue = !draft || isNaN(value) || value < 0 ? 0 : value;

    setValue("discount", String(safeValue), {
      shouldValidate: true,
    });

    setEditing(false);
  };

  return (
    <div
      onDoubleClick={startEditing}
      onTouchEnd={handleTouchEnd}
      className="text-sm text-slate-300 select-none touch-manipulation"
    >
      Order Total{" "}
      {editing ? (
        <input
          ref={inputRef}
          type="number"
          min={0}
          value={draft}
          placeholder="Discount"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDiscount}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitDiscount();
            }

            if (e.key === "Escape") {
              e.preventDefault();
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          className="ml-1 w-28 rounded-lg border border-cyan-300/40 bg-white/10 px-2 py-1 text-sm font-semibold text-white outline-none focus:border-cyan-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      ) : (
        <span className="ml-1 text-lg font-semibold text-white">
          {formatPrice(finalTotal)}
        </span>
      )}{" "}
      PKR
    </div>
  );
};
