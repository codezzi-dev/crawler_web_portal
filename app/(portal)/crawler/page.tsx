import { redirect } from "next/navigation";

export default function CrawlerRedirectPage() {
  redirect("/crawl-audits");
}
