"use client";

import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "./audit-logs.api";
import type { QueryAuditLogsParams } from "./audit-logs.type";

export function useAuditLogs(params?: QueryAuditLogsParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditLogsApi.list(params),
    staleTime: 1000 * 30,
  });
}
