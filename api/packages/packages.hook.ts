"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { packagesApi } from "./packages.api";
import { packageKeys } from "./packages.keys";
import { packageDetailQueryOptions, packagesQueryOptions } from "./packages.queries";
import type {
  CreatePackagePayload,
  QueryPackagesParams,
  UpdatePackagePayload,
} from "./packages.type";

export function usePackages(params?: QueryPackagesParams) {
  return useQuery(packagesQueryOptions(params));
}

export function usePackageDetail(id: string) {
  return useQuery(packageDetailQueryOptions(id));
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePackagePayload) => packagesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePackagePayload }) =>
      packagesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.detail(variables.id) });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => packagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
  });
}
