import { serverAction } from "../server-action";
import {
  ResponseForMultipleStocks,
  ResponseForMultipleVendors,
  ResponseForSingleVendor,
} from "@/types";

interface CreateVendorPayload {
  name: string;
  phone: string;
  email?: string;
  remainingAmount?: number;
}

interface UpdateVendorPayload {
  name: string;
  phone: string;
  email?: string;
}

export const getAllVendors =
  async (): Promise<ResponseForMultipleVendors | null> => {
    try {
      const response = await serverAction({
        url: "/vendors",
        method: "GET",
      });

      return response as ResponseForMultipleVendors;
    } catch (error) {
      console.error("Failed to get vendors:", (error as Error).message);
      return null;
    }
  };

export const getVendorStocks = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/vendors/${id}/stocks`,
      method: "GET",
    });

    return response as ResponseForMultipleStocks;
  } catch (error) {
    console.error("Failed to get vendor stocks:", (error as Error).message);
    return null;
  }
};

export const createVendor = async (data: CreateVendorPayload) => {
  try {
    const response = await serverAction({
      url: "/vendors",
      method: "POST",
      body: data,
    });

    return response as ResponseForSingleVendor;
  } catch (error) {
    console.error("Failed to create vendor:", (error as Error).message);
    return null;
  }
};

export const updateVendor = async (id: string, data: UpdateVendorPayload) => {
  try {
    const response = await serverAction({
      url: `/vendors/${id}`,
      method: "PUT",
      body: data,
    });

    return response as ResponseForSingleVendor;
  } catch (error) {
    console.error("Failed to update vendor:", (error as Error).message);
    return null;
  }
};

export const deleteVendor = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/vendors/${id}`,
      method: "DELETE",
    });

    return response as {
      state: boolean;
      data?: { message: string };
      error?: string;
    };
  } catch (error) {
    console.error("Failed to delete vendor:", (error as Error).message);
    return null;
  }
};
