"use client";

import { useState } from "react";
import {
  
  Plus,
  Search,
  Edit,
  ShieldAlert,
  Trash2,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { CustomToggleTabs } from "@/components/ui/custom-ui/CustomToggleTabs";
import { DataTable, type ColumnDef } from "@/components/ui/custom-ui/DataTable";
import { CreateUserModal } from "@/components/modals/users/CreateUserModal";
import { EditUserModal } from "@/components/modals/users/EditUserModal";
import { SuspendUserModal } from "@/components/modals/users/SuspendUserModal";
import { DeleteConfirmModal } from "@/components/modals/generic/DeleteConfirmModal";
import { useUsers, useDeleteUser, type UserItem, type UserRole, type UserStatus } from "@/api/users";

export default function UsersPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const roleFilter =
    selectedTab === "all" ? undefined : (selectedTab.toUpperCase() as UserRole);

  const { data: usersRes } = useUsers({
    role: roleFilter,
    search: search || undefined,
  });

  const deleteMutation = useDeleteUser();
  const users = usersRes?.data || [];

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success(`User ${selectedUser.name || selectedUser.email} deleted`);
        setDeleteModalOpen(false);
        setSelectedUser(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete user");
      },
    });
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "SP_ADMIN":
        return (
          <Badge className="bg-primary/15 text-primary border-primary/20 font-bold">
            SP Admin
          </Badge>
        );
      case "ORG_ADMIN":
        return (
          <Badge variant="outline" className="border-sky-500/30 text-sky-500 font-semibold">
            Org Admin
          </Badge>
        );
      case "USER":
        return (
          <Badge variant="secondary" className="font-medium">
            Client
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    if (status === "ACTIVE") {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="font-semibold gap-1">
        <span className="size-1.5 rounded-full bg-white" />
        Suspended
      </Badge>
    );
  };

  const columns: ColumnDef<UserItem>[] = [
    {
      accessorKey: "name",
      header: "User Profile",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {u.name?.slice(0, 2).toUpperCase() || u.email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-foreground truncate">
                {u.name || "Unnamed Account"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">{u.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Authorization Role",
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      accessorKey: "status",
      header: "Account State",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "licenses",
      header: "Assigned Licenses",
      cell: ({ row }) => {
        const count = row.original._count?.licensesOwned ?? (row.original.licensesOwned?.length || 0);
        return (
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Key className="size-3 text-muted-foreground" />
            <span className={count > 0 ? "font-bold text-foreground" : "text-muted-foreground"}>
              {count} {count === 1 ? "Token" : "Tokens"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
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
        const u = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Edit Profile"
              onClick={() => {
                setSelectedUser(u);
                setEditModalOpen(true);
              }}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit className="size-3.5" />
              <span className="sr-only">Edit</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title={u.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
              onClick={() => {
                setSelectedUser(u);
                setSuspendModalOpen(true);
              }}
              className={
                u.status === "ACTIVE"
                  ? "text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                  : "text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
              }
            >
              <ShieldAlert className="size-3.5" />
              <span className="sr-only">
                {u.status === "ACTIVE" ? "Suspend" : "Activate"}
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Delete Account"
              onClick={() => {
                setSelectedUser(u);
                setDeleteModalOpen(true);
              }}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete</span>
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
            User & Subscriber Governance
          </h1>
          <p className="text-sm text-muted-foreground">
            Administer multi-tenant accounts, role authorizations, and license assignments
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 shadow-sm font-semibold"
        >
          <Plus className="size-4" />
          <span>Create User</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomToggleTabs
          tabs={[
            { id: "all", label: "All Users", count: users.length },
            { id: "sp_admin", label: "SP Admin" },
            { id: "org_admin", label: "Org Admin" },
            { id: "user", label: "Clients" },
          ]}
          value={selectedTab}
          onChange={(tab) => setSelectedTab(tab)}
          variant="segmented"
        />

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search by name or email..."
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
          data={users}
          emptyMessage="No subscriber accounts match the selected filters."
        />
      </div>

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <EditUserModal
        user={selectedUser}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <SuspendUserModal
        user={selectedUser}
        open={suspendModalOpen}
        onOpenChange={setSuspendModalOpen}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        itemName={selectedUser?.name || selectedUser?.email}
        itemType="User Account"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}


