
import { cookies, headers as nextHeaders } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  APP_NAME,
  APP_ENV,
  APP_VERSION,
} from "@/constants";

const HEADER_Restaurant_APPLICATION = "Restaurant-Application";
const HEADER_Restaurant_APP_VERSION = "Restaurant-AppVersion";
const HEADER_Restaurant_RUN_ENVIRONMENT = "Restaurant-RunEnvironment";
const HEADER_Restaurant_DEVICE = "Restaurant-Device";
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

  headers.set(HEADER_Restaurant_APPLICATION, APP_NAME);
  headers.set(HEADER_Restaurant_APP_VERSION, APP_VERSION);
  headers.set(HEADER_Restaurant_RUN_ENVIRONMENT, APP_ENV);
  headers.set(HEADER_Restaurant_DEVICE, userAgent);

  return headers;
};

const createAuthzHeader = (token: string): HeadersInit => ({
  [HEADER_AUTHORIZATION]: `${BEARER_AUTHENTICATION} ${token}`,
});

const createJsonHeader = (): HeadersInit => ({
  [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
});

export { createHeaders, createAuthzHeader, createJsonHeader };
