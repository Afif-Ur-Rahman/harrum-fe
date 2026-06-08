import { serverAction } from "../server-action";

interface UpdatePasswordResponse {
  state: boolean;
  data: {
    success: boolean;
    message?: string;
  };
  error?: string;
}

interface UpdateProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdatePasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

const updatePassword = async (
  data: UpdateProps,
): Promise<UpdatePasswordResult> => {
  const response = (await serverAction({
    url: "/profile/change-password",
    method: "PUT",
    body: data,
  })) as UpdatePasswordResponse;
  if (response.state) {
    return {
      success: response.data.success,
      message: response?.data?.message || "Password changed successfully.",
    };
  }

  return {
    success: false,
    error: response.error || "Failed to change password.",
  };
};

export const profileAPI = {
  updatePassword,
};
