import {
  LayoutGrid,
  Key,
  Laptop,
  Activity,
  Users,
  Layers,
  CreditCard,
  ShieldAlert,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavIcon =
  | "layoutGrid"
  | "key"
  | "laptop"
  | "activity"
  | "users"
  | "layers"
  | "creditCard"
  | "shieldAlert"
  | "settings";

export const icons: Record<NavIcon, LucideIcon> = {
  layoutGrid: LayoutGrid,
  key: Key,
  laptop: Laptop,
  activity: Activity,
  users: Users,
  layers: Layers,
  creditCard: CreditCard,
  shieldAlert: ShieldAlert,
  settings: Settings,
};

export type NavItem = {
  title: string;
  subtitle: string;
  href?: string;
  icon?: NavIcon;
  children?: NavItem[];
  disabled?: boolean;
};

export const SHOW_UI_SHOWCASE = false;

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    subtitle: "System overview, active crawlers, and platform metrics",
    href: "/dashboard",
    icon: "layoutGrid",
  },
  {
    title: "License Keys",
    subtitle: "Issue, monitor, and regulate crawler license keys",
    href: "/licenses",
    icon: "key",
  },
  {
    title: "Active Devices",
    subtitle: "Hardware fingerprints, MAC bindings, and node sessions",
    href: "/devices",
    icon: "laptop",
    disabled: true,
  },
  {
    title: "Crawl Audits",
    subtitle: "Live execution feed, target URLs, and quota consumption",
    href: "/crawl-audits",
    icon: "activity",
    disabled: true,
  },
  {
    title: "User Management",
    subtitle: "Accounts, permissions, and multi-tenant organizations",
    href: "/users",
    icon: "users",
  },
  {
    title: "Crawler Packages",
    subtitle: "Tier parameters, device limits, and rate pricing",
    href: "/packages",
    icon: "layers",
  },
  {
    title: "Subscriptions",
    subtitle: "Client tier allocations and expiration horizons",
    href: "/subscriptions",
    icon: "creditCard",
  },
  {
    title: "System Audit Logs",
    subtitle: "Immutable record of administrative actions and overrides",
    href: "/audit-logs",
    icon: "shieldAlert",
    disabled: true,
  },
  {
    title: "Platform Settings",
    subtitle: "Security parameters, system API keys, and credentials",
    href: "/settings",
    icon: "settings",
  },
];

function normalizePathname(pathname: string) {
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
}

/**
 * Returns the most specific navigable leaf item for a pathname.
 * Prefix matching allows detail routes such as `/licenses/123`
 * to inherit the header of their parent navigation route.
 */
export function findNavItemByPathname(
  pathname: string,
  items: NavItem[] = navigation,
): NavItem | undefined {
  const currentPath = normalizePathname(pathname);
  let bestMatch: NavItem | undefined;

  function visit(navItems: NavItem[]) {
    for (const item of navItems) {
      if (item.disabled) continue;

      const isLeafRoute = Boolean(item.href) && !item.children?.length;

      if (isLeafRoute && item.href) {
        const href = normalizePathname(item.href);
        const matches =
          currentPath === href || currentPath.startsWith(`${href}/`);

        if (
          matches &&
          (!bestMatch?.href || href.length > bestMatch.href.length)
        ) {
          bestMatch = item;
        }
      }

      if (item.children?.length) {
        visit(item.children);
      }
    }
  }

  visit(items);

  return bestMatch;
}
