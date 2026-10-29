"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  KeyRound,
  Server,
  Save,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/AuthProvider";
import { env } from "@/config/env.config";

export default function SettingsPage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "Sky Crawler SP Admin");
  const [email, setEmail] = useState(user?.email || "admin@skycrawler.io");
  const [password, setPassword] = useState("");
  const [systemKey, setSystemKey] = useState(env.systemKey);
  const [copiedKey, setCopiedKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"IDLE" | "SUCCESS" | "FAILED">("IDLE");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        name,
        email,
      });
      toast.success("Administrator profile settings saved locally");
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus("IDLE");
    try {
      const res = await fetch(`${env.apiUrl}/packages`, {
        headers: { "x-system-key": systemKey },
      });
      if (res.ok || res.status === 401 || res.status === 200) {
        setConnectionStatus("SUCCESS");
        toast.success(`Connected to NestJS API: ${env.apiUrl}`);
      } else {
        setConnectionStatus("FAILED");
        toast.error(`API response status: ${res.status}`);
      }
    } catch {
      setConnectionStatus("FAILED");
      toast.error(`Could not reach ${env.apiUrl}. Make sure NestJS backend is running.`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCopySystemKey = () => {
    navigator.clipboard.writeText(systemKey);
    setCopiedKey(true);
    toast.success("System API key copied");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Platform Configuration & Credentials
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage SP Administrator credentials, automated machine tokens, and backend connection parameters
        </p>
      </div>

      {/* Main Grid Layout for Full Page Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left Column: Profile Settings */}
        <Card className="rounded-md border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <CardTitle className="text-base font-bold">
                SP Administrator Profile
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Update root administrative name and primary contact email
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSave}>
            <CardContent className="space-y-4 pb-18">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="Primary Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Input
                label="Update Password"
                type="password"
                placeholder="Leave blank to retain current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button type="submit" className="gap-2 rounded-sm">
                <Save className="size-4" />
                <span>Save Profile</span>
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Right Column Stack: Backend API & System Key */}
        <div className="space-y-6">
          {/* Backend Infrastructure Overview */}
          <Card className="rounded-md border-primary/20 bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="size-5 text-primary" />
                  <CardTitle className="text-base font-bold">
                    Backend API Environment
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={
                    connectionStatus === "SUCCESS"
                      ? "border-emerald-500 text-emerald-500"
                      : connectionStatus === "FAILED"
                        ? "border-rose-500 text-rose-500"
                        : "border-primary text-primary"
                  }
                >
                  Mode: {env.authMode.toUpperCase()}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Target NestJS API gateway URL and system service handshake
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-sm border bg-muted/40 p-3">
                <div>
                  <span className="text-muted-foreground block">Active Gateway Endpoint</span>
                  <code className="font-mono font-semibold text-foreground">{env.apiUrl}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="gap-2 shrink-0 rounded-sm"
                >
                  <RefreshCw className={`size-3.5 ${testingConnection ? "animate-spin" : ""}`} />
                  <span>{testingConnection ? "Pinging..." : "Test Connectivity"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System API Key (x-system-key) */}
          <Card className="rounded-md border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="size-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  System Service API Key (<code className="font-mono">x-system-key</code>)
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Cryptographic system header used for machine-to-machine worker daemons and automated generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-xs text-muted-foreground">
                Worker nodes and automated cron scripts authenticate with this key to execute crawl audits and batch license validations without human login sessions.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  value={systemKey}
                  onChange={(e) => setSystemKey(e.target.value)}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCopySystemKey}
                  className="shrink-0 gap-1.5 rounded-sm"
                >
                  {copiedKey ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  <span>{copiedKey ? "Copied" : "Copy Key"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}