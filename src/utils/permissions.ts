import type { PermissionPage, User } from "@/types";

type PermissionUser = Pick<User, "type" | "permissions"> | null | undefined;

export const PAGE_ROUTES: Record<PermissionPage, string> = {
  dashboard: "/dashboard",
  orders: "/orders",
  customers: "/customers",
  vendors: "/vendors",
  stocks: "/stocks",
  expenses: "/expenses",
  employees: "/employees",
};

export const hasPermission = (user: PermissionUser, page: PermissionPage) => {
  if (!user) return false;
  if (user.type === "owner") return true;
  return !!user.permissions?.some(p => p.key === page && p.allowed);
};

const getPageForPath = (pathname: string): PermissionPage | null => {
  const match = (Object.entries(PAGE_ROUTES) as [PermissionPage, string][]).find(
    ([, route]) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return match ? match[0] : null;
};

export const canAccessPath = (user: PermissionUser, pathname: string) => {
  const page = getPageForPath(pathname);
  return page ? hasPermission(user, page) : !!user;
};

export const getDefaultRoute = (user: PermissionUser) => {
  if (!user) return "/auth/login";
  if (user.type === "owner") return PAGE_ROUTES.dashboard;

  const first = (Object.keys(PAGE_ROUTES) as PermissionPage[]).find(p => hasPermission(user, p));
  return first ? PAGE_ROUTES[first] : "/profile";
};
