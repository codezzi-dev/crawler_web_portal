import type { License, LicensesResponse, CheckValidityResult } from "./licenses.type";

export const MOCK_LICENSES: License[] = [
  {
    id: "1001-2002-3003-4004",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    userId: "e8888888-8888-4888-a888-888888888888",
    packageId: "b2222222-2222-4222-a222-222222222222",
    subscriptionId: "f7777777-7777-4777-a777-777777777777",
    status: "ACTIVE",
    deviceLimit: 5,
    crawlsUsedThisCycle: 14820,
    expiresAt: "2027-10-29T16:00:00.000Z",
    createdAt: "2026-10-27T12:00:00.000Z",
    updatedAt: "2026-10-29T14:30:00.000Z",
    user: {
      id: "e8888888-8888-4888-a888-888888888888",
      name: "Acme Crawler Client",
      email: "client@skycrawler.io",
      status: "ACTIVE",
    },
    package: {
      id: "b2222222-2222-4222-a222-222222222222",
      name: "Pro Tier",
      maxDevices: 5,
      maxCrawls: 50000,
      price: 99.99,
    },
    devices: [
      {
        id: "d1-uuid-001",
        deviceName: "Worker-US-East-01",
        deviceFingerprint: "fp_a891f9b37c09e3a89e81b6728cba",
        ipAddress: "192.168.1.45",
        macAddress: "00:1A:2B:3C:4D:5E",
        status: "ACTIVE",
        lastActiveAt: "2026-10-29T15:45:12.000Z",
      },
      {
        id: "d1-uuid-002",
        deviceName: "Worker-EU-West-02",
        deviceFingerprint: "fp_72b388d011fca34091bc7801a6cd",
        ipAddress: "192.168.1.88",
        macAddress: "AA:BB:CC:DD:EE:FF",
        status: "ACTIVE",
        lastActiveAt: "2026-10-29T15:52:00.000Z",
      },
    ],
    crawlAudits: [
      {
        id: "ca-001",
        licenseId: "1001-2002-3003-4004",
        deviceId: "d1-uuid-001",
        targetUrl: "https://news.ycombinator.com/best",
        ipAddress: "192.168.1.45",
        status: "SUCCESS",
        createdAt: "2026-10-29T15:45:12.000Z",
      },
      {
        id: "ca-002",
        licenseId: "1001-2002-3003-4004",
        deviceId: "d1-uuid-002",
        targetUrl: "https://en.wikipedia.org/wiki/Web_crawler",
        ipAddress: "192.168.1.88",
        status: "SUCCESS",
        createdAt: "2026-10-29T15:52:00.000Z",
      },
    ],
    statusHistories: [
      {
        id: "sh-001",
        licenseId: "1001-2002-3003-4004",
        oldStatus: null,
        newStatus: "ACTIVE",
        changedBy: "admin@skycrawler.io",
        reason: "Initial provisioning",
        createdAt: "2026-10-27T12:00:00.000Z",
      },
    ],
    _count: {
      devices: 2,
      crawlAudits: 2,
    },
  },
  {
    id: "2002-3003-4004-5005",
    licenseKey: "SKYC-C4D9-881E-2B0A-5F11",
    userId: "e8888888-8888-4888-a888-888888888888",
    packageId: "c3333333-3333-4333-a333-333333333333",
    status: "BLOCKED",
    deviceLimit: 25,
    crawlsUsedThisCycle: 98200,
    expiresAt: "2027-01-15T00:00:00.000Z",
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-10-20T11:00:00.000Z",
    user: {
      id: "e8888888-8888-4888-a888-888888888888",
      name: "Acme Crawler Client",
      email: "client@skycrawler.io",
      status: "ACTIVE",
    },
    package: {
      id: "c3333333-3333-4333-a333-333333333333",
      name: "Enterprise Tier",
      maxDevices: 25,
      maxCrawls: 100000,
      price: 399.99,
    },
    devices: [],
    _count: {
      devices: 0,
      crawlAudits: 98200,
    },
  },
  {
    id: "3003-4004-5005-6006",
    licenseKey: "SKYC-99A1-77FE-11DC-4422",
    userId: "d9999999-9999-4999-a999-999999999999",
    packageId: "a1111111-1111-4111-a111-111111111111",
    status: "EXPIRED",
    deviceLimit: 2,
    crawlsUsedThisCycle: 1000,
    expiresAt: "2026-10-01T00:00:00.000Z",
    createdAt: "2025-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
    user: {
      id: "d9999999-9999-4999-a999-999999999999",
      name: "Sky Crawler SP Admin",
      email: "admin@skycrawler.io",
      status: "ACTIVE",
    },
    package: {
      id: "a1111111-1111-4111-a111-111111111111",
      name: "Starter Tier",
      maxDevices: 2,
      maxCrawls: 1000,
      price: 29.99,
    },
    devices: [],
    _count: {
      devices: 0,
      crawlAudits: 1000,
    },
  },
];

export function mockLicensesResponse(): LicensesResponse {
  return {
    success: true,
    statusCode: 200,
    message: "Licenses retrieved successfully",
    data: MOCK_LICENSES,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_LICENSES.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}

export function mockCheckValidity(key: string): CheckValidityResult {
  const found = MOCK_LICENSES.find((l) => l.licenseKey === key);
  if (!found) {
    return {
      isValid: false,
      status: "NOT_FOUND",
      reason: "License key does not exist",
    };
  }
  return {
    isValid: found.status === "ACTIVE",
    status: found.status,
    expiresAt: found.expiresAt ?? undefined,
    deviceCount: found._count?.devices ?? 0,
    deviceLimit: found.deviceLimit,
    reason: found.status !== "ACTIVE" ? `License is ${found.status}` : undefined,
  };
}
