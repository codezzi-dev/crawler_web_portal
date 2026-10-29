"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { SearchableSelect } from "@/components/ui/custom-ui/CustomSearchableSelect";
import { useCreateSubscription } from "@/api/subscriptions";
import { useUsers } from "@/api/users";
import { usePackages } from "@/api/packages";

interface CreateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateSubscriptionModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateSubscriptionModalProps) {
  const [userId, setUserId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const { data: usersData } = useUsers({ limit: 100 });
  const { data: packagesData } = usePackages({ limit: 50 });
  const createMutation = useCreateSubscription();

  const userOptions =
    usersData?.data?.map((u) => ({
      label: `${u.name || "Unnamed"} (${u.email})`,
      value: u.id,
    })) || [];

  const packageOptions =
    packagesData?.data?.map((p) => ({
      label: `${p.name} ($${p.price}/mo)`,
      value: p.id,
    })) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !packageId) {
      toast.error("User and Package are required");
      return;
    }

    createMutation.mutate(
      {
        userId,
        packageId,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Subscription assigned to user");
          onOpenChange(false);
          setUserId("");
          setPackageId("");
          setExpiresAt("");
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create subscription");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Subscription"
      subtitle="Provision crawler package allocation for client user"
      icon={CreditCard}
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
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Assigning..." : "Assign Subscription"}
        </Button>
      }
    >
      <SearchableSelect
        label="Target User"
        required
        placeholder="Select user account..."
        options={userOptions}
        value={userId}
        onChange={(val) => setUserId(val)}
      />

      <Select
        label="Package Tier"
        required
        placeholder="Select package tier..."
        options={packageOptions}
        value={packageId}
        onChange={(e) => setPackageId(e.target.value)}
      />

      <Input
        label="Horizon Expiration Date"
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        description="Default: 1 year subscription validity"
      />
    </AppModal>
  );
}
