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
    const backendPayload: Record<string, unknown> = {
      user_id: payload.userId,
      package_id: payload.packageId,
    };
    if (payload.subscriptionId) backendPayload.subscription_id = payload.subscriptionId;
    if (payload.deviceLimit !== undefined) backendPayload.device_limit = payload.deviceLimit;
    if (payload.expiresAt) backendPayload.expires_at = payload.expiresAt;

    const res = await http<any>("/licenses/generate", {
      method: "POST",
      body: JSON.stringify(backendPayload),
    });

    if (res?.data) {
      if (res.data.license_key && !res.data.licenseKey) {
        res.data.licenseKey = res.data.license_key;
      }
      if (res.data.user_id && !res.data.userId) {
        res.data.userId = res.data.user_id;
      }
      if (res.data.package_id && !res.data.packageId) {
        res.data.packageId = res.data.package_id;
      }
      if (res.data.device_limit !== undefined && res.data.deviceLimit === undefined) {
        res.data.deviceLimit = res.data.device_limit;
      }
      if (res.data.expires_at && !res.data.expiresAt) {
        res.data.expiresAt = res.data.expires_at;
      }
    }

    return res as GenerateLicenseResponse;
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
