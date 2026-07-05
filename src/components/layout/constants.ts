import { LayoutGrid, Package, ShoppingBag, User, Users } from "lucide-react";
import { BsEnvelopePlus } from "react-icons/bs";

export const OWNER_NAV_TABS = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/super-admin/orders", label: "Orders", icon: ShoppingBag  },
  { href: "/super-admin/stocks", label: "Stock", icon: BsEnvelopePlus },
  { href: "/super-admin/employees", label: "Employees", icon: Users },
  { href: "/super-admin/profile", label: "Profile", icon: User },
];

export const ACCOUNTANT_NAV_TABS = [
  { href: "/accountant/stocks", label: "Stocks", icon: Package },
  { href: "/accountant/profile", label: "Profile", icon: User },
];
