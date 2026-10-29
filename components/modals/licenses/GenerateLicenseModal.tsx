"use client";

import { useState } from "react";
import { Key, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { SearchableSelect } from "@/components/ui/custom-ui/CustomSearchableSelect";
import { useGenerateLicense } from "@/api/licenses";
import { useUsers } from "@/api/users";
import { usePackages } from "@/api/packages";

interface GenerateLicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GenerateLicenseModal({
  open,
  onOpenChange,
  onSuccess,
}: GenerateLicenseModalProps) {
  const [userId, setUserId] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [deviceLimit, setDeviceLimit] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: usersData } = useUsers({ limit: 100 });
  const { data: packagesData } = usePackages({ limit: 50 });
  const generateMutation = useGenerateLicense();

  const userOptions =
    usersData?.data?.map((u) => ({
      label: `${u.name || "Unnamed"} (${u.email})`,
      value: u.id,
    })) || [];

  const packageOptions =
    packagesData?.data?.map((p) => ({
      label: `${p.name} — Up to ${p.maxDevices} nodes ($${p.price}/mo)`,
      value: p.id,
    })) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please select a target client user");
      return;
    }
    if (!packageId) {
      toast.error("Please select a crawler package tier");
      return;
    }

    generateMutation.mutate(
      {
        userId,
        packageId,
        deviceLimit: deviceLimit ? parseInt(deviceLimit, 10) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      },
      {
        onSuccess: (res) => {
          const key = res.data?.licenseKey || "SKYC-GENERATED-KEY";
          setGeneratedKey(key);
          toast.success("Cryptographically secure license key issued!");
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to generate license");
        },
      },
    );
  };

  const handleCopy = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    toast.success("License key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setUserId("");
    setPackageId("");
    setDeviceLimit("");
    setExpiresAt("");
    setGeneratedKey(null);
    setCopied(false);
  };

  return (
    <AppModal
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
      title="Generate License Key"
      subtitle="Issue a new cryptographic license token with hardware device binding"
      icon={Key}
      size="md"
      onSubmit={generatedKey ? undefined : handleSubmit}
      secondaryActions={
        generatedKey ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => resetForm()}
          >
            Generate Another
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        )
      }
      primaryActions={
        generatedKey ? (
          <Button
            type="button"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Done
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? "Generating..." : "Generate Key"}
          </Button>
        )
      }
    >
      {generatedKey ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
            <Sparkles className="size-6" />
          </div>
          <h4 className="text-lg font-bold text-foreground">License Generated Successfully</h4>
          <p className="text-xs text-muted-foreground">
            Provide this key to the client for binding crawler daemon nodes.
          </p>

          <div className="mt-3 flex w-full items-center justify-between gap-2 rounded-md border border-primary/30 bg-card p-3 shadow-inner">
            <code className="font-mono text-sm font-semibold tracking-widest text-primary">
              {generatedKey}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 shrink-0"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <SearchableSelect
            label="Assigned Client User"
            required
            placeholder="Select user account..."
            options={userOptions}
            value={userId}
            onChange={(val) => setUserId(val)}
          />

          <Select
            label="Package Tier"
            required
            placeholder="Select crawler package tier..."
            options={packageOptions}
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <Input
              label="Device Limit Override"
              type="number"
              min={1}
              placeholder="e.g. 5 (Default: package limit)"
              value={deviceLimit}
              onChange={(e) => setDeviceLimit(e.target.value)}
            />

            <Input
              label="Expiration Date"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              description="Default: 1 year from today"
            />
          </div>
        </>
      )}
    </AppModal>
  );
}
