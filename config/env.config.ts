export type AuthMode = "mock" | "api";

function resolveAuthMode(): AuthMode {
  const raw = process.env.NEXT_PUBLIC_AUTH_MODE?.trim().toLowerCase();
  if (raw === "mock") return "mock";
  return "api";
}

export const env = {
  get apiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
  },
  get systemKey() {
    return process.env.NEXT_PUBLIC_SYSTEM_KEY || "sky-crawler-system-secret-key-2026";
  },
  /** `api` (default) = real /auth/* and NestJS endpoints; `mock` = offline fallback */
  get authMode(): AuthMode {
    return resolveAuthMode();
  },
  get isMockAuth() {
    return this.authMode === "mock";
  },
};
