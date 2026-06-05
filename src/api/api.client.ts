import {
  ActionErrorState,
  ActionResult,
  ActionSuccessState,
  GetOptions,
  NetworkResult,
} from "@/types/api";
import { getErrorMessage } from "@/utils/api";

const GET = async <T>(
  url: string,
  options: GetOptions = {}
): Promise<NetworkResult<T>> => {
  const { ...rest } = options;

  const next = rest.next as NextFetchRequestConfig | undefined;
  const response = await fetch("/ehr" + url, {
    cache: next?.revalidate ? undefined : "no-store",
    ...rest,
  });
  const data = getResponseData(await response.text());

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      headers: response.headers
    };
  }

  return {
    state: true,
    data,
    headers: response.headers,
  };
};

interface PostOptions extends RequestInit {
  ignoreHeaders?: boolean;
}

const POST = async <T>(
  url: string,
  body?: FormData | object,
  options: PostOptions = {}
): Promise<NetworkResult<T>> => {
  const { ...rest } = options;

  const isBodyFormData = body instanceof FormData;

  const response = await fetch("/ehr" + url, {
    method: "POST",
    body: isBodyFormData ? body : JSON.stringify(body),
    ...rest,
    headers: { "Content-Type": "application/json" },
  });

  const data = getResponseData(await response.text());

  if (!response.ok) {
    return {
      state: false,
      status: response.status,
      error: getErrorMessage(data),
      headers: response.headers,
    };
  }

  return {
    state: true,
    data,
    headers: response.headers,
  };
};

const PATCH = async <T>(
  url: string,
  body: FormData | object,
  options: PostOptions = {}
): Promise<NetworkResult<T>> => {
  const { ...rest } = options;

  const isBodyFormData = body instanceof FormData;

  const response = await fetch("/ehr" + url, {
    method: "PATCH",
    body: isBodyFormData ? body : JSON.stringify(body),
    ...rest,
    headers: { "Content-Type": "application/json" },
  });

  const data = getResponseData(await response.text());

  if (!response.ok) {
    return {
      state: false,
      status: response.status,
      error: getErrorMessage(data),
      headers: response.headers,
    };
  }

  return {
    state: true,
    data,
    headers: response.headers,
  };
};

const PUT = async <T>(
  url: string,
  body: FormData | object,
  options: PostOptions = {}
): Promise<NetworkResult<T>> => {
  const { ...rest } = options;
  const isBodyFormData = body instanceof FormData;
  const response = await fetch("/ehr" + url, {
    method: "PUT",
    body: isBodyFormData ? body : JSON.stringify(body),
    ...rest,
    headers: { "Content-Type": "application/json" },
  });

  const data = getResponseData(await response.text());

  if (!response.ok) {
    return {
      state: false,
      status: response.status,
      error: getErrorMessage(data),
      headers: response.headers,
    };
  }

  return {
    state: true,
    data,
    headers: response.headers,
  };
};

type DeleteOptions = RequestInit;

const DELETE = async <T>(
  url: string,
  body?: object,
  options: DeleteOptions = {}
): Promise<NetworkResult<T>> => {
  const { ...rest } = options;

  const response = await fetch("/ehr" + url, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = getResponseData(await response.text());

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      headers: response.headers,
    };
  }

  return {
    state: true,
    data,
    headers: response.headers,
  };
};

const getResponseData = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
  type ActionResult,
  type ActionErrorState,
  type ActionSuccessState,
  type NetworkResult,
};
