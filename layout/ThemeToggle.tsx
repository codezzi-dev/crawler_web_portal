"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn.util";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative h-8 w-16 shrink-0 rounded-full p-1 transition-all duration-500 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:opacity-70",
        isDark
          ? "bg-theme-toggle-track-dark ring-1 ring-theme-toggle-ring-dark/20"
          : "bg-sky-50/40 ring-1 ring-theme-toggle-ring-light/20"
      )}
    >
      {/* Dynamic Motion Trail Aura (Follows the active side) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-1 flex items-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)]",
          isDark ? "translate-x-8" : "translate-x-0"
        )}
      >
        {/* Layer 3 (Farthest back) */}
        <span
          className={cn(
            "absolute size-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)]",
            isDark
              ? "-translate-x-4 bg-zinc-700/30 scale-90"
              : "translate-x-4 bg-theme-toggle-trail/30 scale-90"
          )}
        />
        {/* Layer 2 (Middle trail) */}
        <span
          className={cn(
            "absolute size-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)]",
            isDark
              ? "-translate-x-2 bg-zinc-600/50 scale-100"
              : "translate-x-2 bg-theme-toggle-trail/60 scale-95"
          )}
        />
      </div>

      {/* Main Knob using bg-primary */}
      <span
        className={cn(
          "relative z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md",
          "transition-transform duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)]",
          isDark ? "translate-x-8" : "translate-x-0"
        )}
      >
        <Moon
          className={cn(
            "absolute size-3.5 transition-all duration-300",
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          )}
          strokeWidth={2.4}
        />
        <Sun
          className={cn(
            "absolute size-3.5 text-amber-200 transition-all duration-300",
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          )}
          strokeWidth={2.4}
        />
      </span>
    </button>
  );
}