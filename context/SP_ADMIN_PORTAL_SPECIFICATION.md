# Sky Crawler SP Admin Portal — Frontend Architecture & Implementation Specification

> **Target Audience:** Next.js AI Coding Agent / Frontend Engineering Team  
> **Source Component Reference:** `D:\Next Js\SKY SMS APP\sky_sms_portal`  
> **Backend API Reference:** `d:\Nest JS\sky_crawler_web_api` (NestJS 11 + Prisma ORM + PostgreSQL)  
> **Role & Privileges:** Service Provider Administrator (`SP_ADMIN`) with full system-wide administrative control.

---

## 1. Executive Overview & System Objective

The **Sky Crawler SP Admin Portal** is an enterprise-grade administrative dashboard designed to manage, monitor, and provision all operational entities of the **Sky Crawler Web API** platform. 

The application must inherit the design system, micro-interactions, layout architecture, and reusable components of `sky_sms_portal` while introducing a dedicated **Electric Indigo / Obsidian Slate** theme palette (distinguishing it from the SMS portal's teal branding) with updated semantic tokens.

### Key Operational Missions for SP Admin:
1. **License Key Lifecycle Management:** Issue cryptographically secure licenses (`SKYC-XXXX-XXXX-XXXX-XXXX`), enforce device limits, set expiration horizons, block fraudulent licenses, and inspect audit logs.
2. **Hardware Device Binding & Enforcement:** Monitor registered crawler nodes (fingerprints, IP, MAC addresses), track real-time activity, and forcibly revoke compromised/orphaned devices.
3. **Crawl Job & Quota Observability:** Real-time stream of crawler execution audits (`license_crawl_audit`), tracking target URLs, client IPs, success/failure rates, and quota burn rates.
4. **Subscriber & User Governance:** Administer multi-tier users (`SP_ADMIN`, `ORG_ADMIN`, `USER`), suspend/activate accounts, and manage multi-tenant affiliations.
5. **Crawler Packages & Subscriptions:** Configure package tiers (concurrency limits, crawl request quotas, billing rates), assign subscriptions, and manage expirations.
6. **System Security & Audit Logging:** Immutable trail of SP Admin actions (`system_audit_logs`) and system API key (`x-system-key`) verification.

---

## 2. Technology Stack & Dependencies

Create the Next.js project using App Router with TypeScript and install the exact matching production-tested dependencies:

```json
{
  "name": "sky_crawler_sp_admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@base-ui/react": "^1.7.0",
    "@hookform/resolvers": "^5.9.1",
    "@tanstack/react-query": "^5.102.8",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^13.1.1",
    "lucide-react": "^1.38.0",
    "motion": "^13.1.1",
    "next": "16.3.3",
    "next-themes": "^0.4.6",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-easy-crop": "^6.2.3",
    "react-hook-form": "^7.87.0",
    "recharts": "^3.10.1",
    "sonner": "^2.0.8",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.3",
    "postcss": "^8",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 3. Design System, Renamed Variables & Color Palette

The design remains identical to `sky_sms_portal` in layout, animation curves, glassmorphism, and component structure, but transitions to an **Electric Indigo & Cyber Slate** palette.

### 3.1 CSS Variables & Tailwind v4 Theme (`app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: "Open Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Open Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Theme Toggle */
  --color-theme-toggle-track-dark: var(--theme-toggle-track-dark);
  --color-theme-toggle-ring-dark: var(--theme-toggle-ring-dark);
  --color-theme-toggle-ring-light: var(--theme-toggle-ring-light);
  --color-theme-toggle-trail: var(--theme-toggle-trail);

  /* Sidebar Tokens */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Core UI Tokens */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-field: var(--field);
  --color-ring: var(--ring);

  /* Charts */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --radius-sm: calc(var(--radius) * 0.75);
  --radius-md: var(--radius);
  --radius-lg: var(--radius);
  --radius-xl: var(--radius);
}

