import {
  LayoutGrid,
  Package,
  ShoppingBag,
  User,
  Users,
  Contact,
  Store,
  Wallet2,
  Boxes,
} from "lucide-react";

export const OWNER_NAV_TABS = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/super-admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/super-admin/customers", label: "Customers", icon: Contact },
  { href: "/super-admin/vendors", label: "Vendors", icon: Store },
  { href: "/super-admin/stocks", label: "Stocks", icon: Boxes },
  { href: "/super-admin/expenses", label: "Expenses", icon: Wallet2 },
  { href: "/super-admin/employees", label: "Employees", icon: Users },
  { href: "/super-admin/profile", label: "Profile", icon: User },
];

export const ACCOUNTANT_NAV_TABS = [
  { href: "/accountant/stocks", label: "Stocks", icon: Package },
  { href: "/accountant/profile", label: "Profile", icon: User },
];
