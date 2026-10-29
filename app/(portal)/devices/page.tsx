"use client";

import { useState } from "react";
import {
  Laptop,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { DeleteConfirmModal } from "@/components/modals/generic/DeleteConfirmModal";
import {
  useFleetDevices,
  useRevokeFleetDevice,
  type FleetDevice,
} from "@/api/devices";
import type { DeviceStatus } from "@/api/licenses";

export default function DevicesFleetPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [copiedFingerprint, setCopiedFingerprint] = useState<string | null>(null);
  const [deviceToRevoke, setDeviceToRevoke] = useState<FleetDevice | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const statusFilter =
    selectedTab === "all" ? undefined : (selectedTab.toUpperCase() as DeviceStatus);

  const { data: devicesRes, isLoading } = useFleetDevices({
    status: statusFilter,
    search: search || undefined,
  });

  const revokeMutation = useRevokeFleetDevice();

  const handleCopy = (fp: string) => {
    navigator.clipboard.writeText(fp);
    setCopiedFingerprint(fp);
    toast.success("Hardware fingerprint copied");
    setTimeout(() => setCopiedFingerprint(null), 2000);
  };

  const handleRevokeConfirm = () => {
    if (!deviceToRevoke) return;
    revokeMutation.mutate(deviceToRevoke.id, {
      onSuccess: () => {
        toast.success(`Node ${deviceToRevoke.deviceName} revoked from fleet`);
        setConfirmOpen(false);
        setDeviceToRevoke(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to revoke device");
      },
    });
  };

  const columns: ColumnDef<FleetDevice>[] = [
    {
      accessorKey: "deviceName",
      header: "Device Node",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Laptop className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs text-foreground">
              {row.original.deviceName}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {row.original.packageName || "Standard Cluster"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "deviceFingerprint",
      header: "Hardware Fingerprint",
      cell: ({ row }) => {
        const fp = row.original.deviceFingerprint;
        const isCopied = copiedFingerprint === fp;
        return (
          <div className="flex items-center gap-1.5 max-w-xs">
            <code className="truncate font-mono text-[11px] text-muted-foreground">
              {fp}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleCopy(fp)}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              {isCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.ipAddress}</span>
      ),
    },
    {
      accessorKey: "macAddress",
      header: "MAC Binding",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.macAddress || "—"}
        </span>
      ),
    },
    {
      accessorKey: "licenseKey",
      header: "Linked License",
      cell: ({ row }) => {
        const key = row.original.licenseKey;
        if (!key) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <Link
            href={`/licenses/${row.original.licenseId || ""}`}
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline font-semibold"
          >
            <span>{key}</span>
            <ExternalLink className="size-3" />
          </Link>
        );
      },
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
      header: "Last Heartbeat",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
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
              setConfirmOpen(true);
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

  const devices = devicesRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Crawler Node Fleet Monitor
        </h1>
        <p className="text-sm text-muted-foreground">
          Active hardware bindings, remote daemon fingerprints, and cryptographic revocation controls
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Nodes", count: devices.length },
            { id: "active", label: "Active" },
            { id: "revoked", label: "Revoked" },
          ]}
          value={selectedTab}
          onChange={(tab) => setSelectedTab(tab)}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search device, IP, or fingerprint..."
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
          data={devices}
          emptyMessage="No hardware crawler devices registered in the fleet."
        />
      </div>

      {/* Revocation Confirmation Dialog */}
      <DeleteConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleRevokeConfirm}
        itemName={deviceToRevoke?.deviceName}
        itemType="Hardware Device Authorization"
        confirmText="Revoke Node"
        loading={revokeMutation.isPending}
      />
    </div>
  );
}
