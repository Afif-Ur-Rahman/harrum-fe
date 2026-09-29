export type PermissionPage =
  "dashboard" | "employees" | "customers" | "vendors" | "stocks" | "orders" | "expenses";

export interface PagePermission {
  key: PermissionPage;
  allowed: boolean;
}

export interface EmployeePermission {
  _id: string;
  employee: string;
  pages: PagePermission[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePermissionPayload {
  pages: PagePermission[];
}

export interface UpdatePermissionResponse {
  data?: {
    message: string;
    data?: EmployeePermission;
  };
  error?: string;
}
