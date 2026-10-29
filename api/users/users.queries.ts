import { queryOptions } from "@tanstack/react-query";
import { usersApi } from "./users.api";
import { userKeys } from "./users.keys";
import type { QueryUsersParams } from "./users.type";

export function usersQueryOptions(params?: QueryUsersParams) {
  return queryOptions({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const res = await usersApi.list(params);
      return res;
    },
    staleTime: 1000 * 30,
  });
}

export function userDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const res = await usersApi.getById(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
}
