import { serverAction } from "../server-action";
import { SimpleResponse } from "@/types/auth";
import { CreateEmployeeResponse, ResponseForEmployee } from "@/types/employees";
import { EmployeeFormType } from "@/ui/super-admin/employees/schema";

export const getAllEmployees = async () => {
  try {
    const response = await serverAction({
      url: `/dashboard`,
      method: "GET",
    });
    return response as ResponseForEmployee;
  } catch (error) {
    console.error("Failed to fetch employees:", (error as Error).message);
    return null;
  }
};

export const createEmployees = async (data: EmployeeFormType) => {
  try {
    const response = await serverAction({
      url: `/dashboard/create-employee`,
      method: "POST",
      body: data,
    });
    return response as CreateEmployeeResponse;
  } catch (error) {
    console.error("Failed to create employee:", (error as Error).message);
    return null;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const response = await serverAction({
      url: `/dashboard/employee/${id}`,
      method: "DELETE",
    });
    return response as SimpleResponse;
  } catch (error) {
    console.error("Failed to delete employee:", (error as Error).message);
    return null;
  }
};
