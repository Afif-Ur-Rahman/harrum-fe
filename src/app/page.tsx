import { redirect } from "next/navigation";

import { getAuthCookies } from "@/utils/cookies";
import { getDefaultRoute } from "@/utils/permissions";

export default async function HomePage() {
  const authCookies = await getAuthCookies();

  if (!authCookies?.accessToken || !authCookies?.user) {
    redirect("/auth/login");
  }

  const { user } = authCookies;

  redirect(getDefaultRoute(user));
}
