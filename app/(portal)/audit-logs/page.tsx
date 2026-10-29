"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  Key,
  Laptop,
  Users,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { useAuditLogs, type SystemAuditLogItem } from "@/api/audit-logs";

export default function AuditLogsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");

  const actionFilter = selectedTab === "all" ? undefined : selectedTab;

  const { data: logsRes, isLoading } = useAuditLogs({
    action: actionFilter,
    search: search || undefined,
  });

  const logs = logsRes?.data || [];

  const columns: ColumnDef<SystemAuditLogItem>[] = [
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
      accessorKey: "adminEmail",
      header: "Admin Actor",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground">
          <Shield className="size-3.5 text-primary" />
          <span>{row.original.adminEmail || "admin@skycrawler.io"}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Administrative Action",
      cell: ({ row }) => {
        const action = row.original.action;
        let variant: "default" | "destructive" | "secondary" | "outline" = "outline";
        if (action.includes("BLOCK") || action.includes("SUSPEND") || action.includes("REVOKE")) {
          variant = "destructive";
        } else if (action.includes("GENERATE") || action.includes("CREATE")) {
          variant = "default";
        }
        return (
          <Badge variant={variant} className="font-mono text-[11px] font-bold">
            {action}
          </Badge>
        );
      },
    },
    {
      accessorKey: "targetType",
      header: "Target Entity",
      cell: ({ row }) => {
        const type = row.original.targetType;
        return (
          <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            {type === "LICENSE" && <Key className="size-3 text-primary" />}
            {type === "DEVICE" && <Laptop className="size-3 text-primary" />}
            {type === "USER" && <Users className="size-3 text-primary" />}
            <span>{type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "targetId",
      header: "Target ID",
      cell: ({ row }) => (
        <code className="text-xs font-mono text-muted-foreground">
          {row.original.targetId ? `${row.original.targetId.substring(0, 16)}...` : "—"}
        </code>
      ),
    },
    {
      accessorKey: "reason",
      header: "Audit Reason / Audit Trail",
      cell: ({ row }) => (
        <span className="text-xs text-foreground">
          {row.original.reason || "System administrative action execution"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Security & Audit Trail
        </h1>
        <p className="text-sm text-muted-foreground">
          Immutable ledger of SP Admin operations, privilege escalation checks, and status overrides
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Audit Actions", count: logs.length },
            { id: "GENERATE_LICENSE", label: "Licenses" },
            { id: "BLOCK_LICENSE", label: "Blocks" },
            { id: "REVOKE_DEVICE", label: "Revocations" },
            { id: "SUSPEND_USER", label: "Suspensions" },
          ]}
          value={selectedTab}
          onChange={(tab) => setSelectedTab(tab)}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search action or reason..."
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
          data={logs}
          emptyMessage="No audit log records match the search filter."
        />
      </div>
    </div>
  );
}
