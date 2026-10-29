"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion"; // or "motion/react" if that's what your project uses
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/common/Motion";
import { fadeUpEase } from "@/lib/motion.variants";
import { cn } from "@/lib/cn.util";

export type ToggleTab = {
  id: string;
  label: string;
  /** Optional badge shown after the label, e.g. a result count. */
  count?: number;
  icon?: LucideIcon;
};

export type ToggleTabsVariant = "segmented" | "solid" | "glass";
export type ToggleTabsSize = "sm" | "default";

type ToggleTabsProps = {
  tabs: ToggleTab[];
  value: string;
  onChange: (id: string) => void;
  /**
   * `segmented` (default) — pill sliding inside a muted track. Section switcher.
   * `solid` — sliding filled pill beside outlined siblings. Filter / list scope.
   * `glass` — frosted track; sliding pill uses primary fill.
   */
  variant?: ToggleTabsVariant;
  size?: ToggleTabsSize;
  /** Required for screen readers when the group has no visible label. */
  ariaLabel?: string;
  className?: string;
};

const sizeClasses: Record<ToggleTabsSize, string> = {
  sm: "h-8 px-3 text-sm",
  default: "px-4 py-2 text-sm",
};

/**
 * Mutually-exclusive option selector.
 *
 * Rendered as toggle buttons with `aria-pressed` rather than `role="tablist"`:
 * these switch a data scope in place, they do not swap tab panels, and
 * announcing them as tabs would promise keyboard behaviour (arrow-key roving
 * focus) that this component does not implement.
 *
 * The active background is a single shared indicator (`layoutId`) that slides
 * between buttons. Each instance gets its own id so several ToggleTabs on one
 * page never animate into each other.
 */
export function ToggleTabs({
  tabs,
  value,
  onChange,
  variant = "segmented",
  size = "default",
  ariaLabel,
  className,
}: ToggleTabsProps) {
  const indicatorId = useId();
  const prefersReducedMotion = useReducedMotion();

  return (
    <FadeIn
      variants={fadeUpEase}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex",
        variant === "segmented" &&
          "rounded-md border border-border bg-muted/40 p-1",
        variant === "solid" && "gap-2",
        variant === "glass" &&
          "rounded-md border border-border bg-muted/70 p-1 dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-md",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors",
              "outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
              sizeClasses[size],

              variant === "segmented" &&
                (isActive
                  ? "text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"),

              // Always has a border so layout doesn't shift; it's hidden when active.
              variant === "solid" &&
                (isActive
                  ? "border border-transparent text-primary-foreground font-semibold"
                  : "border border-border bg-background text-foreground hover:bg-muted"),

              variant === "glass" &&
                (isActive
                  ? "text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"),
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={indicatorId}
                aria-hidden="true"
                className={cn(
                  "absolute rounded-md rounded-tl-none rounded-br-none bg-primary",
                  variant === "solid" ? "-inset-px" : "inset-0",
                  variant === "segmented" && "shadow-xs",
                )}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 38 }
                }
              />
            ) : null}

            {/* Content sits above the sliding indicator */}
            <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
              {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={cn(
                    "rounded-sm px-1.5 py-0.5 text-xs tabular-nums font-semibold transition-colors",
                    isActive
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </FadeIn>
  );
}

export { ToggleTabs as CustomToggleTabs };
export default ToggleTabs;