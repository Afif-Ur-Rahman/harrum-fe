import { SimpleResponse, User } from "@/types/auth";
import { serverAction } from "../server-action";

export const upDateProfile = async (data: FormData): Promise<User | null> => {
  try {
    const response = await serverAction({
      url: "/profile",
      method: "PUT",
      body: data,
    });

    if (response.state && response.data) {
      const userData = (response.data as { data: User }).data;
      return userData || null;
    }

    return null;
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
};

export const deleteProfile = async () => {
  try {
    const response = await serverAction({
      url: "/profile",
      method: "DELETE",
    });

    return response as SimpleResponse;
  } catch (error) {
    console.error("Error deleting profile:", error);
    return false;
  }
};
