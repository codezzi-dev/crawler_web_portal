"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/custom-ui/CustomTextareaField";
import { useUpdateUserStatus, type UserItem } from "@/api/users";

interface SuspendUserModalProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SuspendUserModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");
  const updateStatusMutation = useUpdateUserStatus();

  if (!user) return null;

  const isCurrentlyActive = user.status === "ACTIVE";
  const targetStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateStatusMutation.mutate(
      {
        id: user.id,
        payload: {
          status: targetStatus,
          reason: reason || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `User account ${targetStatus === "ACTIVE" ? "activated" : "suspended"} successfully`,
          );
          setReason("");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update status");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={`${isCurrentlyActive ? "Suspend" : "Activate"} User Account`}
      subtitle={`Account: ${user.name || user.email} (${user.email})`}
      icon={ShieldAlert}
      size="sm"
      onSubmit={handleSubmit}
      footerAlign={isCurrentlyActive ? "danger" : "default"}
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
        <Button
          type="submit"
          variant={isCurrentlyActive ? "destructive" : "default"}
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending
            ? "Updating..."
            : isCurrentlyActive
              ? "Suspend User"
              : "Activate User"}
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        {isCurrentlyActive
          ? "Suspending this user will immediately block all crawler authentication tokens and halt job submissions."
          : "Activating this user will restore their ability to log in and utilize assigned licenses."}
      </p>

      <Textarea
        label="Administrative Reason"
        required
        placeholder="State reason for audit tracking..."
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </AppModal>
  );
}
