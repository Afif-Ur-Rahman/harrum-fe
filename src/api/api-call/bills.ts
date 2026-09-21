import { serverAction } from "../server-action";
import { ResponseForBill, ResponseForMultipleBills } from "@/types";

interface CreateBillPayload {
  vendor: string;
  billId: string;
  amount: number;
  note?: string;
}

export const getAllBills = async (params?: {
  page?: number;
  limit?: number;
  vendor?: string;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.vendor) query.set("vendor", params.vendor);

    const response = await serverAction({
      url: `/bills?${query.toString()}`,
      method: "GET",
    });
    return response as ResponseForMultipleBills;
  } catch (error) {
    console.error("Failed to get bills:", (error as Error).message);
    return null;
  }
};

export const createBill = async (data: CreateBillPayload) => {
  try {
    const response = await serverAction({
      url: "/bills",
      method: "POST",
      body: data,
    });
    return response as ResponseForBill;
  } catch (error) {
    console.error("Failed to create bill:", (error as Error).message);
    return null;
  }
};
