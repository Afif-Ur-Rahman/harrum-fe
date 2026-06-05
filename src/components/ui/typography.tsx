"use client";

import React from "react";
import clsx from "clsx";

interface TypographyProps {
  children: React.ReactNode;
  variant?: "heading" | "paragraphMedium" | "paragraphSmall";
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "paragraphMedium",
  className,
}) => {
  const base = "text-gray-900";
  const variants = {
    heading: "text-lg font-semibold",
    paragraphMedium: "text-sm",
    paragraphSmall: "text-xs",
  };

  return (
    <p className={clsx(base, variants[variant], className)}>{children}</p>
  );
};
