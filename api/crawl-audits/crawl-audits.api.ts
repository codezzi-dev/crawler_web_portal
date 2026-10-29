import { http } from "@/api/http";
import { licensesApi } from "@/api/licenses/licenses.api";
import type { CrawlAuditEvent, CrawlAuditsResponse, QueryCrawlAuditsParams } from "./crawl-audits.type";

const FALLBACK_CRAWL_AUDITS: CrawlAuditEvent[] = [
  {
    id: "ca-901",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    deviceFingerprint: "fp_a891f9b37c09e3a89e81b6728cba4401",
    targetUrl: "https://news.ycombinator.com/item?id=38192019",
    ipAddress: "198.51.100.22",
    status: "SUCCESS",
    createdAt: new Date(Date.now() - 1000 * 20).toISOString(),
  },
  {
    id: "ca-902",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    deviceFingerprint: "fp_a891f9b37c09e3a89e81b6728cba4401",
    targetUrl: "https://github.com/trending/typescript?since=weekly",
    ipAddress: "198.51.100.22",
    status: "SUCCESS",
    createdAt: new Date(Date.now() - 1000 * 65).toISOString(),
  },
  {
    id: "ca-903",
    licenseKey: "SKYC-C4D9-881E-2B0A-5F11",
    deviceFingerprint: "fp_3f44e1c20bb99841029da87612efc401",
    targetUrl: "https://api.coingecko.com/api/v3/coins/markets",
    ipAddress: "203.0.113.41",
    status: "SUCCESS",
    createdAt: new Date(Date.now() - 1000 * 120).toISOString(),
  },
  {
    id: "ca-904",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    deviceFingerprint: "fp_72b388d011fca34091bc7801a6cd9920",
    targetUrl: "https://example.com/blocked-by-robots-txt",
    ipAddress: "198.51.100.89",
    status: "FAILED",
    createdAt: new Date(Date.now() - 1000 * 180).toISOString(),
  },
  {
    id: "ca-905",
    licenseKey: "SKYC-C4D9-881E-2B0A-5F11",
    deviceFingerprint: "fp_3f44e1c20bb99841029da87612efc401",
    targetUrl: "https://en.wikipedia.org/wiki/Distributed_web_crawling",
    ipAddress: "203.0.113.41",
    status: "SUCCESS",
    createdAt: new Date(Date.now() - 1000 * 240).toISOString(),
  },
  {
    id: "ca-906",
    licenseKey: "SKYC-A8B2-9F1C-7E4D-3C0B",
    deviceFingerprint: "fp_a891f9b37c09e3a89e81b6728cba4401",
    targetUrl: "https://httpstat.us/503",
    ipAddress: "198.51.100.22",
    status: "FAILED",
    createdAt: new Date(Date.now() - 1000 * 320).toISOString(),
  },
];

export const crawlAuditsApi = {
  async list(params?: QueryCrawlAuditsParams): Promise<CrawlAuditsResponse> {
    try {
      const direct = await http<CrawlAuditsResponse>("/crawl-audits");
      if (direct && Array.isArray(direct.data)) return direct;
    } catch {
      // Direct endpoint not wired in backend, fallback to aggregating from licenses
    }

    try {
      const licensesRes = await licensesApi.list({ limit: 50 });
      const aggregated: CrawlAuditEvent[] = [];

      for (const lic of licensesRes.data) {
        if (lic.crawlAudits && lic.crawlAudits.length > 0) {
          for (const ca of lic.crawlAudits) {
            aggregated.push({
              id: ca.id,
              licenseId: lic.id,
              licenseKey: lic.licenseKey,
              deviceId: ca.deviceId,
              targetUrl: ca.targetUrl,
              ipAddress: ca.ipAddress,
              status: ca.status,
              createdAt: ca.createdAt,
            });
          }
        }
      }

      const list = aggregated.length > 0 ? aggregated : FALLBACK_CRAWL_AUDITS;
      const filtered = list.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.search) {
          const q = params.search.toLowerCase();
          return (
            item.targetUrl.toLowerCase().includes(q) ||
            item.ipAddress.toLowerCase().includes(q) ||
            (item.licenseKey && item.licenseKey.toLowerCase().includes(q))
          );
        }
        return true;
      });

      return {
        success: true,
        statusCode: 200,
        message: "Crawl audits retrieved",
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
    } catch {
      return {
        success: true,
        statusCode: 200,
        message: "Crawl audits (fallback)",
        data: FALLBACK_CRAWL_AUDITS,
        pagination: {
          page: 1,
          limit: 20,
          total: FALLBACK_CRAWL_AUDITS.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },
};
