"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { licensesApi } from "./licenses.api";
import { licenseKeys } from "./licenses.keys";
import {
  licensesQueryOptions,
  licenseDetailQueryOptions,
  licenseValidityQueryOptions,
} from "./licenses.queries";
import type {
  GenerateLicensePayload,
  QueryLicensesParams,
  UpdateLicenseStatusPayload,
} from "./licenses.type";

export function useLicenses(params?: QueryLicensesParams) {
  return useQuery(licensesQueryOptions(params));
}

export function useLicenseDetail(id: string) {
  return useQuery(licenseDetailQueryOptions(id));
}

export function useCheckLicenseValidity(key: string, enabled = false) {
  return useQuery(licenseValidityQueryOptions(key, enabled));
}

export function useGenerateLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateLicensePayload) => licensesApi.generate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.lists() });
    },
  });
}

export function useUpdateLicenseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLicenseStatusPayload;
    }) => licensesApi.updateStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: licenseKeys.detail(variables.id) });
    },
  });
}

export function useRevokeDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: string) => licensesApi.revokeDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: licenseKeys.all });
    },
  });
}
