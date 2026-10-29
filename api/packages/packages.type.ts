import type { ApiResponse, PaginatedApiResponse } from "@/api/types/api-response";

export interface PackageItem {
  id: string;
  name: string;
  maxDevices: number;
  maxCrawls: number;
  price: number | string;
  activeSubscribersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePackagePayload {
  name: string;
  maxDevices: number;
  maxCrawls: number;
  price: number;
}

export interface UpdatePackagePayload {
  name?: string;
  maxDevices?: number;
  maxCrawls?: number;
  price?: number;
}

export interface QueryPackagesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type PackagesResponse = PaginatedApiResponse<PackageItem>;
export type PackageDetailResponse = ApiResponse<PackageItem>;
