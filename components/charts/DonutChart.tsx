"use client";

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/cn.util";

export interface DonutChartItem {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data?: DonutChartItem[];
  height?: number;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const chartVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, rotate: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 18,
    },
  },
};

const legendVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const centerTextVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.35,
      type: "spring",
      stiffness: 240,
      damping: 16,
    },
  },
};

export function DonutChart({
  data,
  height = 180,
  className,
  innerRadius = 52,
  outerRadius = 76,
}: DonutChartProps) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col gap-4 rounded-sm p-1",
        className
      )}
    >
      <div
        className="relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center"
        style={{ minHeight: height }}
      >
        <motion.div variants={chartVariants} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
                stroke="var(--card)"
                strokeWidth={2}
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Dynamic Center Total Counter */}
        <motion.div
          variants={centerTextVariants}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {total}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total
          </span>
        </motion.div>
      </div>

      {/* Animated Legend List */}
      <motion.ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((item) => {
          const percent = total === 0 ? 0 : Math.round((item.value / total) * 100);
          return (
            <motion.li
              key={item.name}
              variants={legendVariants}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              className="flex items-center gap-2 text-sm"
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-sm shadow-xs transition-transform duration-200"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {item.name}
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {percent}%
              </span>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}