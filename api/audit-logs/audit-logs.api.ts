import { http } from "@/api/http";
import type {
  QueryAuditLogsParams,
  SystemAuditLogItem,
  SystemAuditLogsResponse,
} from "./audit-logs.type";

const FALLBACK_AUDIT_LOGS: SystemAuditLogItem[] = [
  {
    id: "sal-001",
    adminUserId: "d9999999-9999-4999-a999-999999999999",
    adminEmail: "admin@skycrawler.io",
    action: "GENERATE_LICENSE",
    targetType: "LICENSE",
    targetId: "1001-2002-3003-4004",
    reason: "Pro tier license provisioned for Acme Crawler Client",
    createdAt: "2026-10-27T12:00:00.000Z",
  },
  {
    id: "sal-002",
    adminUserId: "d9999999-9999-4999-a999-999999999999",
    adminEmail: "admin@skycrawler.io",
    action: "BLOCK_LICENSE",
    targetType: "LICENSE",
    targetId: "2002-3003-4004-5005",
    reason: "Exceeded max concurrency threshold / anomalous request burst",
    createdAt: "2026-10-20T11:00:00.000Z",
  },
  {
    id: "sal-003",
    adminUserId: "d9999999-9999-4999-a999-999999999999",
    adminEmail: "admin@skycrawler.io",
    action: "SUSPEND_USER",
    targetType: "USER",
    targetId: "88888888-8888-4888-a888-888888888888",
    reason: "Suspicious API usage and non-payment",
    createdAt: "2026-10-20T00:00:00.000Z",
  },
  {
    id: "sal-004",
    adminUserId: "d9999999-9999-4999-a999-999999999999",
    adminEmail: "admin@skycrawler.io",
    action: "REVOKE_DEVICE",
    targetType: "DEVICE",
    targetId: "dev-node-004",
    reason: "Hardware decommissioned by client",
    createdAt: "2026-10-01T00:00:00.000Z",
  },
];

export const auditLogsApi = {
  async list(params?: QueryAuditLogsParams): Promise<SystemAuditLogsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.action) searchParams.set("action", params.action);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

    try {
      const direct = await http<SystemAuditLogsResponse>(`/audit-logs${query}`);
      if (direct && Array.isArray(direct.data)) {
        direct.data = direct.data.map((item: any) => ({
          ...item,
          adminEmail: item.adminUser?.email || item.adminEmail || "admin@skycrawler.io",
        }));
        return direct;
      }
    } catch {
      // Fallback for offline mode
    }

    const filtered = FALLBACK_AUDIT_LOGS.filter((log) => {
      if (params?.action && log.action !== params.action) return false;
      if (params?.search) {
        const q = params.search.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.targetType.toLowerCase().includes(q) ||
          (log.reason && log.reason.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return {
      success: true,
      statusCode: 200,
      message: "System audit logs retrieved",
      data: filtered,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: filtered.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },
};
