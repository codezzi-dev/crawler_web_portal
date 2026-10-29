import { queryOptions } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth.api";
import { authKeys } from "@/api/auth/auth.keys";
import type { LoginPayload, LoginResponse } from "@/api/auth/auth.type";

export function meQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const res = await authApi.me();
      return res.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function loginMutationOptions() {
  return {
    mutationFn: (payload: LoginPayload): Promise<LoginResponse> =>
      authApi.login(payload),
  };
}
