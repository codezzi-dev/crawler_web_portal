import type { QueryCrawlJobsParams, QueryCrawlResultsParams } from "./crawler.type";

export const crawlerKeys = {
  all: ["crawler"] as const,
  jobs: () => [...crawlerKeys.all, "jobs"] as const,
  jobList: (params?: QueryCrawlJobsParams) => [...crawlerKeys.jobs(), "list", params] as const,
  jobDetail: (id: string) => [...crawlerKeys.jobs(), "detail", id] as const,
  results: (jobId: string, params?: QueryCrawlResultsParams) =>
    [...crawlerKeys.jobDetail(jobId), "results", params] as const,
};
