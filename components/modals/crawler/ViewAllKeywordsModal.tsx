"use client";

import { FileText, Copy, Check, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppModal } from "@/components/modals/generic/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-ui/CustomInputField";

interface ViewAllKeywordsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keywords: string[];
  jobId?: string;
}

export function ViewAllKeywordsModal({
  open,
  onOpenChange,
  keywords,
  jobId,
}: ViewAllKeywordsModalProps) {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyAll = () => {
    if (keywords.length === 0) return;
    navigator.clipboard.writeText(keywords.join("\n"));
    setCopied(true);
    toast.success(`${keywords.length} keywords copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingle = (keyword: string, idx: number) => {
    navigator.clipboard.writeText(keyword);
    setCopiedIndex(idx);
    toast.success(`Copied: "${keyword}"`);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const filteredKeywords = search.trim()
    ? keywords.filter((k) => k.toLowerCase().includes(search.toLowerCase().trim()))
    : keywords;

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Crawl Keywords (${keywords.length})`}
      subtitle={
        jobId
          ? `Parsed from client desktop .txt file — Job #${jobId.substring(0, 8)}`
          : "Complete list of keywords executed in this crawl session"
      }
      icon={FileText}
      size="lg"
      secondaryActions={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
      primaryActions={
        <Button onClick={handleCopyAll} className="gap-2">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied All!" : "Copy All Keywords"}
        </Button>
      }
    >
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <p className="text-xs text-muted-foreground">
            Extracted sequentially from client text file and searched on Google Maps:
          </p>

          {keywords.length > 5 && (
            <div className="w-full sm:w-64">
              <Input
                icon={Search}
                placeholder="Search keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          )}
        </div>

        {filteredKeywords.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground border rounded-lg bg-muted/20">
            No keywords found matching &quot;{search}&quot;
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto p-3 rounded-lg border bg-muted/15">
            {filteredKeywords.map((keyword, index) => (
              <div
                key={index}
                onClick={() => handleCopySingle(keyword, index)}
                className="group inline-flex items-center gap-2 rounded-md border border-border/80 bg-card px-3 py-1.5 text-xs font-mono text-foreground shadow-2xs hover:border-primary/50 hover:bg-accent/40 transition-colors cursor-pointer"
                title="Click to copy this keyword"
              >
                <span className="text-muted-foreground font-sans text-[11px] font-semibold">
                  #{index + 1}
                </span>
                <span className="font-medium text-foreground select-all break-all">
                  {keyword}
                </span>
                <span className="text-muted-foreground/60 group-hover:text-primary transition-colors ml-1">
                  {copiedIndex === index ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppModal>
  );
}
