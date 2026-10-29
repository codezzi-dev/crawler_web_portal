import { http } from "@/api/http";
import type {
  CreateSubscriptionPayload,
  QuerySubscriptionsParams,
  SubscriptionDetailResponse,
  SubscriptionsResponse,
  UpdateSubscriptionPayload,
} from "./subscriptions.type";

export const subscriptionsApi = {
  async list(params?: QuerySubscriptionsParams): Promise<SubscriptionsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.userId) searchParams.set("userId", params.userId);
    if (params?.packageId) searchParams.set("packageId", params.packageId);
    if (params?.status) searchParams.set("status", params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await http<SubscriptionsResponse>(`/subscriptions${query}`);
  },

  async getById(id: string): Promise<SubscriptionDetailResponse> {
    return http<SubscriptionDetailResponse>(`/subscriptions/${id}`);
  },

  async create(payload: CreateSubscriptionPayload): Promise<SubscriptionDetailResponse> {
    return http<SubscriptionDetailResponse>("/subscriptions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(
    id: string,
    payload: UpdateSubscriptionPayload,
  ): Promise<SubscriptionDetailResponse> {
    return http<SubscriptionDetailResponse>(`/subscriptions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<unknown> {
    return http(`/subscriptions/${id}`, {
      method: "DELETE",
    });
  },
};
