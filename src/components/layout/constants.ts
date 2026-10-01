import { LayoutGrid, ShoppingBag, User, Users, Contact, Store, Wallet2, Boxes } from "lucide-react";

import { PermissionPage } from "@/types";
import { hasPermission } from "@/utils/permissions";

export const NAV_TABS: {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: PermissionPage;
}[] = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutGrid, permission: "dashboard" },
  { href: "/super-admin/orders", label: "Orders", icon: ShoppingBag, permission: "orders" },
  { href: "/super-admin/customers", label: "Customers", icon: Contact, permission: "customers" },
  { href: "/super-admin/vendors", label: "Vendors", icon: Store, permission: "vendors" },
  { href: "/super-admin/stocks", label: "Stocks", icon: Boxes, permission: "stocks" },
  { href: "/super-admin/expenses", label: "Expenses", icon: Wallet2, permission: "expenses" },
  { href: "/super-admin/employees", label: "Employees", icon: Users, permission: "employees" },
  { href: "/super-admin/profile", label: "Profile", icon: User }, // always visible
];

export const getNavTabs = (user: Parameters<typeof hasPermission>[0]) =>
  NAV_TABS.filter(tab => !tab.permission || hasPermission(user, tab.permission));
