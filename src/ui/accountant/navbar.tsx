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
import { User, LayoutGrid, Package } from "lucide-react";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";

const NAV_TABS = [
  { href: "/accountant/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/accountant/stocks", label: "Stocks", icon: Package },
  { href: "/accountant/profile", label: "Profile", icon: User },
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
  <div
    className={`flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer`}
  >
    <div className="flex items-center gap-3">
      <Image
        src={image || "/app-logo.png"}
        alt="Logo"
        width={40}
        height={40}
        className="w-8 h-8 rounded-full shrink-0"
      />
      {!collapsed && (
        <div className="font-bold text-md text-nowrap">
          {userFullName || "Accountant"}
        </div>
      )}
    </div>
    <CaretRightIcon
      onClick={onToggle}
      width={20}
      height={20}
      className={`transition-transform duration-300 shrink-0 ${
        collapsed ? "" : "rotate-180"
      }`}
    />
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
      className={`flex text-nowrap justify-start ml-1 ${
        collapsed ? "w-fit" : "w-full"
      } gap-3 rounded-lg p-2.5 text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-black text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
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
    className={`fixed top-0 left-0 right-0 z-40 lg:hidden transition-colors duration-200 ${
      isScrolled
        ? "bg-white border-b border-gray-200 shadow-md"
        : "bg-white border-b border-gray-100"
    }`}
  >
    <Flex justify="between" align="center" p="3" className="max-w-full">
      <Flex align="center" gap="2">
        <Image
          src={image || "/app-logo.png"}
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full shrink-0"
        />
        <span className="text-sm font-bold text-gray-900">
          {userFullName || "Accountant"}
        </span>
      </Flex>
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBarsStaggered size={20} className="text-gray-700" />
        </button>
      </div>
    </Flex>
  </header>
);

function AccountantSidebar() {
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
        className={`sticky top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg hidden lg:block
          transition-all duration-300 
          ${collapsed ? "w-20" : "w-64"} 
          z-50`}
      >
        <SidebarHeader
          collapsed={collapsed}
          userFullName={user?.fullName}
          image={user?.image}
          onToggle={toggleSidebar}
        />

        <nav className="mt-4 pb-4 border-b border-gray-200">
          <ul className="flex flex-col gap-2 px-3">
            {NAV_TABS.map((tab) => (
              <NavigationItem
                key={tab.href}
                {...tab}
                collapsed={collapsed}
                isActive={pathname.startsWith(tab.href)}
              />
            ))}
          </ul>
        </nav>

        {!collapsed && (
          <div className="absolute bottom-6 left-0 right-0 px-3">
            <button
              className="w-full text-lg capitalize cursor-pointer border px-3 py-1 rounded-md font-medium bg-black text-white hover:bg-gray-900 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
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

export default AccountantSidebar;
