"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TextLoader } from "@/components/ui/text-loader";
import { useAuth } from "@/providers/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const isSpAdmin = user?.role === "SP_ADMIN";

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isSpAdmin) {
      logout();
    }
  }, [isSpAdmin, isAuthenticated, isLoading, logout, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <TextLoader text="Verifying session…" />
      </div>
    );
  }

  if (!isSpAdmin) {
    return null;
  }

  return <>{children}</>;
}
