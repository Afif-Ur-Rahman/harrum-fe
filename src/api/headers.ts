import { cookies, headers as nextHeaders } from "next/headers";
import { ACCESS_TOKEN_COOKIE, APP_NAME, MODE, APP_VERSION } from "@/constants";

const HEADER_Harrum_APPLICATION = "Harrum-Application";
const HEADER_Harrum_APP_VERSION = "Harrum-AppVersion";
const HEADER_Harrum_RUN_ENVIRONMENT = "Harrum-RunEnvironment";
const HEADER_Harrum_DEVICE = "Harrum-Device";
const HEADER_AUTHORIZATION = "Authorization";
const HEADER_CONTENT_TYPE = "Content-Type";
const HEADER_USER_AGENT = "user-agent";
const BEARER_AUTHENTICATION = "Bearer";
const CONTENT_TYPE_JSON = "application/json; charset=utf-8";

const createHeaders = async (init?: HeadersInit): Promise<Headers> => {
  const headers = new Headers(init);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (token && !headers.get(HEADER_AUTHORIZATION)) {
    headers.set(HEADER_AUTHORIZATION, `${BEARER_AUTHENTICATION} ${token}`);
  }

  const requestHeaders = await nextHeaders();
  const userAgent = requestHeaders.get(HEADER_USER_AGENT) ?? "";

  headers.set(HEADER_Harrum_APPLICATION, APP_NAME);
  headers.set(HEADER_Harrum_APP_VERSION, APP_VERSION);
  headers.set(HEADER_Harrum_RUN_ENVIRONMENT, MODE);
  headers.set(HEADER_Harrum_DEVICE, userAgent);

  return headers;
};

const createAuthzHeader = (token: string): HeadersInit => ({
  [HEADER_AUTHORIZATION]: `${BEARER_AUTHENTICATION} ${token}`,
});

const createJsonHeader = (): HeadersInit => ({
  [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
});

export { createHeaders, createAuthzHeader, createJsonHeader };
