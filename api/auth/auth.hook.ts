"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/api/auth/auth.keys";
import { loginMutationOptions, meQueryOptions } from "@/api/auth/auth.queries";
import { clearSession, persistSession } from "@/lib/authStorage.util";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    ...loginMutationOptions(),
    onSuccess: (response) => {
      const token = response.data.token || response.data.accessToken || "";
      const user = response.data.user;
      persistSession(token, user);
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

export function useMe(enabled = true) {
  return useQuery(meQueryOptions(enabled));
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearSession();
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };
}
