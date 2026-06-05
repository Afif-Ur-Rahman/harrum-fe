import { Pagination } from "./api";
import { User } from "./user";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface ReportedItem {
  _id: string;
  location?: UserLocation;
  email?: string;
  username?: string;
  image?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserReporter {
  _id: string;
  email: string;
  fullName: string;
  image: string;
  username: string;
}

export interface UserReport {
  _id: string;
  reporter: User;
  reportedItem: ReportedItem | null;
  type: "Waiter" | "Chef" | "Accountant" | "User" | "Restaurant" | "Product";
  refModel: "User" | "Product";
  reason: string;
  status: "PENDING" | "RESOLVED" | "REVIEWED";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserReportsResponse {
  message: string;
  data: UserReport[];
  pagination: Pagination;
}
