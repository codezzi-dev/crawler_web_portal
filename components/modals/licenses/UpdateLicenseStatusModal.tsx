"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { Textarea } from "@/components/ui/custom-ui/CustomTextareaField";
import { useUpdateLicenseStatus, type LicenseStatus, type License } from "@/api/licenses";

interface UpdateLicenseStatusModalProps {
  license: License | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateLicenseStatusModal({
  license,
  open,
  onOpenChange,
  onSuccess,
}: UpdateLicenseStatusModalProps) {
  const [status, setStatus] = useState<LicenseStatus>("ACTIVE");
  const [reason, setReason] = useState("");
  const updateMutation = useUpdateLicenseStatus();

  useEffect(() => {
    if (license) {
      setStatus(license.status);
      setReason("");
    }
  }, [license]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!license) return;

    updateMutation.mutate(
      {
        id: license.id,
        payload: {
          status,
          reason: reason || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(`License status updated to ${status}`);
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
      title="Update License Status"
      subtitle={`Modify operational state for ${license?.licenseKey || "License"}`}
      icon={ShieldAlert}
      size="sm"
      onSubmit={handleSubmit}
      footerAlign={status === "BLOCKED" ? "danger" : "default"}
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
          variant={status === "BLOCKED" ? "destructive" : "default"}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Updating..." : "Confirm Status"}
        </Button>
      }
    >
      <Select
        label="New Operational Status"
        required
        options={[
          { label: "ACTIVE — Normal Crawler Execution", value: "ACTIVE" },
          { label: "BLOCKED — Reject Node Authorization", value: "BLOCKED" },
          { label: "EXPIRED — Horizon Reached", value: "EXPIRED" },
        ]}
        value={status}
        onChange={(e) => setStatus(e.target.value as LicenseStatus)}
      />

      <Textarea
        label="Audit Justification"
        placeholder="State administrative reason for status override..."
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </AppModal>
  );
}
