import type { ApiResponse } from "@/api/types/api-response";

export type UserRole = "SP_ADMIN" | "ORG_ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  ownedLicenses?: unknown[];
  subscriptions?: unknown[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  accessToken?: string; // fallback alias
  user: AuthUser;
}

export type LoginResponse = ApiResponse<LoginData>;
export type MeResponse = ApiResponse<AuthUser>;
