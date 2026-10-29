"use client";

import { useState } from "react";
import {
  Key,
  Plus,
  Search,
  Copy,
  Check,
  Eye,
  ShieldAlert,
  
  Laptop,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { GenerateLicenseModal } from "@/components/modals/licenses/GenerateLicenseModal";
import { UpdateLicenseStatusModal } from "@/components/modals/licenses/UpdateLicenseStatusModal";
import { useLicenses, type License, type LicenseStatus } from "@/api/licenses";
import { cn } from "@/lib/cn.util";

export default function LicensesPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const statusFilter =
    selectedTab === "all" ? undefined : (selectedTab.toUpperCase() as LicenseStatus);

  const { data: licensesRes } = useLicenses({
    status: statusFilter,
    search: search || undefined,
  });

  const licenses = licensesRes?.data || [];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("License key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = (status: LicenseStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge variant="destructive" className="font-semibold gap-1">
            <span className="size-1.5 rounded-full bg-white" />
            Blocked
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="secondary" className="font-semibold text-muted-foreground gap-1">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredLicenses = licenses.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.licenseKey.toLowerCase().includes(q) ||
      item.user?.email.toLowerCase().includes(q) ||
      item.package?.name.toLowerCase().includes(q)
    );
  });

  const columns: ColumnDef<License>[] = [
    {
      accessorKey: "licenseKey",
      header: "License Token",
      cell: ({ row }) => {
        const key = row.original.licenseKey;
        const isCopied = copiedKey === key;
        return (
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Key className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/licenses/${row.original.id}`}
                  className="font-mono text-xs font-semibold hover:text-primary transition-colors hover:underline tracking-tight"
                >
                  {key}
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleCopyKey(key)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Copy token"
                >
                  {isCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                </Button>
              </div>
              <span className="text-[11px] text-muted-foreground truncate">
                Created {new Date(row.original.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "user.email",
      header: "Client Account",
      cell: ({ row }) => {
        const u = row.original.user;
        if (!u) return <span className="text-muted-foreground italic text-xs">Unassigned</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-6 text-[10px]">
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {u.name?.slice(0, 2).toUpperCase() || u.email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">
                {u.name || "Client User"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">{u.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "package.name",
      header: "Plan Tier",
      cell: ({ row }) => {
        const pkg = row.original.package;
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              {pkg?.name || "Standard Cluster"}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              ${pkg?.price ?? 0}/mo
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "devices",
      header: "Node Concurrency",
      cell: ({ row }) => {
        const activeNodes = row.original._count?.devices ?? (row.original.devices?.filter((d) => d.status === "ACTIVE").length ?? 0);
        const maxNodes = row.original.deviceLimit || row.original.package?.maxDevices || 1;
        const isNearCap = activeNodes >= maxNodes;

        return (
          <div className="flex items-center gap-2">
            <Laptop className={cn("size-3.5", isNearCap ? "text-amber-500" : "text-primary")} />
            <span className={cn("font-mono text-xs font-medium", isNearCap && "text-amber-500 font-bold")}>
              {activeNodes} / {maxNodes} Nodes
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "State",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "expiresAt",
      header: "Validity",
      cell: ({ row }) => {
        const exp = row.original.expiresAt;
        return (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {exp ? new Date(exp).toLocaleDateString() : "Lifetime Horizon"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const lic = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/licenses/${lic.id}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-xs" }),
                "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              title="View Dossier"
            >
              <Eye className="size-3.5" />
              <span className="sr-only">View Dossier</span>
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Override Status"
              onClick={() => {
                setSelectedLicense(lic);
                setStatusModalOpen(true);
              }}
              className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
            >
              <ShieldAlert className="size-3.5" />
              <span className="sr-only">Override Status</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Copy License Key"
              onClick={() => handleCopyKey(lic.licenseKey)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {copiedKey === lic.licenseKey ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span className="sr-only">Copy Key</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            License Key Governance
          </h1>
          <p className="text-sm text-muted-foreground">
            Issue cryptographically secure tokens, enforce device concurrency caps, and inspect lifecycle audits
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

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Licenses", count: licenses.length },
            { id: "active", label: "Active" },
            { id: "blocked", label: "Blocked" },
            { id: "expired", label: "Expired" },
          ]}
          value={selectedTab}
          onChange={(tab) => setSelectedTab(tab)}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search key or client email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      {/* Main TanStack Data Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredLicenses}
          emptyMessage="No license keys match the selected criteria."
        />
      </div>

      {/* Modals */}
      <GenerateLicenseModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
      />

      <UpdateLicenseStatusModal
        license={selectedLicense}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
      />
    </div>
  );
}


