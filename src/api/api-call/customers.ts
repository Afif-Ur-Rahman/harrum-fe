import { CustomerFormType } from "@/ui/customers/form";
import { serverAction } from "../server-action";
import {
  ResponseForMultipleCustomers,
  ResponseForSingleCustomer,
} from "@/types";

export const getAllCustomers = async () => {
  try {
    const response = await serverAction({
      url: "/customers",
      method: "GET",
    });
    return response as ResponseForMultipleCustomers;
  } catch (error) {
    console.error("Failed to get customers:", (error as Error).message);
    return null;
  }
};

export const createCustomer = async (data: CustomerFormType) => {
  try {
    const response = await serverAction({
      url: "/customers",
      method: "POST",
      body: data,
    });
    return response as ResponseForSingleCustomer;
  } catch (error) {
    console.error("Failed to create customer:", (error as Error).message);
    return null;
  }
};

export const updateCustomer = async (id: string, data: CustomerFormType) => {
  try {
    const response = await serverAction({
      url: `/customers/${id}`,
      method: "PUT",
      body: data,
    });
    return response as ResponseForSingleCustomer;
  } catch (error) {
    console.error("Failed to update customer:", (error as Error).message);
    return null;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/customers/${id}`,
      method: "DELETE",
    });
    return response as {
      state: boolean;
      data?: { message: string };
      error?: string;
    };
  } catch (error) {
    console.error("Failed to delete customer:", (error as Error).message);
    return null;
  }
};
