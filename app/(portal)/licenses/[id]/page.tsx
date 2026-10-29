"use client";

import { use, useState } from "react";
import {
  ArrowLeft,
  Key,
  Copy,
  Check,
  Laptop,
  Activity,
  History,
  ShieldAlert,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { DeleteConfirmModal } from "@/components/modals/generic/DeleteConfirmModal";
import { UpdateLicenseStatusModal } from "@/components/modals/licenses/UpdateLicenseStatusModal";
import {
  useLicenseDetail,
  useRevokeDevice,
  type LicenseDevice,
  type LicenseCrawlAudit,
  type LicenseStatusHistory,
} from "@/api/licenses";

export default function LicenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedTab, setSelectedTab] = useState<string>("devices");
  const [copiedKey, setCopiedKey] = useState(false);
  const [revokeDeviceModalOpen, setRevokeDeviceModalOpen] = useState(false);
  const [deviceToRevoke, setDeviceToRevoke] = useState<LicenseDevice | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { data: license, isLoading } = useLicenseDetail(id);
  const revokeMutation = useRevokeDevice();

  const handleCopy = (key?: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    toast.success("License key copied");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRevokeConfirm = () => {
    if (!deviceToRevoke) return;
    revokeMutation.mutate(deviceToRevoke.id, {
      onSuccess: () => {
        toast.success(`Device ${deviceToRevoke.deviceName} revoked`);
        setRevokeDeviceModalOpen(false);
        setDeviceToRevoke(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to revoke device");
      },
    });
  };

  const deviceColumns: ColumnDef<LicenseDevice>[] = [
    {
      accessorKey: "deviceName",
      header: "Device Node",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Laptop className="size-4 text-primary" />
          <span className="font-semibold text-xs text-foreground">
            {row.original.deviceName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "deviceFingerprint",
      header: "Hardware Fingerprint",
      cell: ({ row }) => (
        <code className="text-[11px] font-mono text-muted-foreground truncate max-w-xs block">
          {row.original.deviceFingerprint}
        </code>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "Network IP",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-foreground">
          {row.original.ipAddress}
        </span>
      ),
    },
    {
      accessorKey: "macAddress",
      header: "MAC Address",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.macAddress || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
          className={
            row.original.status === "ACTIVE"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : ""
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.lastActiveAt
            ? new Date(row.original.lastActiveAt).toLocaleString()
            : "Never"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        if (row.original.status === "REVOKED") return null;
        return (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => {
              setDeviceToRevoke(row.original);
              setRevokeDeviceModalOpen(true);
            }}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5 mr-1" />
            <span>Revoke</span>
          </Button>
        );
      },
    },
  ];

  const auditColumns: ColumnDef<LicenseCrawlAudit>[] = [
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleString()}
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
        <div className="flex items-center gap-1.5 max-w-md truncate text-xs font-mono">
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
      header: "Source IP",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.ipAddress}</span>
      ),
    },
  ];

  const historyColumns: ColumnDef<LicenseStatusHistory>[] = [
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: "transition",
      header: "Status Transition",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs font-medium">
          <Badge variant="outline">{row.original.oldStatus || "INIT"}</Badge>
          <span>→</span>
          <Badge
            variant={
              row.original.newStatus === "ACTIVE"
                ? "default"
                : row.original.newStatus === "BLOCKED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {row.original.newStatus}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "changedBy",
      header: "Changed By",
      cell: ({ row }) => (
        <span className="text-xs font-mono">{row.original.changedBy || "System"}</span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason / Notes",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{row.original.reason || "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back to Licenses Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/licenses">
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/licenses" className="hover:underline">Licenses</Link>
          <span>/</span>
          <span className="font-mono text-foreground font-semibold">
            {license?.licenseKey || id}
          </span>
        </div>
      </div>

      {/* Hero Dossier Card */}
      <Card className="border-primary/20 bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <code className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-lg font-bold tracking-wider text-primary">
                  {license?.licenseKey || "SKYC-XXXX-XXXX-XXXX-XXXX"}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleCopy(license?.licenseKey)}
                >
                  {copiedKey ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
                <Badge
                  variant={license?.status === "ACTIVE" ? "default" : "destructive"}
                  className={
                    license?.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : ""
                  }
                >
                  {license?.status || "ACTIVE"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Client Owner: <span className="text-foreground font-semibold">{license?.user?.name || "Client"}</span> ({license?.user?.email}) · Package Tier: <span className="text-foreground font-semibold">{license?.package?.name || "Standard"}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setStatusModalOpen(true)}
                className="gap-2 text-xs"
              >
                <ShieldAlert className="size-3.5 text-amber-500" />
                <span>Override Status</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Device Limit</span>
              <span className="font-bold text-foreground font-mono text-sm">
                {license?.devices?.length || 0} / {license?.deviceLimit || 1} Nodes
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Crawls Used This Cycle</span>
              <span className="font-bold text-foreground font-mono text-sm">
                {(license?.crawlsUsedThisCycle || 0).toLocaleString()} req
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Expires At</span>
              <span className="font-bold text-foreground text-sm">
                {license?.expiresAt
                  ? new Date(license.expiresAt).toLocaleDateString()
                  : "Lifetime Horizon"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Provisioned Date</span>
              <span className="font-bold text-foreground text-sm">
                {license?.createdAt
                  ? new Date(license.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <CustomToggleTabs
        tabs={[
          {
            id: "devices",
            label: "Bound Hardware Nodes",
            count: license?.devices?.length || 0,
            icon: Laptop,
          },
          {
            id: "audits",
            label: "Crawl Execution History",
            count: license?.crawlAudits?.length || 0,
            icon: Activity,
          },
          {
            id: "history",
            label: "Status Audit Trail",
            count: license?.statusHistories?.length || 0,
            icon: History,
          },
        ]}
        value={selectedTab}
        onChange={(tab) => setSelectedTab(tab)}
        variant="segmented"
      />

      {/* Tab Panels */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        {selectedTab === "devices" && (
          <DataTable
            columns={deviceColumns}
            data={license?.devices || []}
            emptyMessage="No hardware devices currently bound to this license key."
          />
        )}

        {selectedTab === "audits" && (
          <DataTable
            columns={auditColumns}
            data={license?.crawlAudits || []}
            emptyMessage="No crawl operations recorded under this license yet."
          />
        )}

        {selectedTab === "history" && (
          <DataTable
            columns={historyColumns}
            data={license?.statusHistories || []}
            emptyMessage="No administrative status changes on record."
          />
        )}
      </div>

      {/* Revoke Device Confirmation Modal */}
      <DeleteConfirmModal
        open={revokeDeviceModalOpen}
        onOpenChange={setRevokeDeviceModalOpen}
        onConfirm={handleRevokeConfirm}
        itemName={deviceToRevoke?.deviceName}
        itemType="Hardware Device Authorization"
        confirmText="Revoke Device"
        loading={revokeMutation.isPending}
      />

      {/* Status Modal */}
      <UpdateLicenseStatusModal
        license={license || null}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
      />
    </div>
  );
}
