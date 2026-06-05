import { verifyOtp } from "@/api/api-call/auth-api";
import { useRouter } from "next/navigation";
import { VerifyOtpFormType } from "./schema";

const useVerifyOtp = () => {
  const { push } = useRouter();

  const onVerifyOtp = async (data: VerifyOtpFormType) => {
    const response = await verifyOtp(data);
    if (response) {
      push("/signup/complete-profile");
    }
  };

  return {
    onVerifyOtp,
  };
};

export { useVerifyOtp };
