import { queryOptions } from "@tanstack/react-query";
import { crawlerApi } from "./crawler.api";
import { crawlerKeys } from "./crawler.keys";
import type { QueryCrawlJobsParams, QueryCrawlResultsParams } from "./crawler.type";

export function crawlJobsQueryOptions(
  params?: QueryCrawlJobsParams,
  options?: { refetchInterval?: number | false }
) {
  return queryOptions({
    queryKey: crawlerKeys.jobList(params),
    queryFn: async () => {
      return await crawlerApi.listJobs(params);
    },
    staleTime: 1000 * 15,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export function crawlJobDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: crawlerKeys.jobDetail(id),
    queryFn: async () => {
      const res = await crawlerApi.getJobById(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 10,
  });
}

export function crawlJobResultsQueryOptions(jobId: string, params?: QueryCrawlResultsParams) {
  return queryOptions({
    queryKey: crawlerKeys.results(jobId, params),
    queryFn: async () => {
      return await crawlerApi.getJobResults(jobId, params);
    },
    enabled: Boolean(jobId),
    staleTime: 1000 * 30,
  });
}
