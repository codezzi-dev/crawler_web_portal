"use client";

import { motion } from "framer-motion";
import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/layout/SidebarContext";
import { Button } from "@/components/ui/button";
import {
  navigation,
  icons,
  
  type NavItem,
} from "@/config/navigation.config";
import { fadeUpSpring, slideFromLeft, staggerContainer } from "@/lib/motion.variants";
import { cn } from "@/lib/cn.util";
import { useAuth } from "@/providers/AuthProvider";

function pathMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.href && pathMatches(pathname, item.href)) {
    return true;
  }
  return (
    item.children?.some((child) => isItemActive(pathname, child)) ?? false
  );
}

function SidebarNavItem({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const active = isItemActive(pathname, item);
  const IconComponent = item.icon ? icons[item.icon] : Globe;

  return (
    <Link
      href={item.href || "#"}
      title={collapsed ? item.title : undefined}
      className={cn(
        "group relative flex items-center rounded-sm text-sm font-medium transition-all duration-200 outline-none",
        collapsed
          ? "justify-center p-2.5"
          : "gap-3 px-3 py-2.5",
        active
          ? "bg-sidebar-primary/15 text-sidebar-primary font-semibold shadow-xs"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-md bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)]"
        />
      ) : null}

      <IconComponent
        className={cn(
          "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
          active ? "text-sidebar-primary" : "text-sidebar-foreground/70",
        )}
      />

      {!collapsed ? (
        <span className="truncate">{item.title}</span>
      ) : null}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const { logout } = useAuth();

  return (
    <motion.aside
      variants={slideFromLeft}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out select-none",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center outline-none",
            collapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg rounded-tl-none rounded-br-none p-1 shadow-sm">
            <Image
              src="/assets/logo/logo.png"
              alt="Sky Crawler Logo"
              width={36}
              height={36}
              className="size-full object-contain"
              priority
            />
          </div>
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white">
                CRAWLER
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-sidebar-primary uppercase">
                SP ADMIN PORTAL
              </span>
            </div>
          ) : null}
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      {/* Navigation Links */}
      <motion.nav
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-2"
      >
        {navigation
          .filter((item) => !item.disabled)
          .map((item) => (
            <motion.div key={item.title} variants={fadeUpSpring}>
              <SidebarNavItem
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            </motion.div>
          ))}
      </motion.nav>

      {/* Bottom Actions / Logout */}
      <div className="mt-auto border-t border-sidebar-border p-2">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground/80 hover:bg-destructive/15 hover:text-destructive",
            collapsed ? "justify-center px-0" : "justify-start gap-2.5",
          )}
          onClick={logout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed ? <span>Log out</span> : null}
        </Button>
      </div>
    </motion.aside>
  );
}

