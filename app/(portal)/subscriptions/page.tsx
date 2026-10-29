"use client";

import { useState } from "react";
import {
  
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { CreateSubscriptionModal } from "@/components/modals/subscriptions/CreateSubscriptionModal";
import { EditSubscriptionModal } from "@/components/modals/subscriptions/EditSubscriptionModal";
import { DeleteConfirmModal } from "@/components/modals/generic/DeleteConfirmModal";
import {
  useSubscriptions,
  useDeleteSubscription,
  type SubscriptionItem,
  type SubscriptionStatus,
} from "@/api/subscriptions";

export default function SubscriptionsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionItem | null>(null);

  const statusFilter =
    selectedTab === "all" ? undefined : (selectedTab.toUpperCase() as SubscriptionStatus);

  const { data: subscriptionsRes } = useSubscriptions({
    status: statusFilter,
  });

  const deleteMutation = useDeleteSubscription();
  const subscriptions = subscriptionsRes?.data || [];

  const handleDeleteConfirm = () => {
    if (!selectedSubscription) return;
    deleteMutation.mutate(selectedSubscription.id, {
      onSuccess: () => {
        toast.success("Subscription cancelled");
        setDeleteModalOpen(false);
        setSelectedSubscription(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to cancel subscription");
      },
    });
  };

  const filteredSubscriptions = subscriptions.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.user?.email.toLowerCase().includes(q) ||
      item.user?.name?.toLowerCase().includes(q) ||
      item.package?.name.toLowerCase().includes(q)
    );
  });

  const columns: ColumnDef<SubscriptionItem>[] = [
    {
      accessorKey: "user.email",
      header: "Subscriber Account",
      cell: ({ row }) => {
        const u = row.original.user;
        if (!u) return <span className="text-muted-foreground italic text-xs">Unassigned</span>;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {u.name?.slice(0, 2).toUpperCase() || u.email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-foreground truncate">
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
      header: "Tier Allocation",
      cell: ({ row }) => {
        const pkg = row.original.package;
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              {pkg?.name || "Standard Cluster"}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              ${pkg?.price ?? 0}/mo • {pkg?.maxDevices ?? 1} Max Nodes
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        if (s === "ACTIVE") {
          return (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Active
            </Badge>
          );
        }
        return (
          <Badge variant="secondary" className="font-semibold text-muted-foreground gap-1">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            Expired
          </Badge>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Validity Horizon",
      cell: ({ row }) => {
        const exp = row.original.expiresAt;
        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3 text-muted-foreground" />
            <span>{exp ? new Date(exp).toLocaleDateString() : "Perpetual / Ongoing"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Allocated Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Modify Allocation"
              onClick={() => {
                setSelectedSubscription(sub);
                setEditModalOpen(true);
              }}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit className="size-3.5" />
              <span className="sr-only">Modify</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Cancel Subscription"
              onClick={() => {
                setSelectedSubscription(sub);
                setDeleteModalOpen(true);
              }}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Cancel</span>
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
            Subscription Allocations
          </h1>
          <p className="text-sm text-muted-foreground">
            Assign client tier allowances, extend billing validity horizons, and manage renewals
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 shadow-sm font-semibold"
        >
          <Plus className="size-4" />
          <span>Assign Subscription</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Subscriptions", count: subscriptions.length },
            { id: "active", label: "Active" },
            { id: "expired", label: "Expired" },
          ]}
          value={selectedTab}
          onChange={(tab) => setSelectedTab(tab)}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search subscriber or package..."
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
          data={filteredSubscriptions}
          emptyMessage="No subscription allocations match the filter."
        />
      </div>

      {/* Modals */}
      <CreateSubscriptionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <EditSubscriptionModal
        subscription={selectedSubscription}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        itemName={`Subscription for ${selectedSubscription?.user?.email || "User"}`}
        itemType="Subscription Allocation"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

