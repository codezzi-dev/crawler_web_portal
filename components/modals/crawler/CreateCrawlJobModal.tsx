"use client";

import { useState } from "react";
import { Search, Globe, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";
import { Textarea } from "@/components/ui/custom-ui/CustomTextareaField";
import { Select } from "@/components/ui/custom-ui/CustomSelect";
import { useCreateCrawlJob } from "@/api/crawler";
import { useLicenses } from "@/api/licenses";

interface CreateCrawlJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCrawlJobModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCrawlJobModalProps) {
  const [keywordsInput, setKeywordsInput] = useState("");
  const [location, setLocation] = useState("");
  const [licenseId, setLicenseId] = useState("");

  const createMutation = useCreateCrawlJob();
  const { data: licensesRes } = useLicenses({ status: "ACTIVE", limit: 50 });

  const activeLicenses = licensesRes?.data || [];
  const licenseOptions = activeLicenses.map((lic) => ({
    label: `${lic.licenseKey} (${lic.package?.name || "Standard"})`,
    value: lic.id,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse keywords by lines or commas
    const parsedKeywords = keywordsInput
      .split(/[\n,]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (parsedKeywords.length === 0) {
      toast.error("Please enter at least one target keyword to crawl");
      return;
    }

    createMutation.mutate(
      {
        keywords: parsedKeywords,
        location: location.trim() || undefined,
        license_id: licenseId || undefined,
        metadata: {
          clientSubmittedAt: new Date().toISOString(),
          requestedKeywordsCount: parsedKeywords.length,
        },
      },
      {
        onSuccess: (res) => {
          toast.success(
            `Crawl Job initialized with ${parsedKeywords.length} target keyword(s)!`,
          );
          setKeywordsInput("");
          setLocation("");
          setLicenseId("");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to initialize crawl job");
        },
      },
    );
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Submit Keyword Crawl Job"
      subtitle="Dispatch crawler workers to search and extract structured company data & Results"
      icon={Search}
      size="md"
      onSubmit={handleSubmit}
      secondaryActions={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      }
      primaryActions={
        <Button type="submit" disabled={createMutation.isPending} className="gap-2">
          <Sparkles className="size-4" />
          {createMutation.isPending ? "Submitting Job..." : "Start Crawling"}
        </Button>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            Target Keywords (One per line or comma-separated) *
          </label>
          <Textarea
            required
            rows={4}
            placeholder="e.g.
software companies in dhaka
ai startups in bangladesh
fintech companies in gulshan"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Workers search and scrape entities corresponding to each keyword sequentially.
          </p>
        </div>

        <Input
          label="Target Geographic Location (Optional)"
          icon={Globe}
          placeholder="e.g. Dhaka, Bangladesh"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {licenseOptions.length > 0 && (
          <Select
            label="Execute Under Active License (Optional)"
            placeholder="Automatic default user license quota"
            options={licenseOptions}
            value={licenseId}
            onChange={(e) => setLicenseId(e.target.value)}
          />
        )}
      </div>
    </AppModal>
  );
}
