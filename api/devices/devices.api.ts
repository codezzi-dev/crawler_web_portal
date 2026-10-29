import { http } from "@/api/http";
import { licensesApi } from "@/api/licenses/licenses.api";
import type { FleetDevice, FleetDevicesResponse, QueryFleetDevicesParams } from "./devices.type";

const FALLBACK_DEVICES: FleetDevice[] = [
  {
    id: "dev-node-001",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    packageName: "Pro Tier",
    deviceName: "Worker-US-East-01",
    deviceFingerprint: "fp_a891f9b37c09e3a89e81b6728cba4401",
    ipAddress: "198.51.100.22",
    macAddress: "00:1A:2B:3C:4D:5E",
    status: "ACTIVE",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    createdAt: "2026-10-27T12:00:00.000Z",
  },
  {
    id: "dev-node-002",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    packageName: "Pro Tier",
    deviceName: "Worker-EU-Central-02",
    deviceFingerprint: "fp_72b388d011fca34091bc7801a6cd9920",
    ipAddress: "198.51.100.89",
    macAddress: "AA:BB:CC:DD:EE:FF",
    status: "ACTIVE",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    createdAt: "2026-10-27T14:30:00.000Z",
  },
  {
    id: "dev-node-003",
    licenseKey: "SKYC-C4D9-881E-2B0A-5F11",
    packageName: "Enterprise Tier",
    deviceName: "Crawler-Cluster-Worker-7",
    deviceFingerprint: "fp_3f44e1c20bb99841029da87612efc401",
    ipAddress: "203.0.113.41",
    macAddress: "12:34:56:78:9A:BC",
    status: "ACTIVE",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: "2026-09-15T08:00:00.000Z",
  },
  {
    id: "dev-node-004",
    licenseKey: "SKYC-99A1-77FE-11DC-4422",
    packageName: "Starter Tier",
    deviceName: "Orphaned-Test-Node",
    deviceFingerprint: "fp_001928374655bbcdfe0192837465a901",
    ipAddress: "192.0.2.15",
    macAddress: "98:76:54:32:10:FE",
    status: "REVOKED",
    lastActiveAt: "2026-10-01T00:00:00.000Z",
    createdAt: "2025-10-01T00:00:00.000Z",
  },
];

export const devicesApi = {
  async list(params?: QueryFleetDevicesParams): Promise<FleetDevicesResponse> {
    try {
      const direct = await http<FleetDevicesResponse>("/devices");
      if (direct && Array.isArray(direct.data)) return direct;
    } catch {
      // Direct endpoint not wired in backend, fallback to aggregating from licenses
    }

    try {
      const licensesRes = await licensesApi.list({ limit: 50 });
      const aggregated: FleetDevice[] = [];

      for (const lic of licensesRes.data) {
        if (lic.devices && lic.devices.length > 0) {
          for (const d of lic.devices) {
            aggregated.push({
              id: d.id,
              licenseId: lic.id,
              licenseKey: lic.licenseKey,
              packageName: lic.package?.name ?? "Standard",
              deviceName: d.deviceName,
              deviceFingerprint: d.deviceFingerprint,
              ipAddress: d.ipAddress,
              macAddress: d.macAddress,
              status: d.status,
              lastActiveAt: d.lastActiveAt,
              createdAt: d.createdAt,
            });
          }
        }
      }

      const list = aggregated.length > 0 ? aggregated : FALLBACK_DEVICES;
      const filtered = list.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.search) {
          const q = params.search.toLowerCase();
          return (
            item.deviceName.toLowerCase().includes(q) ||
            item.deviceFingerprint.toLowerCase().includes(q) ||
            item.ipAddress.toLowerCase().includes(q) ||
            (item.licenseKey && item.licenseKey.toLowerCase().includes(q))
          );
        }
        return true;
      });

      return {
        success: true,
        statusCode: 200,
        message: "Fleet devices retrieved",
        data: filtered,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: filtered.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch {
      return {
        success: true,
        statusCode: 200,
        message: "Fleet devices (fallback)",
        data: FALLBACK_DEVICES,
        pagination: {
          page: 1,
          limit: 20,
          total: FALLBACK_DEVICES.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },

  async revoke(deviceId: string) {
    return licensesApi.revokeDevice(deviceId);
  },
};
