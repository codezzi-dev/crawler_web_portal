import type { QueryPackagesParams } from "./packages.type";

export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
  list: (params?: QueryPackagesParams) => [...packageKeys.lists(), params] as const,
  details: () => [...packageKeys.all, "detail"] as const,
  detail: (id: string) => [...packageKeys.details(), id] as const,
};
