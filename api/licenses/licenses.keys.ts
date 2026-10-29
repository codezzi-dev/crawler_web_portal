import type { QueryLicensesParams } from "./licenses.type";

export const licenseKeys = {
  all: ["licenses"] as const,
  lists: () => [...licenseKeys.all, "list"] as const,
  list: (params?: QueryLicensesParams) => [...licenseKeys.lists(), params] as const,
  details: () => [...licenseKeys.all, "detail"] as const,
  detail: (id: string) => [...licenseKeys.details(), id] as const,
  validity: (key: string) => [...licenseKeys.all, "validity", key] as const,
};
