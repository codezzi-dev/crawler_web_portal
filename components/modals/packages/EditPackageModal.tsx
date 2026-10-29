"use client";

import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { useUpdatePackage, type PackageItem } from "@/api/packages";

interface EditPackageModalProps {
  packageItem: PackageItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditPackageModal({
  packageItem,
  open,
  onOpenChange,
  onSuccess,
}: EditPackageModalProps) {
  const [name, setName] = useState("");
  const [maxDevices, setMaxDevices] = useState("1");
  const [maxCrawls, setMaxCrawls] = useState("1000");
  const [price, setPrice] = useState("0");

  const updateMutation = useUpdatePackage();

  useEffect(() => {
    if (packageItem) {
      setName(packageItem.name || "");
      setMaxDevices(String(packageItem.maxDevices || 1));
      setMaxCrawls(String(packageItem.maxCrawls || 1000));
      setPrice(String(packageItem.price || 0));
    }
  }, [packageItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageItem) return;

    updateMutation.mutate(
      {
        id: packageItem.id,
        payload: {
          name,
          maxDevices: parseInt(maxDevices, 10) || 1,
          maxCrawls: parseInt(maxCrawls, 10) || 1000,
          price: parseFloat(price) || 0,
        },
      },
      {
        onSuccess: () => {
          toast.success("Package updated successfully");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update package");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Package Tier"
      subtitle={`Configure limits and parameters for ${packageItem?.name || "Tier"}`}
      icon={Layers}
      size="md"
      onSubmit={handleSubmit}
      secondaryActions={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      }
      primaryActions={
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <Input
        label="Tier Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <Input
          label="Max Concurrent Devices"
          type="number"
          min={1}
          required
          value={maxDevices}
          onChange={(e) => setMaxDevices(e.target.value)}
        />

        <Input
          label="Monthly Crawl Quota"
          type="number"
          min={100}
          required
          value={maxCrawls}
          onChange={(e) => setMaxCrawls(e.target.value)}
        />

        <Input
          label="Monthly Price ($)"
          type="number"
          step="0.01"
          min={0}
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
    </AppModal>
  );
}
