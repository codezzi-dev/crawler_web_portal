import type { ApiResponse, PaginatedApiResponse } from "@/api/types/api-response";

export type CrawlJobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface CrawlJob {
  id: string;
  userId: string | null;
  licenseId: string | null;
  deviceId: string | null;
  keywords: string[];
  status: CrawlJobStatus;
  totalResults: number;
  errorMessage?: string | null;
  metadata?: {
    location?: string;
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  license?: {
    id: string;
    licenseKey: string;
    status: string;
  } | null;
}

export interface CrawlResultItem {
  id: string;
  jobId: string;
  keyword: string;
  title?: string | null;
  url?: string | null;
  snippet?: string | null;
  extractedData?: {
    phone?: string;
    email?: string;
    address?: string;
    category?: string;
    [key: string]: any;
  } | null;
  scrapedAt: string;
}

export interface CreateCrawlJobPayload {
  keywords: string[];
  location?: string;
  license_id?: string;
  metadata?: Record<string, any>;
}

export interface QueryCrawlJobsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  userId?: string;
}

export interface QueryCrawlResultsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type CrawlJobsResponse = PaginatedApiResponse<CrawlJob>;
export type CrawlJobDetailResponse = ApiResponse<CrawlJob>;
export type CrawlResultsResponse = PaginatedApiResponse<CrawlResultItem>;
