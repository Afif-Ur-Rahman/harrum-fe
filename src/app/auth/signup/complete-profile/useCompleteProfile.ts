import { completeProfile } from "@/api/api-call/auth-api";
import { usePersistStore } from "@/store/presistStore";
import { convertToFormData } from "@/utils";
import { useRouter } from "next/navigation";
import { CompleteProfileFormType } from "./schema";
import { setClientAuthCookies } from "@/utils/client-cookies";
import { showToast } from "@/utils/toast";

const useCompleteProfile = () => {
  const { push } = useRouter();
  const { setUser, setToken } = usePersistStore();

  const onCompleteProfile = async (data: CompleteProfileFormType) => {
    try {
      const formData = convertToFormData(data);
      const response = await completeProfile(formData);

      if (response?.error || !response?.data) {
        showToast("error", response?.error || "Profile Completion Failed");
        return;
      }

      // Success Toast (only once)
      showToast(
        "success",
        response?.data?.message || "Profile Completed Successfully"
      );

      sessionStorage.removeItem("signup_email");
      sessionStorage.removeItem("signup_otp");

      const user = response?.data?.data;
      if (!user?.token) {
        showToast("error", "Authentication failed. Please try again.");
        return;
      }
      setUser(user);
      setToken(user.token);

      setClientAuthCookies({ user, accessToken: user.token });

      push("/restaurant/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      showToast("error", message);
    }
  };

  return {
    onCompleteProfile,
  };
};

export { useCompleteProfile };