"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { useUpdateSubscription, type SubscriptionItem, type SubscriptionStatus } from "@/api/subscriptions";
import { usePackages } from "@/api/packages";

interface EditSubscriptionModalProps {
  subscription: SubscriptionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditSubscriptionModal({
  subscription,
  open,
  onOpenChange,
  onSuccess,
}: EditSubscriptionModalProps) {
  const [packageId, setPackageId] = useState("");
  const [status, setStatus] = useState<SubscriptionStatus>("ACTIVE");
  const [expiresAt, setExpiresAt] = useState("");

  const { data: packagesData } = usePackages({ limit: 50 });
  const updateMutation = useUpdateSubscription();

  const packageOptions =
    packagesData?.data?.map((p) => ({
      label: `${p.name} ($${p.price}/mo)`,
      value: p.id,
    })) || [];

  useEffect(() => {
    if (subscription) {
      setPackageId(subscription.packageId || "");
      setStatus(subscription.status || "ACTIVE");
      setExpiresAt(
        subscription.expiresAt
          ? new Date(subscription.expiresAt).toISOString().split("T")[0]
          : "",
      );
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription) return;

    updateMutation.mutate(
      {
        id: subscription.id,
        payload: {
          packageId: packageId || undefined,
          status,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Subscription updated");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update subscription");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Subscription Allocation"
      subtitle={`User: ${subscription?.user?.name || subscription?.user?.email || "Subscriber"}`}
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
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <Select
        label="Package Tier"
        options={packageOptions}
        value={packageId}
        onChange={(e) => setPackageId(e.target.value)}
      />

      <Select
        label="Operational Status"
        options={[
          { label: "ACTIVE — Valid Access", value: "ACTIVE" },
          { label: "EXPIRED — Depleted / Terminated", value: "EXPIRED" },
        ]}
        value={status}
        onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
      />

      <Input
        label="Expiration Date"
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />
    </AppModal>
  );
}
