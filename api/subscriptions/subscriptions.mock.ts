import type { SubscriptionItem, SubscriptionsResponse } from "./subscriptions.type";

export const MOCK_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: "f7777777-7777-4777-a777-777777777777",
    userId: "e8888888-8888-4888-a888-888888888888",
    packageId: "b2222222-2222-4222-a222-222222222222",
    status: "ACTIVE",
    expiresAt: "2027-10-27T12:00:00.000Z",
    createdAt: "2026-10-27T12:00:00.000Z",
    updatedAt: "2026-10-27T12:00:00.000Z",
    user: {
      id: "e8888888-8888-4888-a888-888888888888",
      name: "Acme Crawler Client",
      email: "client@skycrawler.io",
    },
    package: {
      id: "b2222222-2222-4222-a222-222222222222",
      name: "Pro Tier",
      maxDevices: 5,
      maxCrawls: 10000,
      price: 99.99,
    },
  },
  {
    id: "sub-999-888-777",
    userId: "77777777-7777-4777-a777-777777777777",
    packageId: "c3333333-3333-4333-a333-333333333333",
    status: "ACTIVE",
    expiresAt: "2027-04-15T00:00:00.000Z",
    createdAt: "2026-04-15T00:00:00.000Z",
    updatedAt: "2026-04-15T00:00:00.000Z",
    user: {
      id: "77777777-7777-4777-a777-777777777777",
      name: "Global Ops Lead",
      email: "ops@globalnet.org",
    },
    package: {
      id: "c3333333-3333-4333-a333-333333333333",
      name: "Enterprise Tier",
      maxDevices: 25,
      maxCrawls: 100000,
      price: 399.99,
    },
  },
  {
    id: "sub-old-123-456",
    userId: "e8888888-8888-4888-a888-888888888888",
    packageId: "a1111111-1111-4111-a111-111111111111",
    status: "EXPIRED",
    expiresAt: "2026-09-01T00:00:00.000Z",
    createdAt: "2025-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    user: {
      id: "e8888888-8888-4888-a888-888888888888",
      name: "Acme Crawler Client",
      email: "client@skycrawler.io",
    },
    package: {
      id: "a1111111-1111-4111-a111-111111111111",
      name: "Starter Tier",
      maxDevices: 2,
      maxCrawls: 1000,
      price: 29.99,
    },
  },
];

export function mockSubscriptionsResponse(): SubscriptionsResponse {
  return {
    success: true,
    statusCode: 200,
    message: "Subscriptions retrieved successfully",
    data: MOCK_SUBSCRIPTIONS,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_SUBSCRIPTIONS.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}
