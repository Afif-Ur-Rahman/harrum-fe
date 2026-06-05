import { User } from "./user";

export interface Employees {
  worker: User[];
  accountant: User[];
}

export interface ResponseForEmployee {
  state: boolean;
  data?: { message: string; data?: Employees };
  error?: string;
}

export interface CreateEmployeeResponse {
  state: boolean;
  data?: { message: string; data?: User };
  error?: string;
}