:root {
  /* Electric Indigo / Soft Quartz (Light Mode) */
  --background: oklch(97.5% 0.008 260);
  --foreground: oklch(0.18 0.04 265);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.04 265);
  --field: oklch(1 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.04 265);

  /* Primary: Electric Indigo */
  --primary: oklch(52.5% 0.22 265);
  --primary-foreground: oklch(0.99 0.005 265);

  --secondary: oklch(0.96 0.015 260);
  --secondary-foreground: oklch(0.2 0.04 265);
  --muted: oklch(0.955 0.01 260);
  --muted-foreground: oklch(0.52 0.04 260);
  --accent: oklch(0.95 0.06 280);
  --accent-foreground: oklch(0.35 0.15 280);
  --destructive: oklch(0.62 0.21 25);
  
  --border: oklch(0 0 0 / 10%);
  --input: oklch(0 0 0 / 10%);
  --ring: oklch(0.65 0.18 265);

  /* Charts */
  --chart-1: oklch(0.58 0.22 265); /* Indigo */
  --chart-2: oklch(0.68 0.18 160); /* Emerald */
  --chart-3: oklch(0.72 0.18 75);  /* Amber */
  --chart-4: oklch(0.62 0.22 310); /* Magenta/Violet */
  --chart-5: oklch(0.62 0.21 25);  /* Rose */

  --radius: 0.375rem;

  /* Sidebar */
  --sidebar: oklch(0.18 0.035 265);
  --sidebar-foreground: oklch(0.88 0.015 260);
  --sidebar-primary: oklch(0.68 0.2 265);
  --sidebar-primary-foreground: oklch(0.14 0.03 265);
  --sidebar-accent: oklch(0.26 0.04 265);
  --sidebar-accent-foreground: oklch(0.95 0.05 265);
  --sidebar-border: oklch(0.24 0.03 265);
  --sidebar-ring: oklch(0.68 0.2 265);

  --theme-toggle-track-dark: #1e1b4b;
  --theme-toggle-ring-dark: #4f46e5;
  --theme-toggle-ring-light: #6366f1;
  --theme-toggle-trail: #e0e7ff;
}

.dark {
  /* Obsidian Indigo (Dark Mode) */
  --background: oklch(0.12 0.03 265);
  --foreground: oklch(0.98 0.005 260);
  --card: oklch(0.17 0.035 265);
  --card-foreground: oklch(0.98 0.005 260);
  --field: oklch(0.17 0.035 265);
  --popover: oklch(0.17 0.035 265);
  --popover-foreground: oklch(0.98 0.005 260);

  /* Vibrant Indigo / Violet */
  --primary: oklch(0.68 0.2 265);
  --primary-foreground: oklch(0.12 0.03 265);

  --secondary: oklch(0.24 0.03 265);
  --secondary-foreground: oklch(0.98 0.005 260);
  --muted: oklch(0.22 0.025 265);
  --muted-foreground: oklch(0.68 0.035 260);
  --accent: oklch(0.68 0.2 265 / 20%);
  --accent-foreground: oklch(0.98 0.005 260);
  --destructive: oklch(0.68 0.22 22);

  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.55 0.15 265);

  --chart-1: oklch(0.68 0.2 265);
  --chart-2: oklch(0.75 0.18 160);
  --chart-3: oklch(0.78 0.18 75);
  --chart-4: oklch(0.72 0.2 310);
  --chart-5: oklch(0.68 0.22 22);

  --sidebar: oklch(0.15 0.032 265);
  --sidebar-foreground: oklch(0.88 0.015 260);
  --sidebar-primary: oklch(0.68 0.2 265);
  --sidebar-primary-foreground: oklch(0.12 0.03 265);
  --sidebar-accent: oklch(0.22 0.035 265);
  --sidebar-accent-foreground: oklch(0.95 0.05 265);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.55 0.15 265);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
  h1, h2, h3, .font-heading {
    font-family: var(--font-heading);
  }

  .form-input-base,
  .form-textarea-base {
    @apply block w-full appearance-none bg-transparent tracking-wide outline-hidden transition-colors duration-200 ease-in-out placeholder:font-light focus:outline-hidden disabled:select-none;
  }

  .form-input,
  .form-textarea {
    @apply rounded-sm border border-transparent px-3 py-2 text-start text-gray-800 placeholder:font-light placeholder:text-gray-600 dark:text-white dark:placeholder:text-gray-400;
  }

  .form-textarea {
    @apply resize-none;
  }
}

/* Animations & Scrollbars */
@keyframes text-loader-wipe {
  100% {
    background-position: left;
  }
}

