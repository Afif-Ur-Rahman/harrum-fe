"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, LogOut, Menu, X } from "lucide-react";
import { clearClientAuthCookies } from "@/utils/client-cookies";
import { logout } from "@/api/api-call/auth-api";
import { usePersistStore } from "@/store/presistStore";
import { NotificationPanel } from "@/components/ui/notification-panel";

export interface NavSection {
  label: string;
  items: { href: string; label: string; icon: React.ElementType }[];
}

interface AppSidebarProps {
  sections: NavSection[];
  homeHref: string;
  roleName: string;
}

export function AppSidebar({ sections, homeHref, roleName }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, setUser, setToken } = usePersistStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    } finally {
      setUser(null);
      setToken(null);
      clearClientAuthCookies();
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const avatarLetter = (user?.fullName ||
    user?.username ||
    roleName)[0].toUpperCase();

  const NavLinks = ({ closeOnClick = false }: { closeOnClick?: boolean }) => (
    <>
      {sections.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1">
              {section.label}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => closeOnClick && setMobileOpen(false)}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all group relative ${
                      active
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside
        className={`
    fixed lg:sticky top-0 left-0 h-screen
    flex flex-col bg-white border-r border-gray-200
    transition-all duration-300 z-50
    ${collapsed ? "w-21.25" : "w-64"}
    
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0
  `}
      >
        {/* Brand */}
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 min-h-16 relative">
          <div className="w-9 h-9 shrink-0 rounded-xl overflow-hidden ring-2 ring-gray-100">
            <Image
              src={user?.image || "/app-logo.png"}
              alt="logo"
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || roleName}
              </p>
              <p className="text-[11px] text-gray-400 capitalize">{roleName}</p>
            </div>
          )}

          {!collapsed && <NotificationPanel />}

          <div className="flex items-center">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="p-1.5 rounded-lg hover:text-gray-500 transition text-gray-400 shrink-0 "
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          <NavLinks />
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition group relative ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span>Logout</span>}
            {collapsed && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 lg:hidden flex items-center justify-between px-4 h-14 bg-white transition-shadow duration-200 ${
          isScrolled
            ? "shadow-md border-b border-gray-200"
            : "border-b border-gray-100"
        }`}
      >
        <Link href={homeHref} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-gray-100">
            <Image
              src={user?.image || "/app-logo.png"}
              alt="logo"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-sm font-bold text-gray-900 truncate max-w-35">
            {user?.fullName || roleName}
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationPanel />
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={user?.image || "/app-logo.png"}
                  alt="logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.fullName || roleName}
                </p>
                <p className="text-[11px] text-gray-400 capitalize">
                  {roleName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
            <NavLinks closeOnClick />
          </nav>

          {/* Drawer footer */}
          <div className="border-t border-gray-100 p-3 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-[11px] text-gray-400 capitalize">
                  {roleName}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
