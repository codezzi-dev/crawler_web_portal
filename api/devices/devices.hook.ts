"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { devicesApi } from "./devices.api";
import type { QueryFleetDevicesParams } from "./devices.type";

export function useFleetDevices(params?: QueryFleetDevicesParams) {
  return useQuery({
    queryKey: ["devices", "fleet", params],
    queryFn: () => devicesApi.list(params),
    staleTime: 1000 * 15,
  });
}

export function useRevokeFleetDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: string) => devicesApi.revoke(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
    },
  });
}
