import type { ApiResponse, PaginatedApiResponse } from "@/api/types/api-response";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED";

export interface SubscriptionItem {
  id: string;
  userId: string | null;
  packageId: string | null;
  status: SubscriptionStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  package?: {
    id: string;
    name: string;
    maxDevices: number;
    maxCrawls: number;
    price: number | string;
  } | null;
  licenses?: unknown[];
}

export interface CreateSubscriptionPayload {
  userId: string;
  packageId: string;
  expiresAt?: string;
}

export interface UpdateSubscriptionPayload {
  packageId?: string;
  status?: SubscriptionStatus;
  expiresAt?: string;
}

export interface QuerySubscriptionsParams {
  page?: number;
  limit?: number;
  userId?: string;
  packageId?: string;
  status?: SubscriptionStatus;
}

export type SubscriptionsResponse = PaginatedApiResponse<SubscriptionItem>;
export type SubscriptionDetailResponse = ApiResponse<SubscriptionItem>;
