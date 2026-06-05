  export interface CategoryPayload {
    name: string;
    media: File | null;
  }

export interface Category {
  _id: string;
  __v: number;
  name: string;
  media: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  message: string;
  data:  Category;
}

export interface ResponseForSingleCategory {
  state: boolean;
  data?: CategoryResponse;
  error?: string;
}

export interface CategoryResponseMultiple {
  message: string;
  data:  Category[];
}

export interface ResponseForMultipleCategory {
  state: boolean;
  data?: CategoryResponseMultiple;
  error?: string;
}
