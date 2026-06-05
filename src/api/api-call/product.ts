import { serverAction } from "../server-action";
import { SimpleResponse } from "@/types";
import {
  ResponseForMultipleProduct,
  ResponseForSingleProduct,
} from "@/types/product";

export const createProduct = async (data: FormData) => {
  try {
    const response = await serverAction({
      url: "/product",
      method: "POST",
      body: data,
    });
    return response as ResponseForSingleProduct;
  } catch (error) {
    console.error("Failed to create product:", error);
    return null;
  }
};

export const updateProduct = async (data: FormData, id: string) => {
  try {
    const response = await serverAction({
      url: `/product/${id}`,
      method: "PUT",
      body: data,
    });
    return response as ResponseForSingleProduct;
  } catch (error) {
    console.error("Failed to update product:", error);
    return null;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/product/${id}`,
      method: "DELETE",
    });
    return response as SimpleResponse;
  } catch (error) {
    console.error("Failed to delete product:", error);
    return null;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await serverAction({
      url: `/product`,
      method: "GET",
    });
    return response as ResponseForMultipleProduct;
  } catch (error) {
    console.error("Failed to get all products:", error);
    return null;
  }
};

export const getTableMenu = async (tableId: string) => {
  try {
    const response = await serverAction({
      url: `/product/menu/${tableId}`,
      method: "GET",
    });
    return response as ResponseForMultipleProduct;
  } catch (error) {
    console.error("Failed to get menu for table:", error);
    return null;
  }
};

export const sortProducts = async (data: {
  products: { productId: string; sequence: number }[];
  categoryId: string;
}) => {
  try {
    const response = await serverAction({
      url: `/product/sort`,
      method: "POST",
      body: data,
    });
    return response as ResponseForMultipleProduct;
  } catch (error) {
    console.error("Failed to get menu for table:", error);
    return null;
  }
};
