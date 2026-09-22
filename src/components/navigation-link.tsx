"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

import { useNavigationLoader } from "./layout";

interface NavigationLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export const NavigationLink = ({ children, onClick, href, ...props }: NavigationLinkProps) => {
  const pathname = usePathname();
  const { startNavigation } = useNavigationLoader();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    // Only handle normal left-click navigation
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const targetPath = typeof href === "string" ? href : href.pathname;

    // Don't show loader when already on this route
    if (targetPath === pathname) {
      return;
    }

    startNavigation();
  };

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};
