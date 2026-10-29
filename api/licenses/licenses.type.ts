import type { ApiResponse, PaginatedApiResponse } from "@/api/types/api-response";

export type LicenseStatus = "ACTIVE" | "BLOCKED" | "EXPIRED";
export type DeviceStatus = "ACTIVE" | "REVOKED";
export type CrawlStatus = "SUCCESS" | "FAILED";

export interface LicenseDevice {
  id: string;
  licenseId?: string;
  packageId?: string;
  deviceName: string;
  deviceFingerprint: string;
  ipAddress: string;
  macAddress: string;
  status: DeviceStatus;
  lastActiveAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LicenseCrawlAudit {
  id: string;
  licenseId: string;
  deviceId?: string;
  targetUrl: string;
  ipAddress: string;
  status: CrawlStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface LicenseStatusHistory {
  id: string;
  licenseId: string;
  oldStatus: string | null;
  newStatus: string;
  changedBy: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface License {
  id: string;
  licenseKey: string;
  userId: string | null;
  subscriptionId?: string | null;
  packageId: string | null;
  status: LicenseStatus;
  deviceLimit: number;
  crawlsUsedThisCycle: number;
  expiresAt: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: string;
    name: string | null;
    email: string;
    status?: string;
  } | null;

  package?: {
    id: string;
    name: string;
    maxDevices: number;
    maxCrawls: number;
    price: number | string;
  } | null;

  subscription?: {
    id: string;
    status: string;
    expiresAt: string | null;
  } | null;

  devices?: LicenseDevice[];
  crawlAudits?: LicenseCrawlAudit[];
  statusHistories?: LicenseStatusHistory[];

  _count?: {
    devices: number;
    crawlAudits: number;
  };
}

export interface GenerateLicensePayload {
  userId: string;
  packageId: string;
  subscriptionId?: string;
  deviceLimit?: number;
  expiresAt?: string;
}

export interface UpdateLicenseStatusPayload {
  status: LicenseStatus;
  reason?: string;
}

export interface CheckValidityResult {
  isValid?: boolean;
  is_valid?: boolean;
  valid?: boolean;
  status: string;
  expiresAt?: string;
  expires_at?: string;
  deviceCount?: number;
  active_devices?: number;
  deviceLimit?: number;
  device_limit?: number;
  remaining_device_slots?: number;
  crawls_used_this_cycle?: number;
  max_crawls?: number | null;
  crawls_remaining?: number | null;
  package_name?: string | null;
  packageName?: string | null;
  reason?: string | null;
}

export interface QueryLicensesParams {
  page?: number;
  limit?: number;
  status?: LicenseStatus;
  search?: string;
  user_id?: string;
  package_id?: string;
}

export type LicensesResponse = PaginatedApiResponse<License>;
export type LicenseDetailResponse = ApiResponse<License>;
export type GenerateLicenseResponse = ApiResponse<License>;
export type CheckValidityResponse = ApiResponse<CheckValidityResult>;
