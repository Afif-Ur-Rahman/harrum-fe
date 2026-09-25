export interface CustomerData {
  partyType: "Customer" | "Vendor";
  partyName: string;
  phone: string;
  email: string;
  remainingAmount?: number;
  date?: string;
}
