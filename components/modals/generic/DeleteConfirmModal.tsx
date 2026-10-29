"use client";

import { Trash2 } from "lucide-react";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";

export interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  itemName?: string;
  itemType?: string;
  onConfirm: () => void;
  isPending?: boolean;
  loading?: boolean;
  confirmLabel?: string;
  confirmText?: string;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  title = "Delete item?",
  subtitle,
  itemName,
  itemType,
  onConfirm,
  isPending = false,
  loading = false,
  confirmLabel = "Delete",
  confirmText,
}: DeleteConfirmModalProps) {
  const pending = loading || isPending;
  const label = confirmText || confirmLabel;

  const description =
    subtitle ??
    (itemName
      ? `${itemType ? `${itemType} ` : ""}“${itemName}” will be permanently removed. This cannot be undone.`
      : "This action cannot be undone.");

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      subtitle={description}
      icon={Trash2}
      size="sm"
      footerAlign="danger"
      primaryActions={
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "Processing…" : label}
        </Button>
      }
      secondaryActions={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={pending}
        >
          Cancel
        </Button>
      }
    />
  );
}
