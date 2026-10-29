"use client";

import type { LucideIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn.util";

export type AppModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClasses: Record<AppModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-4xl",
};

export interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  size?: AppModalSize;
  children?: React.ReactNode;
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  bodyClassName?: string;
  /** default: Cancel left / primary right. danger: confirm left / Cancel right. */
  footerAlign?: "default" | "danger";
  onSubmit?: (e: React.FormEvent) => void;
}

/**
 * Generic CMS modal shell.
 * Closes only via X or an explicit Cancel/secondary action that calls onOpenChange(false).
 * Backdrop click and Escape do not dismiss.
 * Footer default: secondary (Cancel) left, primary (Save) right.
 */
export function AppModal({
  open,
  onOpenChange,
  title,
  subtitle,
  icon: Icon,
  size = "md",
  children,
  primaryActions,
  secondaryActions,
  showCloseButton = true,
  className,
  bodyClassName,
  footerAlign = "default",
  onSubmit,
}: AppModalProps) {
  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails?: { reason?: string },
  ) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    const reason = eventDetails?.reason;
    if (
      reason === "escapeKey" ||
      reason === "outsidePress" ||
      reason === "focusOut"
    ) {
      return;
    }

    // closePress (X) or controlled close from Cancel buttons
    onOpenChange(false);
  };

  const close = () => onOpenChange(false);

  const ContentWrapper = onSubmit ? "form" : "div";

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      disablePointerDismissal
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[min(90vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md",
          sizeClasses[size],
          className,
        )}
      >
        <div className="flex items-start gap-3 border-b px-4 py-3 pr-12">
          {Icon ? (
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 space-y-1">
            <DialogTitle className="text-base font-semibold leading-none">
              {title}
            </DialogTitle>
            {subtitle ? (
              <DialogDescription className="text-sm text-muted-foreground">
                {subtitle}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">{title}</DialogDescription>
            )}
          </div>
          {showCloseButton ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-2.5 right-2.5"
              aria-label="Close"
              onClick={close}
            >
              <XIcon className="size-4" />
            </Button>
          ) : null}
        </div>

        <ContentWrapper
          {...(onSubmit ? { onSubmit } : {})}
          className="flex min-h-0 flex-1 flex-col"
        >
          {children != null ? (
            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4",
                bodyClassName,
              )}
            >
              {children}
            </div>
          ) : null}

          {primaryActions != null || secondaryActions != null ? (
            <div className="flex items-center justify-between gap-3 border-t bg-muted/40 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                {footerAlign === "danger" ? primaryActions : secondaryActions}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {footerAlign === "danger" ? secondaryActions : primaryActions}
              </div>
            </div>
          ) : null}
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
