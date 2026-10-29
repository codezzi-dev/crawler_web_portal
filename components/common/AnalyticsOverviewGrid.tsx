"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { fadeUpSpring, staggerContainer } from "@/lib/motion.variants";
import { cn } from "@/lib/cn.util";

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  timeframe?: string;
  icon: string;
}

export interface StatsGridProps {
  stats?: StatItem[];
  gridClassName?: string;
}

export default function StatsGrid({ stats, gridClassName }: StatsGridProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden rounded-md bg-linear-to-br from-primary via-primary/95 to-primary/80 p-6 border border-white/10">
      {/* Background Subtle Amber Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-accent/30 blur-3xl"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
          gridClassName,
        )}
      >
        {stats.map((stat) => {
          const IconComponent =
            (LucideIcons[stat.icon as keyof typeof LucideIcons] as React.ElementType) ||
            HelpCircle;

          return (
            <motion.div
              key={stat.id}
              variants={fadeUpSpring}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/15"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/80">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-md bg-white/15 p-2.5 text-white shadow-xs backdrop-blur-xs transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              {stat.change ? (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                  {stat.isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-300" />
                  )}
                  <span
                    className={
                      stat.isPositive
                        ? "font-semibold text-white"
                        : "font-semibold text-rose-300"
                    }
                  >
                    {stat.change}
                  </span>
                  {stat.timeframe ? (
                    <span className="text-white/70">{stat.timeframe}</span>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}