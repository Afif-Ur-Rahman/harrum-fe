export interface Vendor {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorResponse {
  message: string;
  data: Vendor;
}

export interface VendorListResponse {
  message: string;
  data: Vendor[];
}

export interface ResponseForSingleVendor {
  state: boolean;
  data?: VendorResponse;
  error?: string;
}

export interface ResponseForMultipleVendors {
  state: boolean;
  data?: VendorListResponse;
  error?: string;
}
