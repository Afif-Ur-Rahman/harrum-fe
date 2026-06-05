"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaBarsStaggered } from "react-icons/fa6";
import { clearClientAuthCookies } from "@/utils/client-cookies";
import { logout } from "@/api/api-call/auth-api";
import NavRes from "@/components/layout/ResponsiveNavbar";
import { usePersistStore } from "@/store/presistStore";
import { User, LayoutGrid } from "lucide-react";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { BsEnvelopePlus } from "react-icons/bs";

const NAV_TABS = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/super-admin/stocks", label: "Stock", icon: BsEnvelopePlus },
  { href: "/super-admin/employees", label: "Employees", icon: User },
  { href: "/super-admin/profile", label: "Profile", icon: User },
];

interface SidebarHeaderProps {
  collapsed: boolean;
  userFullName?: string;
  image?: string;
  onToggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  userFullName,
  image,
  onToggle,
}) => (
  <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 text-white">
    <div className="flex items-center gap-3">
      <Image
        src={image || "/app-logo.png"}
        alt="Logo"
        width={40}
        height={40}
        className="h-9 w-9 rounded-full ring-2 ring-cyan-400/20 shrink-0"
      />
      {!collapsed && (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {userFullName || "Super Admin"}
          </div>
          <div className="text-xs text-slate-400">Control Center</div>
        </div>
      )}
    </div>

    <button
      onClick={onToggle}
      className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
      aria-label="Toggle sidebar"
    >
      <CaretRightIcon
        width={20}
        height={20}
        className={`transition-transform duration-300 ${
          collapsed ? "" : "rotate-180"
        }`}
      />
    </button>
  </div>
);

interface NavigationItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  isActive: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  href,
  label,
  icon: Icon,
  collapsed,
  isActive,
}) => (
  <li>
    <Link
      href={href}
      className={`ml-1 flex ${collapsed ? "w-fit" : "w-full"} items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 text-white shadow-lg shadow-cyan-950/30 ring-1 ring-inset ring-white/10"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  </li>
);

interface MobileHeaderProps {
  userFullName?: string;
  image?: string;
  isScrolled: boolean;
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  userFullName,
  image,
  isScrolled,
  onMenuClick,
}) => (
  <header
    className={`fixed left-0 right-0 top-0 z-40 border-b transition-all duration-200 lg:hidden ${
      isScrolled
        ? "border-white/10 bg-slate-950/85 shadow-xl shadow-black/20 backdrop-blur-xl"
        : "border-white/5 bg-slate-950/65 backdrop-blur-lg"
    }`}
  >
    <Flex justify="between" align="center" p="3" className="max-w-full">
      <Flex align="center" gap="2">
        <Image
          src={image || "/app-logo.png"}
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full ring-2 ring-cyan-400/20 shrink-0"
        />
        <span className="text-sm font-semibold text-white">
          {userFullName || "Super Admin"}
        </span>
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

function SuperAdminSidebar() {
  const pathname = usePathname();
  const { user, setUser, setToken } = usePersistStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      clearClientAuthCookies();
      router.push("/auth/login");
    }
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
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
        className={`sticky left-0 top-0 z-50 hidden h-screen border-r border-white/10 bg-[linear-gradient(180deg,_rgba(2,6,23,0.96)_0%,_rgba(15,23,42,0.94)_52%,_rgba(17,24,39,0.96)_100%)] shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.08),_transparent_32%)]" />

        <div className="relative h-full">
          <SidebarHeader
            collapsed={collapsed}
            userFullName={user?.fullName || user?.username}
            image={user?.image}
            onToggle={toggleSidebar}
          />

          <nav className="mt-4 border-b border-white/10 pb-4">
            <ul className="flex flex-col gap-2 px-3">
              {NAV_TABS.map((tab) => (
                <NavigationItem
                  key={tab.href}
                  {...tab}
                  collapsed={collapsed}
                  isActive={pathname === tab.href}
                />
              ))}
            </ul>
          </nav>

          {!collapsed && (
            <div className="absolute bottom-6 left-0 right-0 px-3">
              <button
                className="w-full rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-base font-medium text-white transition hover:bg-white/12"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <MobileHeader
        userFullName={user?.fullName || user?.username}
        image={user?.image}
        isScrolled={isScrolled}
        onMenuClick={() => setIsOpen(true)}
      />

      <NavRes
        userFullName={user?.fullName || user?.username}
        image={user?.image}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tabs={NAV_TABS}
        logout={handleLogout}
      />
    </div>
  );
}

export default SuperAdminSidebar;
