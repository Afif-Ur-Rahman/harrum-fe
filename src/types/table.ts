export interface Table {
  _id: string;
  table: number;
  type?: string;
  section?: string;
  status: string;
  orderStatus?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  assignedWaiter?: {
    _id: string;
    fullName: string;
    username: string;
  } | null;
}


export interface TableResponseMultiple {
  message: string;
  data: Table[];
}
export interface TableResponseSingle {
  message: string;
  data: Table;
}

export interface ResponseForSingleTable {
  state: boolean;
  data?: TableResponseSingle;
  error?: string;
}

export interface ResponseForMultipleTables {
  state: boolean;
  data?: TableResponseMultiple;
  error?: string;
}
