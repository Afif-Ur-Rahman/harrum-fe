import { PagePermission } from "./permissions";

export type EmployeeRole = "salesman" | "accountant";

export interface Employee {
  _id: string;
  username: string;
  email: string;
  type: EmployeeRole;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  permanentAddress: string;
  currentAddress: string;
  permissions: PagePermission[];
}

export interface Employees {
  salesman: Employee[];
  accountant: Employee[];
}

export interface ResponseForEmployee {
  data?: {
    data: Employees;
    message?: string;
  };
  error?: string;
}

export interface CreateEmployeeResponse {
  state: boolean;
  data?: { message: string; data?: Employee };
  error?: string;
}

export interface EmployeeMutationResponse {
  data?: {
    data: Employee;
    message?: string;
  };
  error?: string;
}
