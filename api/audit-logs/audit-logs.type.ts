import type { PaginatedApiResponse } from "@/api/types/api-response";

export interface SystemAuditLogItem {
  id: string;
  adminUserId: string | null;
  adminEmail?: string;
  action: string;
  targetType: string;
  targetId: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface QueryAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  search?: string;
}

export type SystemAuditLogsResponse = PaginatedApiResponse<SystemAuditLogItem>;
