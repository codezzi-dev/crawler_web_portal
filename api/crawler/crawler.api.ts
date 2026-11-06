import { http } from "@/api/http";
import type {
  CrawlJobDetailResponse,
  CrawlJobsResponse,
  CrawlResultsResponse,
  CreateCrawlJobPayload,
  QueryCrawlJobsParams,
  QueryCrawlResultsParams,
} from "./crawler.type";

export const crawlerApi = {
  async listJobs(params?: QueryCrawlJobsParams): Promise<CrawlJobsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.userId) searchParams.set("userId", params.userId);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await http<CrawlJobsResponse>(`/crawler/jobs${query}`);
  },

  async getJobById(id: string): Promise<CrawlJobDetailResponse> {
    return await http<CrawlJobDetailResponse>(`/crawler/jobs/${id}`);
  },

  async createJob(payload: CreateCrawlJobPayload): Promise<CrawlJobDetailResponse> {
    return await http<CrawlJobDetailResponse>("/crawler/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getJobResults(
    jobId: string,
    params?: QueryCrawlResultsParams,
  ): Promise<CrawlResultsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await http<CrawlResultsResponse>(`/crawler/jobs/${jobId}/results${query}`);
  },
};
