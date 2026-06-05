"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/utils";

export interface MenuCardProps {
  item: Product & { media: string[] };
  currency?: string;
  onClick?: () => void;
  /** Rendered in the top-right corner on hover — pass edit/delete/drag controls here */
  actions?: ReactNode;
  fallbackImage?: string;
}

export const MenuCard = ({
  item,
  currency = "",
  onClick,
  actions,
  fallbackImage = "/images/r-dummy.png",
}: MenuCardProps) => {
  const prices = item.variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const priceLabel =
    minPrice === null || maxPrice === null
      ? "N/A"
      : minPrice === maxPrice
        ? formatPrice(minPrice)
        : `${formatPrice(minPrice)}–${formatPrice(maxPrice)}`;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-4/3 bg-gray-100 overflow-hidden">
        <Image
          src={item.media[0] || fallbackImage}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 to-transparent" />

        {/* Price badge */}
        <div className="absolute bottom-2 left-2.5">
          <span className="text-xs font-bold text-white drop-shadow-sm">
            {priceLabel}{" "}
            <span className="font-normal opacity-80">{currency}</span>
          </span>
        </div>

        {/* Multi-image indicator */}
        {item.media.length > 1 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
            <Images className="w-2.5 h-2.5" />
            {item.media.length}
          </div>
        )}

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold tracking-wide bg-black/50 px-3 py-1 rounded-full uppercase">
              Unavailable
            </span>
          </div>
        )}

        {/* Actions slot — edit/delete/drag, shown on hover */}
        {actions && (
          <div
            className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 flex flex-col gap-0.5 flex-1">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
          {item.title}
        </p>
        {item.description && (
          <p className="text-[11px] text-gray-400 line-clamp-1 leading-snug mt-0.5">
            {item.description}
          </p>
        )}
        {item.variants.length > 1 && (
          <p className="text-[10px] text-gray-400 mt-1">
            {item.variants.length} options available
          </p>
        )}
      </div>
    </div>
  );
};
