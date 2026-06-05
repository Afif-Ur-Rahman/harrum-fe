"use server";

import { serverAction } from "@/api/server-action";
import type { User } from "@/types";
import { USERS_ENDPOINT } from "../endpoints";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await serverAction({
      url: USERS_ENDPOINT,
      method: "GET",
    });

    if (response.state && response.data) {
      // Handle the nested data structure from the API response
      const userData = (response.data as { data: User[] }).data;
      return userData || [];
    }

    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await serverAction({
      url: `${USERS_ENDPOINT}/${userId}`,
      method: "GET",
    });

    if (response.state && response.data) {
      const userData = (response.data as { data: User }).data;
      return userData || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<boolean> => {
  try {
    const response = await serverAction({
      url: `${USERS_ENDPOINT}/${userId}`,
      method: "PUT",
      body: userData,
    });

    return response.state;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const response = await serverAction({
      url: `${USERS_ENDPOINT}/${userId}`,
      method: "DELETE",
    });

    return response.state;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};
