import {
  ActionErrorState,
  ActionResult,
  ActionSuccessState,
  GetOptions,
  NetworkResult,
} from '@/types/api'
import { getErrorMessage } from '@/utils/api'
import { createHeaders, createJsonHeader } from './headers'

const GET = async <T>(
  url: string,
  options: GetOptions = {},
): Promise<NetworkResult<T>> => {
  const { headers, ...rest } = options

  const next = rest.next as NextFetchRequestConfig | undefined

  const response = await fetch(url, {
    headers: !rest.ignoreHeaders ? await createHeaders({ ...headers }) : undefined,
    cache: next?.revalidate ? undefined : 'no-store',
    ...rest,
  })
  const data = getResponseData(await response.text())

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      ...response,
    }
  }

  return {
    state: true,
    data,
    ...response,
  }
}

interface PostOptions extends RequestInit {
  ignoreHeaders?: boolean
}

const POST = async <T>(
  url: string,
  body?: FormData | object,
  options: PostOptions = {},
): Promise<NetworkResult<T>> => {
  const { headers, ...rest } = options

  const isBodyFormData = body instanceof FormData
  const reqHeaders = rest.ignoreHeaders
    ? createJsonHeader()
    : await createHeaders({
        ...(isBodyFormData ? {} : createJsonHeader()),
        ...headers,
      })

  const response = await fetch(url, {
    method: 'POST',
    headers: reqHeaders,
    body: isBodyFormData ? body : JSON.stringify(body),
    ...rest,
  })
  const data = getResponseData(await response.text())

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      ...response,
    }
  }

  return {
    state: true,
    data,
    ...response,
  }
}

const PATCH = async <T>(
  url: string,
  body: FormData | object,
  options: PostOptions = {},
): Promise<NetworkResult<T>> => {
  const { headers, ...rest } = options

  const isBodyFormData = body instanceof FormData
  const reqHeaders = rest.ignoreHeaders
    ? createJsonHeader()
    : await createHeaders({
        ...(isBodyFormData ? {} : createJsonHeader()),
        ...headers,
      })

  const response = await fetch(url, {
    method: 'PATCH',
    headers: reqHeaders,
    body: isBodyFormData ? body : JSON.stringify(body),
    ...rest,
  })

  const data = getResponseData(await response.text())

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      ...response,
    }
  }

  return {
    state: true,
    data,
    ...response,
  }
}

const PUT = async <T>(
  url: string,
  body: FormData | object,
  options: PostOptions = {},
): Promise<NetworkResult<T>> => {
  const { headers, ...rest } = options

  const isBodyFormData = body instanceof FormData
  const reqHeaders = rest.ignoreHeaders
    ? createJsonHeader()
    : await createHeaders({
        ...(isBodyFormData ? {} : createJsonHeader()),
        ...headers,
      })

  const response = await fetch(url, {
    method: 'PUT',
    headers: reqHeaders,
    body: isBodyFormData ? body : JSON.stringify(body),
    ...rest,
  })

  const data = getResponseData(await response.text())

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      ...response,
    }
  }

  return {
    state: true,
    data,
    ...response,
  }
}

type DeleteOptions = RequestInit

const DELETE = async <T>(
  url: string,
  body?: object,
  options: DeleteOptions = {},
): Promise<NetworkResult<T>> => {
  const { headers, ...rest } = options

  const reqHeaders = await createHeaders({ ...createJsonHeader(), ...headers })

  const response = await fetch(url, {
    method: 'DELETE',
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  const data = getResponseData(await response.text())

  if (!response.ok) {
    return {
      state: false,
      error: getErrorMessage(data),
      ...response,
    }
  }

  return {
    state: true,
    data,
    ...response,
  }
}

const getResponseData = (text: string) => {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

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
}
