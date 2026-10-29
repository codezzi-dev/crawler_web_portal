"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn.util";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          "truncate text-xs font-medium uppercase tracking-wide text-primary",
          className,
        )}
      >
        {title}
      </div>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 gap-1 px-2 text-xs font-medium uppercase tracking-wide text-primary hover:bg-primary/15 hover:text-primary",
        className,
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      <span className="truncate">{title}</span>
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5 shrink-0" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5 shrink-0" />
      ) : (
        <ArrowUpDown className="size-3.5 shrink-0 opacity-50" />
      )}
    </Button>
  );
}
