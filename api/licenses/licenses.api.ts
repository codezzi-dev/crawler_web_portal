import { http } from "@/api/http";
import type {
  GenerateLicensePayload,
  GenerateLicenseResponse,
  LicenseDetailResponse,
  LicensesResponse,
  QueryLicensesParams,
  UpdateLicenseStatusPayload,
  CheckValidityResponse,
} from "./licenses.type";

export const licensesApi = {
  async list(params?: QueryLicensesParams): Promise<LicensesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.user_id) searchParams.set("user_id", params.user_id);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await http<LicensesResponse>(`/licenses${query}`);
  },

  async getById(id: string): Promise<LicenseDetailResponse> {
    return await http<LicenseDetailResponse>(`/licenses/${id}`);
  },

  async generate(payload: GenerateLicensePayload): Promise<GenerateLicenseResponse> {
    return http<GenerateLicenseResponse>("/licenses/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(
    id: string,
    payload: UpdateLicenseStatusPayload,
  ): Promise<LicenseDetailResponse> {
    return http<LicenseDetailResponse>(`/licenses/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async revokeDevice(deviceId: string): Promise<unknown> {
    return http(`/licenses/devices/${deviceId}/revoke`, {
      method: "PATCH",
    });
  },

  async checkIsValid(licenseKey: string): Promise<CheckValidityResponse> {
    return await http<CheckValidityResponse>(`/licenses/${encodeURIComponent(licenseKey.trim())}/is-valid`);
  },
};
