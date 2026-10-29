import { queryOptions } from "@tanstack/react-query";
import { licensesApi } from "./licenses.api";
import { licenseKeys } from "./licenses.keys";
import type { QueryLicensesParams } from "./licenses.type";

export function licensesQueryOptions(params?: QueryLicensesParams) {
  return queryOptions({
    queryKey: licenseKeys.list(params),
    queryFn: async () => {
      const res = await licensesApi.list(params);
      return res;
    },
    staleTime: 1000 * 30,
  });
}

export function licenseDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: licenseKeys.detail(id),
    queryFn: async () => {
      const res = await licensesApi.getById(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
}

export function licenseValidityQueryOptions(key: string, enabled = false) {
  return queryOptions({
    queryKey: licenseKeys.validity(key),
    queryFn: async () => {
      const res = await licensesApi.checkIsValid(key);
      return res.data;
    },
    enabled: Boolean(key && enabled),
    staleTime: 1000 * 10,
  });
}
