type AppEnv = "dev" | "stag" | "prod";

// General
const APP_NAME = process.env.APP_NAME ?? "Restaurantui";
const APP_VERSION = process.env.APP_VERSION ?? "1.0.0";
const APP_ENV = (process.env.APP_ENV ?? "dev") as AppEnv;
const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "Root_Domain";

// Restaurant service URLs
const API_URL = process.env.API_URL || "";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

// Cookies
const USER_COOKIE = process.env.USER_COOKIE ?? "Restaurant_user";
const ACCESS_TOKEN_COOKIE =
  process.env.ACCESS_TOKEN_COOKIE ?? "Restaurant_access_token";
const ACCESS_TOKEN_EXPIRY_COOKIE =
  process.env.ACCESS_TOKEN_EXPIRY_COOKIE ?? "Restaurant_access_token_expiry";
const REFRESH_TOKEN_COOKIE =
  process.env.REFRESH_TOKEN_COOKIE ?? "Restaurant_refresh_token";

// Third Party
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export {
  APP_NAME,
  APP_VERSION,
  APP_ENV,
  ROOT_DOMAIN,
  API_URL,
  SOCKET_URL,
  USER_COOKIE,
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_EXPIRY_COOKIE,
  REFRESH_TOKEN_COOKIE,
  GOOGLE_MAPS_API_KEY,
};
