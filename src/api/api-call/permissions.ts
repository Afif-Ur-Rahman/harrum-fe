import { UpdatePermissionPayload, UpdatePermissionResponse } from "@/types/permissions";

import { serverAction } from "../server-action";

export const updateEmployeePermissions = async (
  employeeId: string,
  data: UpdatePermissionPayload,
) => {
  try {
    const response = await serverAction({
      url: `/permissions/${employeeId}`,
      method: "PUT",
      body: data,
    });

    return response as UpdatePermissionResponse;
  } catch (error) {
    console.error("Failed to update employee permissions:", (error as Error).message);

    return null;
  }
};
