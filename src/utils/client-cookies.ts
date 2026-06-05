import { ACCESS_TOKEN_COOKIE, USER_COOKIE } from "@/constants";
import type { AuthCookies } from "@/types";

export const getClientAuthCookies = (): AuthCookies | undefined => {
  if (typeof document === "undefined") return undefined;

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ACCESS_TOKEN_COOKIE}=`))
    ?.split("=")[1];

  const userJson = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${USER_COOKIE}=`))
    ?.split("=")[1];

  if (!accessToken || !userJson) {
    return undefined;
  }

  try {
    const user = JSON.parse(decodeURIComponent(userJson));
    return {
      user,
      accessToken,
    };
  } catch {
    return undefined;
  }
};

export const setClientAuthCookies = (value: AuthCookies) => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5 hours
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${
    value.accessToken
  }; expires=${expires.toUTCString()}; path=/`;
  document.cookie = `${USER_COOKIE}=${encodeURIComponent(
    JSON.stringify(value.user)
  )}; expires=${expires.toUTCString()}; path=/`;
};

export const clearClientAuthCookies = () => {
  if (typeof document === "undefined") return;

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `${USER_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};
