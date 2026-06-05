import { getAuthCookies } from "@/utils/cookies";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const authCookies = await getAuthCookies();

  if (!authCookies?.accessToken || !authCookies?.user) {
    redirect("/auth/login");
  }

  const { user } = authCookies;

  if (user.type === "owner") {
    redirect("/super-admin/dashboard");
  }

  redirect("/auth/login");
}
