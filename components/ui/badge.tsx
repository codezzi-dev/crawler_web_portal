"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/cn.util";

const badgeVariants = cva(
  "group/badge relative inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm rounded-tl-none rounded-br-none border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/30 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/25 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline: "border-border text-foreground shadow-xs",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        shine: "bg-primary text-primary-foreground shadow-md shadow-primary/30 border-primary/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeMotionVariants: Variants = {
  initial: { opacity: 0, scale: 0.85, y: 4 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 22,
    },
  },
  hover: {
    scale: 1.00,
    y: -1,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
  tap: { scale: 0.96 },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  shimmer?: boolean;
}

function Badge({
  className,
  variant = "default",
  shimmer = true,
  children,
  ...props
}: BadgeProps) {
  return (
    <motion.span
      className={cn(badgeVariants({ variant }), className)}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={badgeMotionVariants}
      {...(props as HTMLMotionProps<"span">)}
    >
      {shimmer && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 dark:via-white/15 to-transparent pointer-events-none"
          animate={{
            translateX: ["-100%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            repeatDelay: 3.5,
            duration: 1.4,
            ease: "easeInOut",
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1">{children}</span>
    </motion.span>
  );
}

export { Badge, badgeVariants };
