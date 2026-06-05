"use client";

import { useRef, useState, useCallback } from "react";
import { Minus, Plus, X } from "lucide-react";

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
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={displayQty === 1 ? onRemove : handleDecrement}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-500 transition"
      >
        {displayQty === 1 ? (
          <X className="w-3 h-3" />
        ) : (
          <Minus className="w-3 h-3" />
        )}
      </button>
      <span className="w-6 text-center text-sm font-bold text-gray-900 tabular-nums">
        {displayQty}
      </span>
      <button
        onClick={handleIncrement}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
