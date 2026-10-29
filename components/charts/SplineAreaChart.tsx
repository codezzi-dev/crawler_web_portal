"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/cn.util";

export interface SplineAreaSeries {
  key: string;
  color: string;
  fill?: string;
}

export interface SplineAreaChartProps {
  data?: Array<Record<string, string | number>>;
  xKey: string;
  series?: SplineAreaSeries[];
  height?: number;
  className?: string;
  yDomain?: [number, number];
  yTicks?: number[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function SplineAreaChart({
  data,
  xKey,
  series,
  height = 260,
  className,
  yDomain,
  yTicks,
}: SplineAreaChartProps) {
  if (!data || data.length === 0 || !series || series.length === 0) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full rounded-sm p-1", className)}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.key}
                id={`spline-fill-${item.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={item.fill ?? item.color}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={item.fill ?? item.color}
                  stopOpacity={0.0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--border)"
            vertical
            horizontal
          />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={yDomain}
            ticks={yTicks}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            contentStyle={{
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          {series.map((item, index) => (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              fill={`url(#spline-fill-${item.key})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--card)",
                fill: item.color,
              }}
              isAnimationActive={true}
              animationBegin={150 * index + 100}
              animationDuration={1400}
              animationEasing="ease-out"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}