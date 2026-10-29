"use client";

import { useState } from "react";
import {
  Activity,
  Search,
  ExternalLink,
  RefreshCw,
  Globe,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { useCrawlAudits, type CrawlAuditEvent } from "@/api/crawl-audits";
import type { CrawlStatus } from "@/api/licenses";

export default function CrawlAuditsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const statusFilter =
    selectedTab === "all" ? undefined : (selectedTab.toUpperCase() as CrawlStatus);

  const { data: auditsRes, isFetching, refetch } = useCrawlAudits(
    {
      status: statusFilter,
      search: search || undefined,
    },
    {
      refetchInterval: autoRefresh ? 10000 : undefined,
    },
  );

  const audits = auditsRes?.data || [];

  const columns: ColumnDef<CrawlAuditEvent>[] = [
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Execution Status",
      cell: ({ row }) => {
        const isSuccess = row.original.status === "SUCCESS";
        return (
          <Badge
            variant={isSuccess ? "default" : "destructive"}
            className={
              isSuccess
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : ""
            }
          >
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "targetUrl",
      header: "Target Crawled URL",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 max-w-md truncate text-xs font-mono">
          <Globe className="size-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{row.original.targetUrl}</span>
          <a
            href={row.original.targetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary shrink-0"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "Client IP",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-foreground">
          {row.original.ipAddress}
        </span>
      ),
    },
    {
      accessorKey: "deviceFingerprint",
      header: "Hardware Fingerprint",
      cell: ({ row }) => (
        <code className="text-[11px] font-mono text-muted-foreground truncate max-w-xs block">
          {row.original.deviceFingerprint || "Anonymous Worker"}
        </code>
      ),
    },
    {
      accessorKey: "licenseKey",
      header: "License Key",
      cell: ({ row }) => (
        <code className="text-xs font-mono text-primary font-semibold">
          {row.original.licenseKey || "SKYC-XXXX-XXXX"}
        </code>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Live Crawl Execution Stream
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time feed of crawler requests, client IP traces, and quota consumption audits
          </p>
        </div>

        {/* Auto Refresh Toggle */}
        <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Radio className={`size-3.5 ${autoRefresh ? "text-emerald-500 animate-pulse" : "text-muted-foreground"}`} />
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

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Audits", count: audits.length },
            { id: "success", label: "Success" },
            { id: "failed", label: "Failed" },
          ]}
          value={selectedTab}
          onChange={(tab) => setSelectedTab(tab)}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search URL, IP, or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={audits}
          emptyMessage="No crawl operations logged in this timeframe."
        />
      </div>
    </div>
  );
}
