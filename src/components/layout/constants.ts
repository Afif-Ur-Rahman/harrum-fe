import {
  LayoutGrid,
  ShoppingBag,
  User,
  Users,
  Contact,
  Store,
  Wallet2,
  Boxes,
  ShieldCheck,
  BriefcaseBusiness,
  Calculator,
  UserRound,
  SprayCan,
  Waves,
  ShieldUser,
} from "lucide-react";

import { PermissionPage } from "@/types";
import { hasPermission } from "@/utils/permissions";

export const NAV_TABS: {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: PermissionPage;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid, permission: "dashboard" },
  { href: "/orders", label: "Orders", icon: ShoppingBag, permission: "orders" },
  { href: "/customers", label: "Customers", icon: Contact, permission: "customers" },
  { href: "/vendors", label: "Vendors", icon: Store, permission: "vendors" },
  { href: "/stocks", label: "Stocks", icon: Boxes, permission: "stocks" },
  { href: "/expenses", label: "Expenses", icon: Wallet2, permission: "expenses" },
  { href: "/employees", label: "Employees", icon: Users, permission: "employees" },
  { href: "/profile", label: "Profile", icon: User },
];

export const getNavTabs = (user: Parameters<typeof hasPermission>[0]) =>
  NAV_TABS.filter(tab => !tab.permission || hasPermission(user, tab.permission));

export const ROLE_ICONS: Record<string, React.ElementType> = {
  owner: ShieldCheck,
  manager: BriefcaseBusiness,
  accountant: Calculator,
  senior_salesman: ShieldUser,
  salesman: UserRound,
  cleaner: SprayCan,
  mop_boy: Waves,
};

export const getRoleIcon = (type?: string): React.ElementType =>
  ROLE_ICONS[type?.toLowerCase() ?? ""] ?? UserRound;
