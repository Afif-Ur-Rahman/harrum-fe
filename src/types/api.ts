export interface ActionResult<T = unknown> {
  state: boolean;
  data?: T;
  error?: string;
}

export interface ActionSuccessState<T = unknown> {
  state: true;
  data: T;
}

export interface ActionErrorState {
  state: false;
  error: string;
}

export interface NetworkResult<T = unknown> extends ActionResult<T> {
  state: boolean
  data?: T
  error?: string
  status?: number
  headers?: Headers
}

export interface GetOptions extends RequestInit {
  ignoreHeaders?: boolean;
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}
