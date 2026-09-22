import { ReceiptPartyType, ResponseForMultipleReceipts, ResponseForReceipt } from "@/types";

import { serverAction } from "../server-action";

interface CreateReceiptPayload {
  party: string;
  type: ReceiptPartyType;
  amount: number;
  note?: string;
  paymentMethod: "cash" | "online";
}

export const getAllReceipts = async (params?: {
  page?: number;
  limit?: number;
  party?: string;
  type?: ReceiptPartyType;
}) => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.party) query.set("party", params.party);
    if (params?.type) query.set("type", params.type);

    const response = await serverAction({
      url: `/receipts?${query.toString()}`,
      method: "GET",
    });
    return response as ResponseForMultipleReceipts;
  } catch (error) {
    console.error("Failed to get receipts:", (error as Error).message);
    return null;
  }
};

export const createReceipt = async (data: CreateReceiptPayload) => {
  try {
    const response = await serverAction({
      url: "/receipts",
      method: "POST",
      body: data,
    });
    return response as ResponseForReceipt;
  } catch (error) {
    console.error("Failed to create receipt:", (error as Error).message);
    return null;
  }
};
