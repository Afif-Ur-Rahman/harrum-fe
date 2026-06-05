export interface Review {
  _id: string;
  rating: number;
  review: string;
  media: string[];
  reviewer: {
    _id: string;
    username: string;
    image: string;
    fullName: string;
    email: string;
  };
  restaurant?: {
    _id: string;
    fullName: string;
    username: string;
    image: string;
  } | null;
  product?: {
    _id: string;
    title: string;
    media: string[];
  } | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  __v: number;
}
