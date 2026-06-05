"use server";

import * as api from "@/api/api";
import { API_URL } from "@/constants";
import { ActionResult } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ServerActionRequest<TBody extends object | FormData = object> {
  url: string;
  method: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

const serverAction = async <
  TBody extends object | FormData = object,
  TResponse = unknown,
>({
  url,
  method,
  body,
  headers = {},
}: ServerActionRequest<TBody>): Promise<ActionResult<TResponse>> => {
  try {
    const fullUrl = `${API_URL}${url}`;
    let response: ActionResult<TResponse>;

    switch (method) {
      case "GET":
        response = await api.GET<TResponse>(fullUrl, headers);
        break;
      case "POST":
        response = await api.POST<TResponse>(fullUrl, body as object, headers);
        break;
      case "PUT":
        response = await api.PUT<TResponse>(fullUrl, body as object, headers);
        break;
      case "DELETE":
        response = await api.DELETE<TResponse>(fullUrl, body as object, {
          headers,
        });
        break;
      case "PATCH":
        response = await api.PATCH<TResponse>(fullUrl, body as object, headers);
        break;
      default:
        return {
          state: false,
          error: `Unsupported HTTP method: ${method}`,
        };
    }

    return {
      state: response.state,
      data: response.data,
      error: response.error,
    };
  } catch (error) {
    console.error(`Server action failed for ${method} ${url}:`, error);
    return {
      state: false,
      error: "An unexpected error occurred",
    };
  }
};

export { serverAction };