.text-loader {
  width: fit-content;
  font-weight: bold;
  font-family: var(--font-mono), monospace;
  font-size: 1.875rem;
  background: linear-gradient(
      135deg,
      transparent calc(50% - 0.5em),
      var(--primary) 0 calc(50% + 0.5em),
      transparent 0
    )
    right / 300% 100%;
  animation: text-loader-wipe 2s infinite;
}

.text-loader::before {
  content: var(--loader-text, "Loading...");
  color: transparent;
  padding: 0 5px;
  background: inherit;
  background-image: linear-gradient(
    135deg,
    var(--primary) calc(50% - 0.5em),
    var(--background) 0 calc(50% + 0.5em),
    var(--primary) 0
  );
  -webkit-background-clip: text;
  background-clip: text;
}

::selection {
  background-color: var(--primary);
  color: white;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: var(--background);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
  opacity: 0.8;
}
```

### 3.2 Renamed Glassmorphism Utility Tokens (`lib/glass.util.ts`)

Rename `GLASS_TEAL_*` from `sky_sms_portal` to semantic theme tokens:

```typescript
// FILE: lib/glass.util.ts

/** Primary glass surface for cards and floating containers */
export const GLASS_SURFACE = "border-primary/25 bg-primary/10 backdrop-blur-md";

/** Glass style for form inputs, triggers, and search bars */
export const GLASS_FIELD = `${GLASS_SURFACE} text-foreground hover:border-primary/40`;

