"use client";

import { Minus, Plus, X } from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onChange?: (qty: number) => void;
  debounceMs?: number;
}

export const QuantityControl = ({
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  onChange,
  debounceMs = 0,
}: QuantityControlProps) => {
  const [localQty, setLocalQty] = useState(quantity);
  const [isPending, setIsPending] = useState(false);
  const pendingQty = useRef(quantity);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDebounced = onChange && debounceMs > 0;

  const commit = useCallback(
    (next: number) => {
      pendingQty.current = next;
      setLocalQty(next);
      setIsPending(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setIsPending(false);
        onChange!(next);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  const handleDecrement = () => {
    if (isDebounced) {
      // Use prop as base when idle so pendingQty stays fresh without touching it during render
      const base = isPending ? pendingQty.current : quantity;
      if (base <= 1) {
        if (timer.current) clearTimeout(timer.current);
        setIsPending(false);
        onRemove();
      } else {
        commit(base - 1);
      }
    } else {
      onDecrement();
    }
  };

  const handleIncrement = () => {
    if (isDebounced) {
      const base = isPending ? pendingQty.current : quantity;
      commit(base + 1);
    } else {
      onIncrement();
    }
  };

  const displayQty = isDebounced && isPending ? localQty : quantity;

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        onClick={displayQty === 1 ? onRemove : handleDecrement}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-red-300 hover:text-red-500"
      >
        {displayQty === 1 ? <X className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
      </button>
      <span className="w-6 text-center text-sm font-bold text-gray-900 tabular-nums">
        {displayQty}
      </span>
      <button
        onClick={handleIncrement}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white transition hover:bg-gray-700"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
};
