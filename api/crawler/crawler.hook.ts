import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crawlerApi } from "./crawler.api";
import { crawlerKeys } from "./crawler.keys";
import {
  crawlJobsQueryOptions,
  crawlJobDetailQueryOptions,
  crawlJobResultsQueryOptions,
} from "./crawler.queries";
import type {
  CreateCrawlJobPayload,
  QueryCrawlJobsParams,
  QueryCrawlResultsParams,
} from "./crawler.type";

export function useCrawlJobs(
  params?: QueryCrawlJobsParams,
  options?: { refetchInterval?: number | false }
) {
  return useQuery(crawlJobsQueryOptions(params, options));
}

export function useCrawlJob(id: string) {
  return useQuery(crawlJobDetailQueryOptions(id));
}

export function useCrawlJobResults(jobId: string, params?: QueryCrawlResultsParams) {
  return useQuery(crawlJobResultsQueryOptions(jobId, params));
}

export function useCreateCrawlJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCrawlJobPayload) => crawlerApi.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crawlerKeys.jobs() });
    },
  });
}