/** Glass style for DataTable header cells */
export const GLASS_HEADER = "bg-primary/20 text-primary backdrop-blur-md border-primary/25";
```

---

## 4. Reusable Components & File Inventory to Transfer

Transfer and adapt the following components directly from `D:\Next Js\SKY SMS APP\sky_sms_portal`:

### 4.1 Base UI Primitives (`components/ui/`)
| Source File | Destination File | Notes & Key Features |
|---|---|---|
| `components/ui/button.tsx` | `components/ui/button.tsx` | Built on `@base-ui/react/button` + CVA. Supports `label`, `error`, `required`, variants (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`), sizes (`xs`, `sm`, `default`, `lg`, `icon`). |
| `components/ui/table.tsx` | `components/ui/table.tsx` | Native styled table primitives: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. |
| `components/ui/dialog.tsx` | `components/ui/dialog.tsx` | Built on `@base-ui/react/dialog`. Backdrop blur, animated entrance/exit, portal. |
| `components/ui/dropdown-menu.tsx` | `components/ui/dropdown-menu.tsx` | Dropdown menu primitives with groups, labels, shortcuts, separators, submenus. |
| `components/ui/badge.tsx` | `components/ui/badge.tsx` | Status badges using `@base-ui/react/merge-props` & CVA. |
| `components/ui/card.tsx` | `components/ui/card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| `components/ui/switch.tsx` | `components/ui/switch.tsx` | Toggle switch with smooth animation. |
| `components/ui/checkbox.tsx` | `components/ui/checkbox.tsx` | Accessible checkbox primitive. |
| `components/ui/avatar.tsx` | `components/ui/avatar.tsx` | User profile avatar & fallbacks. |
| `components/ui/separator.tsx` | `components/ui/separator.tsx` | Horizontal / vertical line dividers. |
| `components/ui/skeleton.tsx` | `components/ui/skeleton.tsx` | Loading placeholders. |
| `components/ui/sonner.tsx` | `components/ui/sonner.tsx` | Modern toast notifications using `sonner`. |
| `components/ui/text-loader.tsx` | `components/ui/text-loader.tsx` | Shimmer animated wipe loader. |

### 4.2 Custom Form Fields & Advanced UI (`components/ui/custom-ui/`)
| Source File | Destination File | Notes & Key Features |
|---|---|---|
| `components/ui/custom-ui/DataTable.tsx` | `components/ui/custom-ui/DataTable.tsx` | TanStack Table v8 wrapper. Features: interactive column sorting, drag-to-resize columns, double-click auto-fit width, animated entrance, empty states. Update import from `GLASS_TEAL_HEADER` to `GLASS_HEADER`. |
| `components/ui/custom-ui/DataTableColumnHeader.tsx` | `components/ui/custom-ui/DataTableColumnHeader.tsx` | Sort triggers with direction arrows (asc/desc). |
| `components/ui/custom-ui/CustomInputField.tsx` | `components/ui/custom-ui/CustomInputField.tsx` | Polymorphic input with prefix/suffix icons, helper texts, validation errors, clear buttons. |
| `components/ui/custom-ui/CustomSelect.tsx` | `components/ui/custom-ui/CustomSelect.tsx` | Custom select dropdown with icons and validation. |
| `components/ui/custom-ui/CustomSearchableSelect.tsx` | `components/ui/custom-ui/CustomSearchableSelect.tsx` | Searchable combobox for selecting users and package tiers. |
| `components/ui/custom-ui/CustomToggleTabs.tsx` | `components/ui/custom-ui/CustomToggleTabs.tsx` | Segmented pill tabs, solid buttons, and glass filter tabs. |
| `components/ui/custom-ui/CustomTextareaField.tsx` | `components/ui/custom-ui/CustomTextareaField.tsx` | Styled multi-line input for notes and audit reasons. |

### 4.3 Modal Dialog System (`components/modals/`)
| Source File | Destination File | Notes & Key Features |
|---|---|---|
| `components/modals/generic/AppModal.tsx` | `components/modals/generic/AppModal.tsx` | Standard modal wrapper with sizes (`sm`, `md`, `lg`, `xl`, `full`), header with icon, primary & secondary action buttons. |
| `components/modals/generic/ConfirmModal.tsx` | `components/modals/generic/ConfirmModal.tsx` | Generic action confirmation modal. |
| `components/modals/generic/DeleteConfirmModal.tsx` | `components/modals/generic/DeleteConfirmModal.tsx` | Destructive red confirmation dialog with item name display and loading state. |
| `components/modals/generic/AlertModal.tsx` | `components/modals/generic/AlertModal.tsx` | Information/alert popups. |

### 4.4 Common Components & Animations (`components/common/`)
| Source File | Destination File | Notes & Key Features |
|---|---|---|
| `components/common/Motion.tsx` | `components/common/Motion.tsx` | Framer Motion wrappers: `FadeIn`, `Stagger`, `StaggerItem`. |
| `components/common/AnalyticsOverviewGrid.tsx` | `components/common/AnalyticsOverviewGrid.tsx` | Hero metric cards with Lucide icons, trend badges (TrendingUp/TrendingDown), and ambient glow. |
| `components/common/PageHeader.tsx` | `components/common/PageHeader.tsx` | Standard page title, description, and action button container. |
| `components/common/AuthGuard.tsx` | `components/common/AuthGuard.tsx` | Session protection. Configure to require `role === "SP_ADMIN"`. Non-SP admins are redirected or logged out. |

### 4.5 Charts (`components/charts/`)
| Source File | Destination File | Notes & Key Features |
|---|---|---|
| `components/charts/SplineAreaChart.tsx` | `components/charts/SplineAreaChart.tsx` | Recharts responsive dual-spline area chart for tracking crawl execution volume (Success vs Failed) over time. |
| `components/charts/DonutChart.tsx` | `components/charts/DonutChart.tsx` | Recharts interactive donut chart for displaying license status breakdowns (`ACTIVE`, `BLOCKED`, `EXPIRED`). |

### 4.6 Shell Layout & Navigation (`layout/`)
| Source File | Destination File | Notes & Key Features |
|---|---|---|
| `layout/AppShell.tsx` | `layout/AppShell.tsx` | Root portal container wrapping `Sidebar`, `TopBar`, and dynamic `RoutePageHeader`. |
| `layout/Sidebar.tsx` | `layout/Sidebar.tsx` | Collapsible navigation sidebar with animated hover states, active indicators, and sub-navigation. |
| `layout/SidebarContext.tsx` | `layout/SidebarContext.tsx` | Sidebar expanded/collapsed state management. |
| `layout/TopBar.tsx` | `layout/TopBar.tsx` | Global search, theme toggle, SP Admin status indicator, profile menu, and logout. |
| `layout/RoutePageHeader.tsx` | `layout/RoutePageHeader.tsx` | Automatically synchronizes page title and subtitle from the navigation config. |
| `layout/ThemeToggle.tsx` | `layout/ThemeToggle.tsx` | Smooth sun/moon theme switcher. |

### 4.7 Providers, Utilities & Hooks
| Source File | Destination File | Purpose |
|---|---|---|
| `providers/AuthProvider.tsx` | `providers/AuthProvider.tsx` | SP Admin auth state, token hydration, session persistence. |
| `providers/QueryProvider.tsx` | `providers/QueryProvider.tsx` | React Query client provider with sensible cache defaults. |
| `providers/ThemeProvider.tsx` | `providers/ThemeProvider.tsx` | `next-themes` dark/light provider. |
| `providers/MotionProvider.tsx` | `providers/MotionProvider.tsx` | Framer Motion context. |
| `lib/cn.util.ts` | `lib/cn.util.ts` | `clsx` + `tailwind-merge` utility. |
| `lib/motion.variants.ts` | `lib/motion.variants.ts` | Shared spring & ease animation definitions (`fadeUpSpring`, `staggerContainer`, `slideFromTop`, etc.). |
| `lib/authStorage.util.ts` | `lib/authStorage.util.ts` | LocalStorage getters/setters for JWT access tokens. |
| `hooks/inputErrorMsg.tsx` | `hooks/inputErrorMsg.tsx` | Form validation helper component. |
| `hooks/polymorphic.ts` | `hooks/polymorphic.ts` | TypeScript types for polymorphic React elements. |
| `hooks/useId.ts` | `hooks/useId.ts` | Accessible unique element ID generation. |

---

## 5. Backend API Reference & Data Contracts

The frontend interacts with the NestJS backend at `NEXT_PUBLIC_API_URL` (`http://localhost:3000/api/v1` or production URL).

