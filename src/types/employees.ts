import { PagePermission } from "./permissions";

export type EmployeeRole =
  "cleaner" | "mop_boy" | "salesman" | "accountant" | "manager" | "senior_salesman";

export interface Employee {
  _id: string;
  username: string;
  email: string;
  cnic: string;
  type: EmployeeRole;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  permanentAddress: string;
  currentAddress: string;
  permissions: PagePermission[];
}

export interface Employees {
  cleaner: Employee[];
  mop_boy: Employee[];
  salesman: Employee[];
  accountant: Employee[];
  manager: Employee[];
  senior_salesman: Employee[];
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
  data?: {
    message: string;
    data?: Employee;
  };
  error?: string;
}

export interface EmployeeMutationResponse {
  data?: {
    data: Employee;
    message?: string;
  };
  error?: string;
}
