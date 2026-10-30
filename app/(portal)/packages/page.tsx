"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Laptop,
  Activity,
  Users,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreatePackageModal } from "@/components/modals/packages/CreatePackageModal";
import { EditPackageModal } from "@/components/modals/packages/EditPackageModal";
import { DeleteConfirmModal } from "@/components/modals/generic/DeleteConfirmModal";
import { usePackages, useDeletePackage, type PackageItem } from "@/api/packages";

export default function PackagesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  const { data: packagesRes, isLoading } = usePackages();
  const deleteMutation = useDeletePackage();

  const packages = packagesRes?.data || [];

  const handleDeleteConfirm = () => {
    if (!selectedPackage) return;
    deleteMutation.mutate(selectedPackage.id, {
      onSuccess: () => {
        toast.success(`Package tier ${selectedPackage.name} deleted`);
        setDeleteModalOpen(false);
        setSelectedPackage(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete package");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Crawler Package Tiers
          </h1>
          <p className="text-sm text-muted-foreground">
            Define concurrency quotas, maximum monthly crawl limits, and client subscription billing
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 shadow-sm font-semibold"
        >
          <Plus className="size-4" />
          <span>Create Package Tier</span>
        </Button>
      </div>

      {/* Package Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="flex flex-col justify-between border-primary/20 bg-card hover:border-primary/40 transition-colors shadow-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 font-mono text-[10px]">
                    TIER ID: {pkg.id.substring(0, 8)}...
                  </Badge>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {pkg.name}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-primary">
                    ${pkg.price}
                  </span>
                  <span className="text-xs text-muted-foreground block">/ month</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2.5 rounded-lg border bg-muted/40 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Laptop className="size-3.5 text-primary" />
                    <span>Device Limit:</span>
                  </span>
                  <span className="font-bold text-foreground font-mono">
                    {pkg.maxDevices} Nodes
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Activity className="size-3.5 text-primary" />
                    <span>Monthly Quota:</span>
                  </span>
                  <span className="font-bold text-foreground font-mono">
                    {(pkg.maxCrawls ?? 0).toLocaleString()} req
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="size-3.5 text-primary" />
                    <span>Active Subscribers:</span>
                  </span>
                  <span className="font-bold text-foreground font-mono">
                    {pkg.activeSubscribersCount ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2 border-t pt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedPackage(pkg);
                  setDeleteModalOpen(true);
                }}
                className="text-destructive hover:bg-destructive/10 text-xs"
              >
                <Trash2 className="size-3.5 mr-1" />
                <span>Delete</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPackage(pkg);
                  setEditModalOpen(true);
                }}
                className="gap-1.5 text-xs"
              >
                <Edit className="size-3.5" />
                <span>Configure</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <CreatePackageModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <EditPackageModal
        packageItem={selectedPackage}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        itemName={selectedPackage?.name}
        itemType="Package Tier"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
