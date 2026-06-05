import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, APP_ENV, USER_COOKIE } from "@/constants";
import type { AuthCookies } from "@/types";

const getAuthCookies = async (): Promise<AuthCookies | undefined> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const userJson = cookieStore.get(USER_COOKIE)?.value;

  if (!accessToken || !userJson) {
    return undefined;
  }

  try {
    const user = JSON.parse(userJson);

    return {
      user,
      accessToken,
    };
  } catch {
    return undefined;
  }
};

const setAuthCookies = async (value: AuthCookies) => {
  const cookieStore = await cookies();
  const secure = APP_ENV === "prod";
  const sameSite = "lax";
  const httpOnly = true;

  cookieStore.set(ACCESS_TOKEN_COOKIE, value.accessToken, {
    secure,
    httpOnly,
    sameSite,
  });

  cookieStore.set(USER_COOKIE, JSON.stringify(value.user), {
    secure,
    httpOnly,
    sameSite,
  });
};

const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: ACCESS_TOKEN_COOKIE,
  });

  cookieStore.delete({
    name: USER_COOKIE,
  });
};

export { getAuthCookies, setAuthCookies, clearAuthCookies };
