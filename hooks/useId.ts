import { useId as useReactId } from "react";

export function useId(id?: string, prefix = "id"): string {
  const generated = useReactId();
  return id || `${prefix}-${generated}`;
}
