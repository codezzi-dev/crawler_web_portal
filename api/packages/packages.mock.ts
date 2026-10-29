import type { PackageItem, PackagesResponse } from "./packages.type";

export const MOCK_PACKAGES: PackageItem[] = [
  {
    id: "a1111111-1111-4111-a111-111111111111",
    name: "Starter Tier",
    maxDevices: 2,
    maxCrawls: 1000,
    price: 29.99,
    activeSubscribersCount: 142,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "b2222222-2222-4222-a222-222222222222",
    name: "Pro Tier",
    maxDevices: 5,
    maxCrawls: 10000,
    price: 99.99,
    activeSubscribersCount: 489,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "c3333333-3333-4333-a333-333333333333",
    name: "Enterprise Tier",
    maxDevices: 25,
    maxCrawls: 100000,
    price: 399.99,
    activeSubscribersCount: 88,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
];

export function mockPackagesResponse(): PackagesResponse {
  return {
    success: true,
    statusCode: 200,
    message: "Packages retrieved successfully",
    data: MOCK_PACKAGES,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_PACKAGES.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}