### 5.1 Standard Response Envelope
All endpoints return JSON wrapped by `TransformInterceptor`:

```typescript
// Single Record Response
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Pagination Metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated Records Response
export interface PaginatedApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}
```

### 5.2 Complete Endpoint Catalogue

#### Authentication
- **`POST /auth/login`**
  - **Body:** `{ email: string, password: string }`
  - **Response:** `{ token: string, user: { id: string, name: string, email: string, role: string, status: string } }`
  - **Rule:** Deny access if `user.role !== 'SP_ADMIN'`.
- **`GET /auth/me`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** Current authenticated profile, licenses owned, and subscriptions.

#### Licenses Management (`/licenses`)
- **`GET /licenses`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Query:** `page`, `limit`, `status` (`ACTIVE` | `BLOCKED` | `EXPIRED`), `search`, `userId`, `packageId`
  - **Response:** `PaginatedApiResponse<License>`
- **`POST /licenses/generate`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:**
    ```typescript
    {
      userId: string;          // UUID of user
      packageId: string;       // UUID of package tier
      subscriptionId?: string; // Optional subscription UUID
      deviceLimit?: number;    // Defaults to package maxDevices (or 1)
      expiresAt?: string;      // ISO-8601 date (defaults to 1 year)
    }
    ```
  - **Response:** `{ licenseKey: "SKYC-XXXX-XXXX-XXXX-XXXX", ...LicenseDetails }`
- **`GET /licenses/:id`**
  - **Response:** Full license entity with relations (`user`, `package`, `subscription`, `devices[]`, `crawlAudits[]`, `statusHistories[]`).
- **`GET /licenses/:license/is-valid`**
  - **Param:** `license` (license key string)
  - **Response:** `{ isValid: boolean, status: string, expiresAt: string, deviceCount: number, deviceLimit: number, reason?: string }`
- **`PATCH /licenses/:id/status`**
  - **Body:** `{ status: "ACTIVE" | "BLOCKED" | "EXPIRED", reason?: string }`
  - **Response:** Updated license object and status history log.
- **`PATCH /licenses/devices/:deviceId/revoke`**
  - **Param:** `deviceId` (UUID)
  - **Response:** Updated device record with `status: "REVOKED"`.

#### Crawl Execution Audits
- **`POST /licenses/crawl-audit`**
  - Audit logging for client crawl jobs.

#### User Management (`/users`)
- **`GET /users`**
  - **Query:** `page`, `limit`, `role` (`SP_ADMIN` | `ORG_ADMIN` | `USER`), `status` (`ACTIVE` | `SUSPENDED`), `search`
  - **Response:** `PaginatedApiResponse<User>`
- **`POST /users`**
  - **Body:** `{ name: string, email: string, password: string, role: "SP_ADMIN" | "ORG_ADMIN" | "USER", status?: "ACTIVE" | "SUSPENDED" }`
  - **Response:** Created user record.
- **`GET /users/:id`**
  - **Response:** User details, owned licenses, and subscriptions.
