import { http } from "@/api/http";
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
} from "@/api/auth/auth.type";

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await http<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Normalize token if backend returns token instead of accessToken
    if (response.data && !response.data.accessToken && response.data.token) {
      response.data.accessToken = response.data.token;
    }

    return response;
  },

  async me(): Promise<MeResponse> {
    return await http<MeResponse>("/auth/me");
  },
};
