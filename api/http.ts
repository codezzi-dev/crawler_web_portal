import { clearSession, getToken } from "@/lib/authStorage.util";
import { env } from "@/config/env.config";
import { ApiError } from "@/api/types/api-response";

let handlingUnauthorized = false;

function handleUnauthorized() {
  if (typeof window === "undefined" || handlingUnauthorized) return;
  handlingUnauthorized = true;
  clearSession();
  const path = window.location.pathname;
  if (path !== "/login") {
    window.location.href = "/login";
  } else {
    handlingUnauthorized = false;
  }
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!env.apiUrl) {
    throw new ApiError("Missing NEXT_PUBLIC_API_URL", 0);
  }

  const token = getToken();
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (env.systemKey && !headers.has("x-system-key")) {
    headers.set("x-system-key", env.systemKey);
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (!env.isMockAuth) {
      handleUnauthorized();
    }
    throw new ApiError("Unauthorized session. Please log in again.", 401);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (errorBody as { message?: string }).message ||
      `HTTP ${response.status}: Request failed`;
    throw new ApiError(message, response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
