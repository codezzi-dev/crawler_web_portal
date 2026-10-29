import type { UserItem, UsersResponse } from "./users.type";

export const MOCK_USERS: UserItem[] = [
  {
    id: "d9999999-9999-4999-a999-999999999999",
    name: "Sky Crawler SP Admin",
    email: "admin@skycrawler.io",
    role: "SP_ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-10-29T10:00:00.000Z",
    _count: { licensesOwned: 1, subscriptions: 1 },
  },
  {
    id: "e8888888-8888-4888-a888-888888888888",
    name: "Acme Crawler Client",
    email: "client@skycrawler.io",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-10-27T12:00:00.000Z",
    _count: { licensesOwned: 2, subscriptions: 1 },
  },
  {
    id: "77777777-7777-4777-a777-777777777777",
    name: "Global Ops Lead",
    email: "ops@globalnet.org",
    role: "ORG_ADMIN",
    status: "ACTIVE",
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-10-25T09:00:00.000Z",
    _count: { licensesOwned: 3, subscriptions: 2 },
  },
  {
    id: "88888888-8888-4888-a888-888888888888",
    name: "Suspended Test Account",
    email: "bot@suspicious-traffic.net",
    role: "USER",
    status: "SUSPENDED",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-10-20T00:00:00.000Z",
    _count: { licensesOwned: 0, subscriptions: 0 },
  },
];

export function mockUsersResponse(): UsersResponse {
  return {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: MOCK_USERS,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_USERS.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}
