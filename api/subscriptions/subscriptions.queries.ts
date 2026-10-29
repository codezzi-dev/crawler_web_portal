import { queryOptions } from "@tanstack/react-query";
import { subscriptionsApi } from "./subscriptions.api";
import { subscriptionKeys } from "./subscriptions.keys";
import type { QuerySubscriptionsParams } from "./subscriptions.type";

export function subscriptionsQueryOptions(params?: QuerySubscriptionsParams) {
  return queryOptions({
    queryKey: subscriptionKeys.list(params),
    queryFn: async () => {
      const res = await subscriptionsApi.list(params);
      return res;
    },
    staleTime: 1000 * 30,
  });
}

export function subscriptionDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: subscriptionKeys.detail(id),
    queryFn: async () => {
      const res = await subscriptionsApi.getById(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
}