- **`PATCH /users/:id`**
  - **Body:** `{ name?: string, email?: string, role?: string, status?: string, password?: string }`
- **`PATCH /users/:id/status`**
  - **Body:** `{ status: "ACTIVE" | "SUSPENDED", reason?: string }`
- **`DELETE /users/:id`**
  - **Response:** Deletion confirmation.

#### Package Tiers Management (`/packages`)
- **`GET /packages`**
  - **Query:** `page`, `limit`, `search`
  - **Response:** `PaginatedApiResponse<Package>` with `activeSubscribersCount`.
- **`POST /packages`**
  - **Body:** `{ name: string, maxDevices: number, maxCrawls: number, price: number }`
- **`GET /packages/:id`**
  - **Response:** Package tier with subscriber counts.
- **`PATCH /packages/:id`**
  - **Body:** `{ name?: string, maxDevices?: number, maxCrawls?: number, price?: number }`
- **`DELETE /packages/:id`**
  - **Response:** Deletion confirmation (rejects with 409 if active subscribers exist).

#### Subscriptions Management (`/subscriptions`)
- **`GET /subscriptions`**
  - **Query:** `page`, `limit`, `userId`, `packageId`, `status` (`ACTIVE` | `EXPIRED`)
  - **Response:** `PaginatedApiResponse<Subscription>`
- **`POST /subscriptions`**
  - **Body:** `{ userId: string, packageId: string, expiresAt?: string }`
- **`GET /subscriptions/:id`**
  - **Response:** Subscription details with linked licenses.
- **`PATCH /subscriptions/:id`**
  - **Body:** `{ packageId?: string, status?: "ACTIVE" | "EXPIRED", expiresAt?: string }`
- **`DELETE /subscriptions/:id`**
  - **Response:** Deletion confirmation.

---

## 6. Frontend Navigation & Route Hierarchy

Configure `config/navigation.config.ts` for the SP Admin Portal:

```typescript
// FILE: config/navigation.config.ts

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
};

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
  },
  {
    title: "Crawl Audits",
    subtitle: "Live execution feed, target URLs, and quota consumption",
    href: "/crawl-audits",
    icon: "activity",
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
  },
  {
    title: "Platform Settings",
    subtitle: "Security parameters, system API keys, and credentials",
    href: "/settings",
    icon: "settings",
  },
];
```

---

## 7. Page Views & Implementation Details

### 7.1 `/login` (SP Admin Authentication)
- **Visuals:** Dark Obsidian background with subtle animated ambient Indigo glow (`bg-accent/20 blur-3xl`).
- **Form:**
  - Email (`CustomInputField` with `Mail` icon).
  - Password (`CustomInputField` with `Lock` icon, masked input).
- **Validation:** Zod schema (`email().min(1)`, `password().min(6)`).
- **Guard:** On successful response from `POST /auth/login`, inspect `user.role`. If `role !== 'SP_ADMIN'`, display an error toast via `sonner` ("Access denied: Requires SP_ADMIN role") and clear the session.

### 7.2 `/dashboard` (Executive Command Center)
- **Top Row (`AnalyticsOverviewGrid`):**
  - **Total Active Licenses:** e.g., `1,280` (+12% this month).
  - **Active Crawler Devices:** e.g., `3,420` bound hardware nodes.
  - **Crawl Jobs Executed (24h):** e.g., `482,900` (+8.4%).
  - **Total Users / Subscribers:** e.g., `850` accounts.
- **Charts Section:**
  - **Left (2/3 width):** `SplineAreaChart` showing Crawl Throughput (Crawl Success vs. Failed) over the last 14 days.
  - **Right (1/3 width):** `DonutChart` showing License Status distribution (`ACTIVE`, `BLOCKED`, `EXPIRED`).
- **Quick Action Bar:**
  - Button to open "Generate License Modal".
  - Quick License Validity Tester input (type/paste license string, checks `GET /licenses/:license/is-valid` and displays instant badge).
- **Recent Audits Table:**
  - Mini `DataTable` of the latest 10 crawl audit events.

### 7.3 `/licenses` (License Key Management)
- **Header Action:** `+ Generate License Key` button triggering `GenerateLicenseModal`.
- **Filters Bar:**
  - `CustomToggleTabs` for quick filtering: `All`, `Active`, `Blocked`, `Expired`.
  - Search input for license key string (`SKYC-...`) or user email.
