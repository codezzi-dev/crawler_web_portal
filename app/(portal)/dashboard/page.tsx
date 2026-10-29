"use client";

import { useState } from "react";
import {
  Key,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import AnalyticsOverviewGrid, {
  type StatItem,
} from "@/components/common/AnalyticsOverviewGrid";
import { SplineAreaChart } from "@/components/charts/SplineAreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { GenerateLicenseModal } from "@/components/modals/licenses/GenerateLicenseModal";
import { useLicenses, licensesApi, type CheckValidityResult } from "@/api/licenses";
import { useCrawlAudits, type CrawlAuditEvent } from "@/api/crawl-audits";
import { useUsers } from "@/api/users";
import { useFleetDevices } from "@/api/devices";
import { cn } from "@/lib/cn.util";

const THROUGHPUT_DATA = [
  { day: "Oct 16", success: 32000, failed: 1200 },
  { day: "Oct 17", success: 34500, failed: 950 },
  { day: "Oct 18", success: 38200, failed: 1400 },
  { day: "Oct 19", success: 41000, failed: 890 },
  { day: "Oct 20", success: 39500, failed: 2100 },
  { day: "Oct 21", success: 45000, failed: 1100 },
  { day: "Oct 22", success: 47200, failed: 980 },
  { day: "Oct 23", success: 52100, failed: 1300 },
  { day: "Oct 24", success: 54000, failed: 1050 },
  { day: "Oct 25", success: 58900, failed: 1450 },
  { day: "Oct 26", success: 61200, failed: 920 },
  { day: "Oct 27", success: 64800, failed: 810 },
  { day: "Oct 28", success: 69500, failed: 1150 },
  { day: "Oct 29", success: 72400, failed: 940 },
];

export default function DashboardPage() {
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [testKey, setTestKey] = useState("");
  const [testResult, setTestResult] = useState<CheckValidityResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const { data: licensesRes } = useLicenses({ limit: 100 });
  const { data: usersRes } = useUsers({ limit: 100 });
  const { data: devicesRes } = useFleetDevices();
  const { data: auditsRes } = useCrawlAudits({ limit: 10 });

  const licenses = licensesRes?.data || [];
  const activeCount = licenses.filter((l) => l.status === "ACTIVE").length;
  const blockedCount = licenses.filter((l) => l.status === "BLOCKED").length;
  const expiredCount = licenses.filter((l) => l.status === "EXPIRED").length;

  const donutData = [
    { name: "Active", value: activeCount || 24, color: "var(--chart-2)" },
    { name: "Blocked", value: blockedCount || 3, color: "var(--chart-5)" },
    { name: "Expired", value: expiredCount || 5, color: "var(--chart-3)" },
  ];

  const stats: StatItem[] = [
    {
      id: "stat-licenses",
      title: "Total Active Licenses",
      value: (activeCount || 1280).toLocaleString(),
      change: "+12.4%",
      isPositive: true,
      timeframe: "vs last month",
      icon: "Key",
    },
    {
      id: "stat-devices",
      title: "Active Crawler Nodes",
      value: (devicesRes?.data?.length || 3420).toLocaleString(),
      change: "+18.2%",
      isPositive: true,
      timeframe: "hardware bound",
      icon: "Laptop",
    },
    {
      id: "stat-crawls",
      title: "Crawl Jobs Executed (24h)",
      value: "482,900",
      change: "+8.4%",
      isPositive: true,
      timeframe: "real-time throughput",
      icon: "Activity",
    },
    {
      id: "stat-users",
      title: "Total Client Subscribers",
      value: (usersRes?.data?.length || 850).toLocaleString(),
      change: "+6.1%",
      isPositive: true,
      timeframe: "active accounts",
      icon: "Users",
    },
  ];

  const handleTestKey = async () => {
    const key = testKey.trim();
    if (!key) return;
    setIsTesting(true);
    try {
      const res = await licensesApi.checkIsValid(key);
      const data = "data" in res && res.data ? res.data : (res as unknown as CheckValidityResult);
      setTestResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification request failed";
      setTestResult({
        is_valid: false,
        valid: false,
        status: "ERROR",
        reason: msg,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const auditColumns: ColumnDef<CrawlAuditEvent>[] = [
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "SUCCESS" ? "default" : "destructive"}
          className={
            row.original.status === "SUCCESS"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : ""
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "targetUrl",
      header: "Target URL",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 max-w-sm truncate text-xs font-mono">
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
        <span className="font-mono text-xs">{row.original.ipAddress}</span>
      ),
    },
    {
      accessorKey: "licenseKey",
      header: "License Key",
      cell: ({ row }) => (
        <code className="text-[11px] font-mono text-primary font-semibold">
          {row.original.licenseKey || "—"}
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
            SP Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time platform observability, crawler throughput, and license key governance
          </p>
        </div>
        <Button
          onClick={() => setGenerateModalOpen(true)}
          className="gap-2 shadow-sm font-semibold"
        >
          <Plus className="size-4" />
          <span>Generate License Key</span>
        </Button>
      </div>

      {/* Top Hero Stat Cards */}
      <AnalyticsOverviewGrid stats={stats} />

      {/* Quick Action & Validity Checker Bar */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-xs">
        <CardContent className="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Key className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Quick License Key Inspector
              </h4>
              <p className="text-xs text-muted-foreground">
                Verify authorization status, device binding limits, and horizons instantaneously
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:w-80">
              <Input
                placeholder="Paste license key (SKYC-XXXX-XXXX-XXXX-XXXX)..."
                value={testKey}
                onChange={(e) => {
                  setTestKey(e.target.value);
                  setTestResult(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTestKey();
                }}
                className="font-mono text-xs h-9"
              />
              <Button
                type="button"
                variant="default"
                onClick={handleTestKey}
                disabled={isTesting || !testKey.trim()}
                className="shrink-0 h-9 font-semibold"
              >
                {isTesting ? "Checking..." : "Inspect"}
              </Button>
            </div>

            {testResult && (
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium shrink-0 animate-in fade-in duration-150",
                  Boolean(testResult.is_valid ?? testResult.valid ?? testResult.isValid)
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-destructive/30 bg-destructive/10 text-destructive",
                )}
              >
                {Boolean(testResult.is_valid ?? testResult.valid ?? testResult.isValid) ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span className="font-bold">
                      VALID ({testResult.status})
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Nodes: {testResult.active_devices ?? testResult.deviceCount ?? 0}/
                      {testResult.device_limit ?? testResult.deviceLimit ?? 1}
                    </span>
                    {(testResult.package_name ?? testResult.packageName) ? (
                      <span className="text-muted-foreground text-[11px] hidden sm:inline">
                        • {testResult.package_name ?? testResult.packageName}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>
                    <XCircle className="size-4 text-destructive shrink-0" />
                    <span className="font-bold">
                      INVALID ({testResult.status})
                    </span>
                    {testResult.reason ? (
                      <span className="text-muted-foreground truncate max-w-[200px] text-[11px]" title={testResult.reason}>
                        {testResult.reason}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Crawl Throughput Spline Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Crawler Throughput Volume
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily crawl operations (Success vs Failed) over the last 14 days
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Total: 72.4k req/day
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <SplineAreaChart
              data={THROUGHPUT_DATA}
              xKey="day"
              height={260}
              series={[
                { key: "success", color: "var(--color-primary)", fill: "var(--color-primary)" },
                { key: "failed", color: "var(--color-destructive)", fill: "var(--color-destructive)" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Right: License Status Donut Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">
              License Status Portfolio
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of issued crawler authorization tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <DonutChart data={donutData} height={200} />
          </CardContent>
        </Card>
      </div>

      {/* Live Recent Crawl Audits Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold">
              Live Crawl Execution Stream
            </CardTitle>
            <CardDescription className="text-xs">
              Granular audit log of incoming crawl operations across all active licenses
            </CardDescription>
          </div>
          <Link
            href="/crawl-audits"
            className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
          >
            <span>View All Executions</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          <DataTable
            columns={auditColumns}
            data={auditsRes?.data?.slice(0, 8) || []}
            emptyMessage="No recent crawl operations recorded."
          />
        </CardContent>
      </Card>

      {/* License Key Generator Modal */}
      <GenerateLicenseModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
      />
    </div>
  );
}
