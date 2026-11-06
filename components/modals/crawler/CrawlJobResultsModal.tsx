"use client";

import { useState } from "react";
import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Search,
  Sparkles,
  FileSpreadsheet,
  Star,
  Globe,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import {
  useCrawlJobResults,
  type CrawlJob,
  type CrawlResultItem,
} from "@/api/crawler";

interface CrawlJobResultsModalProps {
  job: CrawlJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CrawlJobResultsModal({
  job,
  open,
  onOpenChange,
}: CrawlJobResultsModalProps) {
  const [search, setSearch] = useState("");

  const { data: resultsRes, isLoading } = useCrawlJobResults(
    job?.id || "",
    { search: search.trim() || undefined, limit: 100 },
  );

  const results = resultsRes?.data || [];

  const handleExportCsv = () => {
    if (results.length === 0) {
      toast.error("No scraped leads to export");
      return;
    }

    const headers = [
      "Keyword",
      "Business / Title",
      "URL",
      "Phone",
      "Email",
      "Address",
      "Rating",
      "Reviews Count",
      "Snippet",
      "Scraped At",
    ];

    const rows = results.map((r) => [
      `"${(r.keyword || "").replace(/"/g, '""')}"`,
      `"${(r.title || "").replace(/"/g, '""')}"`,
      `"${(r.url || "").replace(/"/g, '""')}"`,
      `"${(r.extractedData?.phone || "").replace(/"/g, '""')}"`,
      `"${(r.extractedData?.email || "").replace(/"/g, '""')}"`,
      `"${(r.extractedData?.address || "").replace(/"/g, '""')}"`,
      `"${r.extractedData?.rating ?? ""}"`,
      `"${r.extractedData?.reviewsCount ?? ""}"`,
      `"${(r.snippet || "").replace(/"/g, '""')}"`,
      `"${new Date(r.scrapedAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Descriptive filename: e.g. SkyCrawler_Leads_software_companies_in_dhaka_2026-11-03.csv
    const primaryKeyword = job?.keywords?.[0]
      ? job.keywords[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 35).replace(/^_+|_+$/g, "")
      : "leads";
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `SkyCrawler_Leads_${primaryKeyword}_${dateStr}.csv`;

    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${results.length} leads to CSV`);
  };

  const columns: ColumnDef<CrawlResultItem>[] = [
    {
      accessorKey: "title",
      header: "Business Name & Details",
      cell: ({ row }) => {
        const rating = row.original.extractedData?.rating;
        const reviewsCount = row.original.extractedData?.reviewsCount;
        const category = row.original.extractedData?.category;

        return (
          <div className="space-y-1.5 py-1 min-w-[220px]">
            <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <span>{row.original.title || "Unnamed Business"}</span>
              {row.original.url && (
                <a
                  href={row.original.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                  title="Open website / map URL"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {rating !== undefined && rating !== null && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">
                  <Star className="size-3 fill-amber-500" />
                  {rating}
                  {reviewsCount && (
                    <span className="text-muted-foreground font-normal">
                      ({reviewsCount})
                    </span>
                  )}
                </span>
              )}

              {category && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  <Tag className="size-2.5" />
                  {category}
                </span>
              )}
            </div>

            {row.original.snippet && (
              <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
                {row.original.snippet}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "keyword",
      header: "Matched Keyword",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2.5 py-1 font-mono text-xs text-foreground max-w-[200px]">
          <span className="truncate" title={row.original.keyword}>
            {row.original.keyword}
          </span>
        </span>
      ),
    },
    {
      accessorKey: "extractedData",
      header: "Contact & Location",
      cell: ({ row }) => {
        const data = row.original.extractedData;
        if (!data || (!data.phone && !data.email && !data.address)) {
          return <span className="text-xs text-muted-foreground font-mono">—</span>;
        }

        return (
          <div className="space-y-1 text-xs py-1 min-w-[200px]">
            {data.phone && (
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Phone className="size-3.5 text-primary shrink-0" />
                <a href={`tel:${data.phone}`} className="hover:underline font-mono">
                  {data.phone}
                </a>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-1.5 text-foreground">
                <Mail className="size-3.5 text-primary shrink-0" />
                <a href={`mailto:${data.email}`} className="hover:underline truncate max-w-xs">
                  {data.email}
                </a>
              </div>
            )}
            {data.address && (
              <div className="flex items-start gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{data.address}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "scrapedAt",
      header: "Scraped At",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {new Date(row.original.scrapedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={job ? `Extracted Results — Crawl Session #${job.id.substring(0, 8)}` : "Crawl Details"}
      subtitle={
        job
          ? `Source: Google Maps | Status: ${job.status} | Keywords executed: ${job.keywords.length}`
          : "Viewing extracted business records reported from client desktop crawler"
      }
      icon={Sparkles}
      className="sm:max-w-5xl lg:max-w-6xl w-full max-h-[92vh] h-[85vh]"
      secondaryActions={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
      primaryActions={
        <Button
          onClick={handleExportCsv}
          disabled={results.length === 0}
          className="gap-2"
        >
          <FileSpreadsheet className="size-4" />
          Export Extracted Leads (CSV)
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Session Metadata Banner */}
        {job && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border bg-muted/30 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">License Key:</span>
              <code className="font-mono font-semibold text-primary">
                {job.license?.licenseKey || "SKYC-XXXX-XXXX"}
              </code>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Source Platform:</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Globe className="size-3.5 text-primary" />
                {job.metadata?.source || "Google Maps"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Total Extracted:</span>
              <span className="font-bold text-foreground font-mono">
                {job.totalResults} results
              </span>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              Extracted Records: <strong className="text-foreground">{results.length}</strong>
            </span>
          </div>

          <div className="w-full sm:w-80">
            <Input
              icon={Search}
              placeholder="Search business names, phones, addresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Data Table with roomy scrollable container */}
        <div className="rounded-md border bg-card overflow-hidden h-[420px] overflow-y-auto">
          <DataTable
            columns={columns}
            data={results}
            emptyMessage={
              isLoading
                ? "Loading scraped records from Google Maps..."
                : "No scraped records recorded for this crawl session."
            }
          />
        </div>
      </div>
    </AppModal>
  );
}
