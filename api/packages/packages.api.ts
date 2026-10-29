import { http } from "@/api/http";
import type {
  CreatePackagePayload,
  PackageDetailResponse,
  PackagesResponse,
  QueryPackagesParams,
  UpdatePackagePayload,
} from "./packages.type";

export const packagesApi = {
  async list(params?: QueryPackagesParams): Promise<PackagesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await http<PackagesResponse>(`/packages${query}`);
  },

  async getById(id: string): Promise<PackageDetailResponse> {
    return http<PackageDetailResponse>(`/packages/${id}`);
  },

  async create(payload: CreatePackagePayload): Promise<PackageDetailResponse> {
    return http<PackageDetailResponse>("/packages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: UpdatePackagePayload): Promise<PackageDetailResponse> {
    return http<PackageDetailResponse>(`/packages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<unknown> {
    return http(`/packages/${id}`, {
      method: "DELETE",
    });
  },
};
