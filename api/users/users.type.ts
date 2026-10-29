import type { ApiResponse, PaginatedApiResponse } from "@/api/types/api-response";
export type { UserRole, UserStatus } from "@/api/auth/auth.type";
import type { UserRole, UserStatus } from "@/api/auth/auth.type";

export interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    licensesOwned: number;
    subscriptions: number;
  };
  licensesOwned?: unknown[];
  subscriptions?: unknown[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
  reason?: string;
}

export interface QueryUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export type UsersResponse = PaginatedApiResponse<UserItem>;
export type UserDetailResponse = ApiResponse<UserItem>;
