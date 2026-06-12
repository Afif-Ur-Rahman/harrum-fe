"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Flex, Text } from "@radix-ui/themes";
import { usePathname } from "next/navigation";

interface MobileDrawerProps {
  userFullName?: string;
  type?: string;
  isOpen: boolean;
  onClose: () => void;
  tabs: {
    href: string;
    label: string;
    icon?: React.ElementType;
  }[];
  logout: () => void;
}

const NavRes: React.FC<MobileDrawerProps> = ({
  userFullName,
  type,
  isOpen,
  onClose,
  tabs,
  logout,
}) => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-110 transition-opacity duration-300 lg:hidden ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 flex h-full min-w-[72%] max-w-xs flex-col justify-between overflow-hidden border-l border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(17,24,39,0.98)_100%)] shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.10),transparent_35%)]" />

        <div className="relative flex h-full flex-col">
          {/* Header */}
          <Flex
            justify="between"
            align="center"
            className="border-b border-white/10 px-5 py-4"
          >
            <Flex align="center" gap="3" className="min-w-0">
              <Image
                src={
                  type ? `/assets/svgs/${type}.svg` : "/assets/svgs/owner.svg"
                }
                alt={type || "Owner"}
                width={28}
                height={28}
              />

              <div className="min-w-0">
                <Text className="block truncate text-sm font-semibold text-white">
                  {userFullName || "Super Admin"}
                </Text>
                <Text className="block text-xs text-slate-400">
                  Control Center
                </Text>
              </div>
            </Flex>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <IoClose size="1.6rem" />
            </button>
          </Flex>

          {/* Navigation */}
          <nav className="flex-1 border-b border-white/10 px-3 py-5">
            <ul className="flex flex-col gap-2">
              {tabs.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 text-white shadow-lg shadow-cyan-950/30 ring-1 ring-inset ring-white/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {Icon && <Icon size={20} className="shrink-0" />}
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="px-4 py-5">
            <button
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-base font-medium text-white transition hover:bg-white/12"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { NavRes };
