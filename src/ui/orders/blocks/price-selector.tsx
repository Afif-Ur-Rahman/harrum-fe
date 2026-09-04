"use client";

import { useEffect, useRef, useState } from "react";
import { Check, BadgeDollarSign } from "lucide-react";
import { formatPrice } from "@/utils";
import { Stock } from "@/types";

export type PriceType = "purchase" | "wholesale" | "sale";

const PRICE_OPTIONS: { value: PriceType; label: string }[] = [
  { value: "purchase", label: "Purchase" },
  { value: "wholesale", label: "Wholesale" },
  { value: "sale", label: "Sale" },
];

export const getUnitPrice = (stock: Stock | undefined, type: PriceType) => {
  if (!stock) return 0;
  if (type === "purchase") return Number(stock.purchasePrice) || 0;
  if (type === "wholesale") return Number(stock.wholesalePrice) || 0;
  return Number(stock.salePrice) || 0;
};

interface PriceSelectorProps {
  stock?: Stock;
  totalQuantity: number;
  value: PriceType;
  onChange: (value: PriceType) => void;
}

export const PriceSelector = ({
  stock,
  totalQuantity,
  value,
  onChange,
}: PriceSelectorProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = getUnitPrice(stock, value) * (totalQuantity || 0);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
      >
        <BadgeDollarSign className="h-3.5 w-3.5 text-cyan-300" />
        <span>{formatPrice(total)}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_100%)]" />

          <div className="relative z-10 py-1">
            {PRICE_OPTIONS.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/8 ${
                    isSelected ? "text-cyan-200" : "text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-cyan-300" />
                    ) : (
                      <span className="h-3.5 w-3.5" />
                    )}
                    {option.label}
                  </span>
                  <span className="font-semibold">
                    {getUnitPrice(stock, option.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