- **Data Table Columns:**
  1. `License Key`: Monospace badge with 1-click copy-to-clipboard button.
  2. `Assigned User`: User name & email with avatar.
  3. `Package Tier`: Package name badge (e.g. `Pro Enterprise`).
  4. `Device Limit`: Progress bar / ratio: `${boundDevices}/${deviceLimit}`.
  5. `Crawls Used`: Number formatting with comma separators.
  6. `Status`: Colored badge:
     - `ACTIVE`: Emerald green badge.
     - `BLOCKED`: Destructive red badge.
     - `EXPIRED`: Amber orange badge.
  7. `Expires At`: Formatted date or "Lifetime".
  8. `Actions`: Dropdown menu (`View Details`, `Change Status`, `Copy Key`).
- **Modals:**
  - **`GenerateLicenseModal` (`AppModal` size `md`):**
    - User selection (`CustomSearchableSelect`).
    - Package tier selection (`CustomSelect`).
    - Optional device limit override.
    - Expiration date picker.
    - On success: Show generated key in a highlighted copyable card.
  - **`UpdateLicenseStatusModal` (`AppModal` size `sm`):**
    - Radio/Select to choose new status (`ACTIVE`, `BLOCKED`, `EXPIRED`).
    - Audit reason textarea (`CustomTextareaField`).

### 7.4 `/licenses/[id]` (Detailed License Dossier)
- **Breadcrumbs:** `Licenses / SKYC-XXXX-XXXX-XXXX-XXXX`
- **Summary Header:** License key, status badge, created by, updated by.
- **Tabs (`CustomToggleTabs`):**
  - **Bound Devices Tab:** `DataTable` of registered hardware nodes (`deviceName`, `deviceFingerprint`, `ipAddress`, `macAddress`, `status`, `lastActiveAt`, and "Revoke Device" button invoking `DeleteConfirmModal`).
  - **Crawl Audit History Tab:** Chronological logs of URLs crawled under this license key.
  - **Status History Tab:** Audit trail of status changes (`oldStatus` -> `newStatus`, `changedBy`, `timestamp`).

### 7.5 `/devices` (Global Device Fleet Monitor)
- **Overview:** View and manage all crawler machines across all customers.
- **Columns:** Device Name, Fingerprint (truncated with copy), IP Address, MAC Address, Linked License Key, Status (`ACTIVE` / `REVOKED`), Last Active At.
- **Row Action:** `Revoke Device` (calls `PATCH /licenses/devices/:deviceId/revoke`).

### 7.6 `/crawl-audits` (Live Crawl Execution Feed)
- **Features:** Auto-refresh toggle (polls every 10s via React Query `refetchInterval`).
- **Columns:** Timestamp, Status (`SUCCESS` / `FAILED`), Target URL (clickable external link / preview), Client IP Address, Device Fingerprint, License Key.

### 7.7 `/users` (User Administration)
- **Header Action:** `+ Create User` button.
- **Columns:** Name, Email, Role badge (`SP_ADMIN`, `ORG_ADMIN`, `USER`), Status badge (`ACTIVE`, `SUSPENDED`), Licenses Count, Created Date, Actions (`Edit`, `Toggle Suspend`, `Delete`).
- **Modals:**
  - `CreateUserModal`: Name, Email, Password, Role selector, Status.
  - `EditUserModal`: Profile updates and role reassignments.
  - `SuspendUserModal`: Status change with required reason field.
  - `DeleteUserModal`: `DeleteConfirmModal` with user name confirmation.

### 7.8 `/packages` (Crawler Package Tiers)
- **Features:** Visual tier cards or `DataTable`.
- **Card/Table Fields:** Tier Name, Max Devices (`deviceLimit`), Max Monthly Crawls (`crawlQuota`), Price (`$XX.XX / mo`), Active Subscribers count.
- **Modals:**
  - `CreatePackageModal`: Form with inputs for `name`, `maxDevices`, `maxCrawls`, `price`.
  - `EditPackageModal`: Modifies existing parameters.
  - `DeletePackageModal`: Deletes package tier (warns if active subscribers exist).

### 7.9 `/subscriptions` (Subscription Allocations)
- **Features:** Assign subscriptions to users, extend expiry dates, cancel subscriptions.
- **Columns:** User, Package Tier, Status (`ACTIVE`, `EXPIRED`), Expiration Date, Created Date, Actions.

