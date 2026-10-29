"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { useCreatePackage } from "@/api/packages";

interface CreatePackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreatePackageModal({
  open,
  onOpenChange,
  onSuccess,
}: CreatePackageModalProps) {
  const [name, setName] = useState("");
  const [maxDevices, setMaxDevices] = useState("5");
  const [maxCrawls, setMaxCrawls] = useState("10000");
  const [price, setPrice] = useState("99.99");

  const createMutation = useCreatePackage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Package name is required");
      return;
    }

    createMutation.mutate(
      {
        name,
        maxDevices: parseInt(maxDevices, 10) || 1,
        maxCrawls: parseInt(maxCrawls, 10) || 1000,
        price: parseFloat(price) || 0,
      },
      {
        onSuccess: () => {
          toast.success("Crawler package tier created");
          onOpenChange(false);
          setName("");
          setMaxDevices("5");
          setMaxCrawls("10000");
          setPrice("99.99");
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create package");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Package Tier"
      subtitle="Define concurrency limits, crawl request quotas, and pricing"
      icon={Layers}
      size="sm"
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
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Save Package"}
        </Button>
      }
    >
      <Input
        label="Tier Name"
        required
        placeholder="e.g. Pro Crawler Cluster"
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
