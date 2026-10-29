import type { AuthUser, LoginData } from "./auth.type";

export const MOCK_ADMIN_USER: AuthUser = {
  id: "d9999999-9999-4999-a999-999999999999",
  email: "admin@skycrawler.io",
  name: "Sky Crawler SP Admin",
  role: "SP_ADMIN",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const MOCK_AUTH_EMAIL = "admin@skycrawler.io";
export const MOCK_AUTH_PASSWORD = "admin_secure_password_123";

export function isMockCredentials(email?: string, password?: string): boolean {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === MOCK_AUTH_EMAIL &&
    password === MOCK_AUTH_PASSWORD
  );
}

export function mockLoginData(): LoginData {
  return {
    token: "mock-sp-admin-jwt-token-2026",
    accessToken: "mock-sp-admin-jwt-token-2026",
    user: MOCK_ADMIN_USER,
  };
}
