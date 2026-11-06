"use client";

import { useState } from "react";
import {
  Activity,
  Search,
  RefreshCw,
  Globe,
  Radio,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { CrawlJobResultsModal } from "@/components/modals/crawler/CrawlJobResultsModal";
import { ViewAllKeywordsModal } from "@/components/modals/crawler/ViewAllKeywordsModal";
import { useCrawlJobs, type CrawlJob, type CrawlJobStatus } from "@/api/crawler";

export default function CrawlAuditsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Pagination state to handle large datasets properly
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<CrawlJob | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [keywordsModalData, setKeywordsModalData] = useState<{ keywords: string[]; id: string } | null>(null);
  const [keywordsModalOpen, setKeywordsModalOpen] = useState(false);

  const statusFilter = selectedTab === "all" ? undefined : selectedTab;

  const { data: jobsRes, isFetching, refetch } = useCrawlJobs(
    {
      page,
      limit,
      status: statusFilter,
      search: search.trim() || undefined,
    },
    {
      refetchInterval: autoRefresh ? 10000 : false,
    }
  );

  const jobs = jobsRes?.data || [];
  const pagination = jobsRes?.pagination || {
    page: 1,
    limit: 10,
    total: jobs.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const handleOpenDetails = (job: CrawlJob) => {
    setSelectedJobForDetails(job);
    setDetailsModalOpen(true);
  };

  const handleOpenAllKeywords = (job: CrawlJob) => {
    setKeywordsModalData({ keywords: job.keywords || [], id: job.id });
    setKeywordsModalOpen(true);
  };

  const getStatusBadge = (status: CrawlJobStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="default"
            className="gap-1 font-semibold text-[11px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          >
            <CheckCircle2 className="size-3" />
            COMPLETED
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="secondary"
            className="gap-1 font-semibold text-[11px] text-blue-600 dark:text-blue-400"
          >
            <RefreshCw className="size-3 animate-spin" />
            PROCESSING
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="gap-1 font-semibold text-[11px] text-amber-600 dark:text-amber-400 border-amber-500/30"
          >
            <Clock className="size-3" />
            PENDING
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive" className="gap-1 font-semibold text-[11px]">
            <AlertCircle className="size-3" />
            FAILED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<CrawlJob>[] = [
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">
          {new Date(row.original.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      ),
    },
    {
      accessorKey: "license",
      header: "License & Client",
      cell: ({ row }) => {
        const licenseKey = row.original.license?.licenseKey;
        const userEmail = row.original.user?.email || row.original.user?.name;

        return (
          <div className="space-y-0.5">
            <code className="text-xs font-mono text-primary font-semibold block">
              {licenseKey || "SKYC-XXXX-XXXX"}
            </code>
            {userEmail && (
              <span className="text-[11px] text-muted-foreground block truncate max-w-[160px]">
                {userEmail}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "keywords",
      header: "Keywords (From Client .txt File)",
      cell: ({ row }) => {
        const keywords = row.original.keywords || [];
        if (keywords.length === 0) {
          return <span className="text-xs text-muted-foreground font-mono">—</span>;
        }

        const visibleKeywords = keywords.slice(0, 2);
        const remainingCount = keywords.length - 2;

        return (
          <div className="flex flex-wrap items-center gap-1.5 max-w-md py-0.5">
            {visibleKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2.5 py-1 text-xs font-mono text-foreground shadow-2xs hover:bg-muted/90 transition-colors max-w-[200px]"
                title={kw}
              >
                <span className="truncate">{kw}</span>
              </span>
            ))}

            {remainingCount > 0 && (
              <button
                type="button"
                onClick={() => handleOpenAllKeywords(row.original)}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                title="Click to view all keywords parsed from the .txt file"
              >
                <Eye className="size-3.5" />
                <span>+{remainingCount} more</span>
              </button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "metadata",
      header: "Source",
      cell: ({ row }) => {
        const source = row.original.metadata?.source || "Google Maps";
        return (
          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
            <Globe className="size-3.5 text-primary shrink-0" />
            <span>{source}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "totalResults",
      header: "Extracted Results",
      cell: ({ row }) => (
        <div className="font-mono font-bold text-xs text-foreground">
          {row.original.totalResults.toLocaleString()} Results
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => handleOpenDetails(row.original)}
        >
          <Eye className="size-3.5" />
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="size-6 text-primary" />
            Live Crawl Execution & Audit Stream
          </h1>
          <p className="text-sm text-muted-foreground">
            Audit feed of keyword crawls executed by client desktop applications, Google Maps queries, and extracted business leads
          </p>
        </div>

        {/* Live Stream / Auto Refresh Toggle */}
        <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Radio
              className={`size-3.5 ${
                autoRefresh ? "text-emerald-500 animate-pulse" : "text-muted-foreground"
              }`}
            />
            <span>Auto Refresh (10s)</span>
          </div>
          <Switch
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
            aria-label="Toggle auto refresh"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh stream manually"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Audits", count: pagination.total },
            { id: "COMPLETED", label: "Completed" },
            { id: "PROCESSING", label: "Processing" },
            { id: "PENDING", label: "Pending" },
            { id: "FAILED", label: "Failed" },
          ]}
          value={selectedTab}
          onChange={(tab) => {
            setSelectedTab(tab);
            setPage(1); // Reset to first page when changing tabs
          }}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search keywords, license, or client..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={jobs}
          emptyMessage={
            isFetching
              ? "Loading crawl execution audits..."
              : "No crawl execution records found matching your filter criteria."
          }
        />

        {/* Pagination Bar to ensure large datasets never create an unruly long list */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-foreground">
                {jobs.length > 0 ? (page - 1) * limit + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(page * limit, pagination.total)}
              </strong>{" "}
              of <strong className="text-foreground">{pagination.total}</strong> records
            </span>

            <span className="mx-2 text-border">|</span>

            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 rounded-sm border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page <strong className="text-foreground">{page}</strong> of{" "}
              <strong className="text-foreground">{pagination.totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                title="Previous page"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNext || page >= pagination.totalPages || isFetching}
                title="Next page"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacious Details Modal for Extracted Google Maps Leads */}
      <CrawlJobResultsModal
        job={selectedJobForDetails}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      {/* Popover / Modal to view all keywords for a record */}
      {keywordsModalData && (
        <ViewAllKeywordsModal
          open={keywordsModalOpen}
          onOpenChange={setKeywordsModalOpen}
          keywords={keywordsModalData.keywords}
          jobId={keywordsModalData.id}
        />
      )}
    </div>
  );
}