### 7.10 `/audit-logs` (System Audit Trail)
- **Overview:** Displays `system_audit_logs` table records.
- **Columns:** Timestamp, Admin User, Action (`GENERATE_LICENSE`, `BLOCK_LICENSE`, `SUSPEND_USER`, etc.), Target Type (`LICENSE`, `USER`, `DEVICE`), Target ID, Reason.

### 7.11 `/settings` (Platform & Profile Settings)
- **Profile:** Update SP Admin name, email, password.
- **System API Key:** Input to test / configure `x-system-key` authorization for automated worker processes.

---

## 8. Step-by-Step Agent Implementation Roadmap

When you move this file into the new Next.js project directory, instruct your coding agent to follow this sequence:

1. **Phase 1: Project Setup & Dependencies**
   - Initialize Next.js 16 (App Router) with TypeScript.
   - Install dependencies as specified in Section 2 (`@base-ui/react`, `@tanstack/react-query`, `@tanstack/react-table`, `framer-motion`, `recharts`, `lucide-react`, `sonner`, `zod`, `react-hook-form`).
2. **Phase 2: Design Tokens & Styling**
   - Replace `app/globals.css` with the complete CSS configuration in Section 3.1.
   - Create `lib/glass.util.ts` with the renamed tokens in Section 3.2.
   - Create `lib/cn.util.ts` and `lib/motion.variants.ts`.
3. **Phase 3: Base UI & Reusable Component Migration**
   - Copy and verify base UI components (`components/ui/*`).
   - Copy custom UI components (`components/ui/custom-ui/*`), ensuring imports use the new `GLASS_HEADER` and `GLASS_FIELD` constants.
   - Copy modal components (`components/modals/generic/*`).
   - Copy common components (`Motion.tsx`, `AnalyticsOverviewGrid.tsx`, `PageHeader.tsx`).
   - Copy chart components (`SplineAreaChart.tsx`, `DonutChart.tsx`).
4. **Phase 4: API & State Layer Setup**
   - Create `config/env.config.ts` reading `NEXT_PUBLIC_API_URL`.
   - Create `api/types/api-response.ts` with generic response envelopes.
   - Create `api/http.ts` (fetch wrapper with Bearer token injection and 401 redirect).
   - Create React Query hooks for each domain:
     - `api/auth/` (`auth.api.ts`, `auth.hook.ts`, `auth.type.ts`)
     - `api/licenses/` (`licenses.api.ts`, `licenses.hook.ts`, `licenses.type.ts`)
     - `api/users/` (`users.api.ts`, `users.hook.ts`, `users.type.ts`)
     - `api/packages/` (`packages.api.ts`, `packages.hook.ts`, `packages.type.ts`)
     - `api/subscriptions/` (`subscriptions.api.ts`, `subscriptions.hook.ts`, `subscriptions.type.ts`)
5. **Phase 5: Shell Layout & Navigation**
   - Create `config/navigation.config.ts` matching Section 6.
   - Create `layout/Sidebar.tsx`, `layout/TopBar.tsx`, `layout/AppShell.tsx`, `layout/ThemeToggle.tsx`, `layout/SidebarContext.tsx`.
   - Setup `providers/` (`AuthProvider`, `QueryProvider`, `ThemeProvider`, `MotionProvider`).
   - Configure `components/common/AuthGuard.tsx` to enforce `user?.role === 'SP_ADMIN'`.
6. **Phase 6: Route Implementation**
   - Build `app/(auth)/login/page.tsx`.
   - Build `app/(portal)/dashboard/page.tsx`.
   - Build `app/(portal)/licenses/page.tsx` and `app/(portal)/licenses/[id]/page.tsx`.
   - Build `app/(portal)/devices/page.tsx`.
   - Build `app/(portal)/crawl-audits/page.tsx`.
   - Build `app/(portal)/users/page.tsx`.
   - Build `app/(portal)/packages/page.tsx`.
   - Build `app/(portal)/subscriptions/page.tsx`.
   - Build `app/(portal)/audit-logs/page.tsx`.
   - Build `app/(portal)/settings/page.tsx`.
7. **Phase 7: Build & Verification**
   - Run `npm run build` to verify zero TypeScript errors and successful static/dynamic page generation.
