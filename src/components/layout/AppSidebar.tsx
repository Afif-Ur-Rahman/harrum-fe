"use client";

import { CaretRightIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";

import { NavRes } from "@/components/layout/ResponsiveNavbar";
import { useNavigation } from "@/lib/useNavigation";
import { usePersistStore } from "@/store/presistStore";
import { EMPLOYEE_OPTIONS } from "@/ui/employees/constants";
import { clearClientAuthCookies } from "@/utils/client-cookies";
import { showToast } from "@/utils/toast";

import { getNavTabs, getRoleIcon } from "./constants";

import { NavigationLink } from "../navigation-link";

interface SidebarHeaderProps {
  collapsed: boolean;
  userFullName?: string;
  type?: string;
  onToggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  userFullName,
  type,
  onToggle,
}) => {
  const employeeLabel = EMPLOYEE_OPTIONS.find(option => option.value === type)?.label || "User";

  return (
    <div
      className={`flex items-center border-b border-white/10 py-4 text-white transition-all duration-200 ease-in-out ${
        collapsed ? "justify-center px-2" : "justify-between px-4"
      }`}
    >
      <div
        className={`flex min-w-0 items-center gap-3 overflow-hidden transition-[max-width,opacity] duration-200 ease-in-out ${
          collapsed ? "max-w-0 opacity-0" : "max-w-52 opacity-100"
        }`}
      >
        <span className="flex size-6 shrink-0 items-center justify-center">
          {React.createElement(getRoleIcon(type), {
            size: 24,
            strokeWidth: 1.8,
            className: "text-cyan-400",
          })}
        </span>

        <div className="min-w-0 flex-1 whitespace-nowrap">
          <div className="truncate text-sm font-semibold text-white">
            {userFullName || "Super Admin"}
          </div>

          <div className="truncate text-xs text-slate-400">
            {type === "owner" ? "Control Center" : employeeLabel}
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`flex size-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 text-slate-300 transition-all duration-200 ease-in-out hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white ${collapsed && "border-fuchsia-400 hover:border-fuchsia-600 hover:bg-fuchsia-600/10"}`}
      >
        <CaretRightIcon
          width={20}
          height={20}
          className={`transition-transform duration-200 ease-in-out ${collapsed ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  );
};

interface NavigationItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  isActive: boolean;
}

const NavigationItem = React.memo(
  ({ href, label, icon: Icon, collapsed, isActive }: NavigationItemProps) => (
    <li>
      <NavigationLink
        href={href}
        className={`ml-1 flex ${
          collapsed ? "w-fit" : "w-full"
        } items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium ${
          isActive
            ? "bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 text-white shadow-lg ring-1 shadow-cyan-950/30 ring-white/10 ring-inset"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon size={20} className="shrink-0" />
        {!collapsed && <span>{label}</span>}
      </NavigationLink>
    </li>
  ),
);

NavigationItem.displayName = "NavigationItem";

interface MobileHeaderProps {
  userFullName?: string;
  type?: string;
  isScrolled: boolean;
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  userFullName,
  type,
  isScrolled,
  onMenuClick,
}) => (
  <header
    className={`fixed top-0 right-0 left-0 z-100 border-b transition-all duration-200 lg:hidden ${
      isScrolled
        ? "border-white/10 bg-slate-950/85 shadow-xl shadow-black/20 backdrop-blur-xl"
        : "border-white/5 bg-slate-950/65 backdrop-blur-lg"
    }`}
  >
    <Flex justify="between" align="center" p="3" className="max-w-full">
      <Flex align="center" gap="2">
        {React.createElement(getRoleIcon(type), {
          size: 24,
          strokeWidth: 1.8,
          className: "shrink-0 text-cyan-400",
        })}
        <span className="text-sm font-semibold text-white">{userFullName || "Super Admin"}</span>
      </Flex>

      <button
        className="rounded-xl p-2 text-slate-200 transition hover:bg-white/10 hover:text-white lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FaBarsStaggered size={20} />
      </button>
    </Flex>
  </header>
);

export const AppSidebar = () => {
  const pathname = usePathname();
  const { user, setUser, setToken } = usePersistStore();
  const router = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navTabs = useMemo(() => getNavTabs(user), [user]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    clearClientAuthCookies();
    showToast("success", "Success", "Logged Out Successfully");
    router.push("/auth/login");
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <aside
        className={`sticky top-0 left-0 z-50 hidden h-screen overflow-hidden border-r border-white/10 bg-slate-950 shadow-xl transition-[width] duration-200 ease-in-out motion-reduce:transition-none lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-cyan-400/5 via-transparent to-fuchsia-400/5" />
        <div className="relative h-full">
          <SidebarHeader
            collapsed={collapsed}
            userFullName={user?.username}
            type={user?.type}
            onToggle={toggleSidebar}
          />

          <nav className="mt-4 border-b border-white/10 pb-4">
            <ul className="flex flex-col gap-2 px-3">
              {navTabs.map(tab => (
                <NavigationItem
                  key={tab.href}
                  {...tab}
                  collapsed={collapsed}
                  isActive={pathname === tab.href || pathname.startsWith(`${tab.href}/`)}
                />
              ))}
            </ul>
          </nav>

          <div className="absolute right-0 bottom-6 left-0 px-3">
            <button
              title={collapsed ? "Logout" : undefined}
              aria-label="Logout"
              className={`flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-white/12 ${
                collapsed ? "justify-start" : "justify-start"
              }`}
              onClick={handleLogout}
            >
              <span className="flex size-5 shrink-0 items-center justify-center">
                <LogOut size={20} />
              </span>

              <span
                className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-200 ease-in-out ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      <MobileHeader
        userFullName={user?.username}
        type={user?.type}
        isScrolled={isScrolled}
        onMenuClick={() => setIsOpen(true)}
      />

      <NavRes
        userFullName={user?.username}
        type={user?.type}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tabs={navTabs}
        logout={handleLogout}
      />
    </div>
  );
};
