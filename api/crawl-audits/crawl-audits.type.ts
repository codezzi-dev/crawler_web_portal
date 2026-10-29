import type { PaginatedApiResponse } from "@/api/types/api-response";
import type { CrawlStatus } from "@/api/licenses/licenses.type";

export interface CrawlAuditEvent {
  id: string;
  licenseId?: string;
  licenseKey?: string;
  deviceId?: string;
  deviceFingerprint?: string;
  targetUrl: string;
  ipAddress: string;
  status: CrawlStatus;
  createdAt: string;
}

export interface QueryCrawlAuditsParams {
  page?: number;
  limit?: number;
  status?: CrawlStatus;
  search?: string;
}

export type CrawlAuditsResponse = PaginatedApiResponse<CrawlAuditEvent>;
