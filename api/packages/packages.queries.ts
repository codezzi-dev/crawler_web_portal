import { queryOptions } from "@tanstack/react-query";
import { packagesApi } from "./packages.api";
import { packageKeys } from "./packages.keys";
import type { QueryPackagesParams } from "./packages.type";

export function packagesQueryOptions(params?: QueryPackagesParams) {
  return queryOptions({
    queryKey: packageKeys.list(params),
    queryFn: async () => {
      const res = await packagesApi.list(params);
      return res;
    },
    staleTime: 1000 * 60,
  });
}

export function packageDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: packageKeys.detail(id),
    queryFn: async () => {
      const res = await packagesApi.getById(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
