"use client";

import { motion } from "framer-motion";
import { Bell, LogOut, Search, User, ShieldCheck, Settings } from "lucide-react";
import Link from "next/link";
import { slideFromTop } from "@/lib/motion.variants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { ThemeToggle } from "@/layout/ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";

export function TopBar() {
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.email || "SP Admin";

  return (
    <motion.header
      variants={slideFromTop}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur-md"
    >
      <div className="hidden min-w-0 flex-1 sm:block sm:max-w-md">
        <Input
          icon={Search}
          placeholder="Search licenses, nodes, target URLs..."
          aria-label="Global search"
          containerClassName="w-full space-y-0"
          className="h-9 rounded-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:flex">
          <ShieldCheck className="size-3.5" />
          <span>SP ADMIN</span>
        </div>

        <ThemeToggle />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="size-4" />
          <span
            aria-hidden
            className="absolute top-1 right-1 size-1.5 rounded-full bg-primary ring-2 ring-background"
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="gap-2 px-1.5" />}
          >
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
              {displayName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user?.name || "SP Administrator"}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <Link href="/settings" className="flex w-full items-center gap-2" />
                }
              >
                <Settings className="size-4" />
                <span>Platform Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
