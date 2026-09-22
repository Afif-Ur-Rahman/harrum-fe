import { redirect } from "next/navigation";

import { getAuthCookies } from "@/utils/cookies";

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
