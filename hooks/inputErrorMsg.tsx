import type { ReactNode } from "react";
import { cn } from "@/lib/cn.util";

type InputErrorMsgProps = {
  when: boolean;
  className?: string;
  id?: string;
  children?: ReactNode;
};

export function InputErrorMsg({
  when,
  className,
  id,
  children,
}: InputErrorMsgProps) {
  if (!when) return null;

  return (
    <span
      id={id}
      role="alert"
      className={cn("block text-xs font-medium text-destructive", className)}
    >
      {children}
    </span>
  );
}
