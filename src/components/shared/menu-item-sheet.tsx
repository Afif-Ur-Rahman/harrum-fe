"use client";

import { useState, ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { Product, Variant } from "@/types/product";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { formatPrice } from "@/utils";

export interface MenuItemSheetProps {
  product: (Product & { media: string[] }) | null;
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
  /** Per-variant quantities — omit for a read-only (no stepper) view */
  variantQty?: Record<string, number>;
  onQuantityChange?: (variantId: string, qty: number) => void;
  /** Anything rendered in the sticky footer (CTA buttons, totals, etc.) */
  footer?: ReactNode;
}

export const MenuItemSheet = ({
  product,
  isOpen,
  onClose,
  currency = "",
  variantQty,
  onQuantityChange,
  footer,
}: MenuItemSheetProps) => {
  const [imgIndex, setImgIndex] = useState(0);

  if (!product) return null;

  const images = (product.media ?? []).filter(Boolean);
  const totalImages = images.length;
  const currentImg = Math.min(imgIndex, Math.max(totalImages - 1, 0));
  const isInteractive = !!variantQty && !!onQuantityChange;

  const totalAmount = isInteractive
    ? product.variants.reduce((sum, v) => sum + (variantQty![v._id] ?? 0) * v.price, 0)
    : 0;

  return (
    <BottomSheet
      title={product.title}
      open={isOpen}
      onClose={onClose}
      height="h-[90vh]"
      hideHeader
      childManagesScroll
      footer={
        footer ? (
          <div className="px-4 py-4 flex flex-col gap-3">
            {isInteractive && totalAmount > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <span className="text-base font-bold text-gray-900">
                  {formatPrice(totalAmount)}{" "}
                  <span className="text-xs font-normal text-gray-400">{currency}</span>
                </span>
              </div>
            )}
            {footer}
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col h-full overflow-y-auto">

        {/* ── Hero image ─────────────────────────────────────── */}
        <div className="relative w-full aspect-4/3 bg-gray-200 shrink-0 overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[currentImg]}
              alt={product.title}
              fill
              className="object-cover transition-opacity duration-200"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-4xl">🍽️</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Drag handle */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/50" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
          >
            ✕
          </button>

          {/* Unavailable badge */}
          {!product.isAvailable && (
            <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-sm">
              Unavailable
            </div>
          )}

          {/* Carousel */}
          {totalImages > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + totalImages) % totalImages)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % totalImages)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="absolute top-3 left-3 text-[11px] font-semibold bg-black/40 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                {currentImg + 1} / {totalImages}
              </span>
              <div className="absolute bottom-16 inset-x-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`h-1 rounded-full transition-all duration-200 ${
                      i === currentImg ? "bg-white w-5" : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title + description */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
            <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md">
              {product.title}
            </h2>
            {product.description && (
              <p className="text-sm text-white/75 mt-1 leading-snug line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-6 flex flex-col gap-5">
          {product.variants.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Options</p>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="flex flex-col gap-2.5">
                {product.variants.map((v: Variant) => {
                  const qty = variantQty?.[v._id] ?? 0;
                  const selected = qty > 0;

                  const ingredientNames = (v.ingredients ?? [])
                    .map((ing) =>
                      typeof ing.stock === "object" && ing.stock !== null ? ing.stock.name : null,
                    )
                    .filter(Boolean) as string[];

                  return (
                    <div
                      key={v._id}
                      className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                        selected ? "border-gray-900 shadow-md shadow-gray-900/8" : "border-gray-150 shadow-sm"
                      }`}
                    >
                      <div className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${selected ? "bg-gray-900" : "bg-white"}`}>
                        {isInteractive && (
                          <div className="shrink-0">
                            {selected
                              ? <CheckCircle2 className="w-4 h-4 text-white" />
                              : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            }
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${selected ? "text-white" : "text-gray-900"}`}>
                            {v.name}
                          </p>
                          <p className={`text-xs font-bold mt-0.5 ${selected ? "text-gray-300" : "text-emerald-600"}`}>
                            {formatPrice(v.price)}{" "}
                            <span className={`font-normal ${selected ? "text-gray-400" : "text-emerald-500/70"}`}>
                              {currency}
                            </span>
                          </p>
                        </div>

                        {isInteractive && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              disabled={qty === 0}
                              onClick={() => onQuantityChange!(v._id, Math.max(0, qty - 1))}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${
                                selected
                                  ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                                  : "border border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className={`w-5 text-center text-sm font-bold tabular-nums ${selected ? "text-white" : "text-gray-900"}`}>
                              {qty}
                            </span>
                            <button
                              onClick={() => onQuantityChange!(v._id, qty + 1)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg transition ${
                                selected
                                  ? "bg-white text-gray-900 hover:bg-gray-100"
                                  : "bg-gray-900 text-white hover:bg-gray-700"
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {ingredientNames.length > 0 && (
                        <div className={`px-4 py-2.5 flex items-start gap-2 border-t transition-colors ${
                          selected ? "bg-gray-800 border-gray-700" : "bg-amber-50/70 border-gray-100"
                        }`}>
                          <FlaskConical className={`w-3 h-3 mt-0.5 shrink-0 ${selected ? "text-amber-400" : "text-amber-500"}`} />
                          <div className="flex flex-wrap gap-1">
                            {ingredientNames.map((name) => (
                              <span
                                key={name}
                                className={`text-[10px] font-medium rounded-full px-2 py-0.5 leading-none ${
                                  selected
                                    ? "bg-gray-700 text-gray-300 border border-gray-600"
                                    : "bg-amber-100 text-amber-800 border border-amber-200/60"
                                }`}
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
