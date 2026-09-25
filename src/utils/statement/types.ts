export interface StatementPayment {
  date: string;
  amount: number;
  method: string;
  note?: string;
}

export interface StatementOrderItem {
  name: string;
  quantity: string;
}

export interface StatementOrder {
  orderId: string;
  date: string;
  items: StatementOrderItem[];
  discount: number;
  total: number;
  isPaid: boolean;
}

export interface StatementBill {
  billId: string;
  date: string;
  note?: string;
  amount: number;
}

export interface StatementData {
  partyType: "Customer" | "Vendor";
  partyName: string;
  phone: string;
  email?: string;
  remainingAmount: number;
  payments: StatementPayment[];
  orders?: StatementOrder[];
  bills?: StatementBill[];
}
