"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { env } from "@/config/env.config";
import {
  clearSession,
  getStoredUser,
  getToken,
  persistSession,
} from "@/lib/authStorage.util";
import { useMe, type AuthUser, type UserRole } from "@/api/auth";

export type Role = UserRole;
export type { AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(getToken());
    setUser(getStoredUser());
    setHydrated(true);
  }, []);

  const hasToken = Boolean(token);
  const meQuery = useMe(hydrated && hasToken);

  useEffect(() => {
    const meUser = meQuery.data;
    if (!meUser || !token) return;
    setUser(meUser);
    persistSession(token, meUser);
  }, [meQuery.data, token]);

  useEffect(() => {
    if (env.isMockAuth) return;
    if (!meQuery.isError || !hasToken) return;
    const status = (meQuery.error as { status?: number } | null)?.status;
    if (status !== 401) return;
    clearSession();
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [meQuery.isError, meQuery.error, hasToken, queryClient]);

  const login = useCallback((nextToken: string, nextUser: AuthUser) => {
    persistSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    queryClient.clear();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [queryClient]);

  const isLoading = !hydrated || (hasToken && meQuery.isLoading && !user);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
      setUser,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
