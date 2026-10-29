import type { PaginatedApiResponse } from "@/api/types/api-response";
import type { DeviceStatus } from "@/api/licenses/licenses.type";

export interface FleetDevice {
  id: string;
  licenseId?: string;
  licenseKey?: string;
  packageId?: string;
  packageName?: string;
  deviceName: string;
  deviceFingerprint: string;
  ipAddress: string;
  macAddress: string;
  status: DeviceStatus;
  lastActiveAt: string;
  createdAt?: string;
}

export interface QueryFleetDevicesParams {
  page?: number;
  limit?: number;
  status?: DeviceStatus;
  search?: string;
}

export type FleetDevicesResponse = PaginatedApiResponse<FleetDevice>;
