import { register } from "@/api/api-call/auth-api";
import { useRouter } from "next/navigation";
import { SignupFormType } from "./schema";
import { showToast } from "@/utils/toast";

const useSignup = () => {
  const { push } = useRouter();


  const onSignup = async (data: SignupFormType) => {
    const result = await register(data);
    if (result?.error || !result?.data) {
      showToast("error",result?.error ||"Signup Failed")
      return;
    }
    showToast("success",result?.data?.message || "Signup Successfully")
    sessionStorage.setItem("signup_email", data.email);
    sessionStorage.setItem("otp_sent_at", Date.now().toString());
    push("/auth/signup/verify-otp");
    return result;
  };

  return {
    onSignup,
  };
};

export { useSignup };
