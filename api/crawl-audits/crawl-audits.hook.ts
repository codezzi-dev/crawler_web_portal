"use client";

import { useQuery } from "@tanstack/react-query";
import { crawlAuditsApi } from "./crawl-audits.api";
import type { QueryCrawlAuditsParams } from "./crawl-audits.type";

export function useCrawlAudits(
  params?: QueryCrawlAuditsParams,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: ["crawl-audits", params],
    queryFn: () => crawlAuditsApi.list(params),
    refetchInterval: options?.refetchInterval,
  });
}
