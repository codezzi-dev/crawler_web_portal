import { http } from "@/api/http";
import type {
  CreateUserPayload,
  QueryUsersParams,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  UserDetailResponse,
  UsersResponse,
} from "./users.type";

export const usersApi = {
  async list(params?: QueryUsersParams): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.role) searchParams.set("role", params.role);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await http<UsersResponse>(`/users${query}`);
  },

  async getById(id: string): Promise<UserDetailResponse> {
    return http<UserDetailResponse>(`/users/${id}`);
  },

  async create(payload: CreateUserPayload): Promise<UserDetailResponse> {
    return http<UserDetailResponse>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: UpdateUserPayload): Promise<UserDetailResponse> {
    return http<UserDetailResponse>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(
    id: string,
    payload: UpdateUserStatusPayload,
  ): Promise<UserDetailResponse> {
    return http<UserDetailResponse>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<unknown> {
    return http(`/users/${id}`, {
      method: "DELETE",
    });
  },
};
