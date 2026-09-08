export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  message: string;
  data: Customer;
}

export interface CustomerListResponse {
  message: string;
  data: Customer[];
}

export interface ResponseForSingleCustomer {
  state: boolean;
  data?: CustomerResponse;
  error?: string;
}

export interface ResponseForMultipleCustomers {
  state: boolean;
  data?: CustomerListResponse;
  error?: string;
}
