# link-pro-next

Next.js App Router port of [LinkProAiStudio2](../LinkProAiStudio2) — the Uprankly SEO operating system UI (projects, link profiles, prospecting, outreach, monitoring, analytics, and audit).

This is a **pixel-perfect migration**: view markup, Tailwind classes, mock data, and handlers are copied verbatim from the Vite SPA. Structural changes are limited to what Next.js requires (routing, `"use client"`, import aliases, and internal navigation).

**Source of truth for visuals:** run `LinkProAiStudio2` (`npm run dev`) and compare side-by-side with this app.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 (`app/globals.css` — verbatim copy of `LinkProAiStudio2/src/index.css`) |
| Icons | lucide-react |
| Fonts | Hanken Grotesk, Inter, Geist, Material Symbols Outlined via `<link>` tags in `app/layout.tsx` |

---

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
npm install
cp .env.example .env.local   # then set GEMINI_API_KEY (needed for Blueprint Auditor)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root page redirects into the dashboard; primary entry is `/app/command-center`.

### Scripts

```bash
npm run dev      # development server
npm run build    # production build (23 static routes)
npm run start    # serve production build
npm run lint     # ESLint
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For audit feature | Google Gemini API key used by Blueprint Auditor (`AuditView`) |

Copy `.env.example` to `.env.local` and fill in the key before using `/app/audit`.

---

## Routes

All dashboard pages live under `/app/…` and share the shell (sidebar, top bar, footer).

| Route | View |
|---|---|
| `/app/command-center` | SEO Command Center |
| `/app/link-pro` | All Projects Hub |
| `/app/link-pro/projects` | Link Profiles (Blueprint) |
| `/app/link-pro/projects/new` | Add Project Wizard |
| `/app/link-pro/inventory` | Acquired Links Ledger |
| `/app/link-pro/prospects` | All Prospects Directory |
| `/app/link-pro/competitors` | Competitor Share-of-Voice |
| `/app/link-pro/keyword-prospecting` | Keyword Prospecting Finder |
| `/app/link-pro/site-finder` | Vetted Editorial Sites Index |
| `/app/link-pro/competitor-opportunities` | Competitor Link Intersections |
| `/app/link-pro/my-list` | My Prospect Shortlists |
| `/app/link-pro/outreach-pipeline` | Prospect CRM Pipeline |
| `/app/link-pro/campaigns` | Outreach Campaigns Console |
| `/app/link-pro/campaigns/new` | Create Outreach Campaign |
| `/app/link-pro/pitch-templates` | Pitch Templates Composer |
| `/app/link-pro/email-accounts` | Outreach Senders Configuration |
| `/app/link-monitor-pro` | Link Monitoring & Crawler |
| `/app/analytics` | Analytics Dashboard |
| `/app/audit` | Blueprint Auditor |

Nav labels and hrefs are defined in `lib/config/nav-items.ts`.

---

## Project structure

```
link-pro-next/
├── app/
│   ├── layout.tsx                    # Root layout, font <link> tags, globals.css
│   ├── globals.css                   # Tailwind v4 + design tokens (from index.css)
│   ├── page.tsx                      # Root redirect
│   └── (dashboard)/app/
│       ├── layout.tsx                # Shell: Sidebar + TopBar + NoSsr + Footer
│       ├── (root)/                   # command-center, analytics, audit
│       └── (modules)/                # link-pro/*, link-monitor-pro
│           └── <route>/
│               ├── page.tsx          # Server component (thin)
│               └── client.tsx        # Client boundary (router wiring)
│
├── components/
│   ├── common/                       # Shell (sidebar, top-bar, footer, no-ssr)
│   └── app/                          # Ported views, 1:1 from LinkProAiStudio2
│       ├── command-center/
│       ├── link-pro/<feature>/       # *-view.tsx per feature
│       ├── link-monitor-pro/
│       ├── analytics/
│       └── audit/
│
├── lib/
│   ├── config/                       # nav-items.ts, tools-menu.ts
│   └── helpers/                      # get-page-title.ts
│
└── types/
    └── index.ts                      # Shared TS types (from LinkProAiStudio2)
```

### 3-layer route pattern

Every route follows:

1. **`page.tsx`** — server component, default export, renders the client boundary
2. **`client.tsx`** — `"use client"`, wires `useRouter()` for SPA-style callbacks (`onRequestCreate`, `onComplete`, `onTabChange`, etc.)
3. **`components/app/…/*-view.tsx`** — ported view logic, named export, `"use client"`

### Shell vs views

- **Shell** (`components/common/`): sidebar, top bar, tools menu, footer — adapted from `App.tsx` / `Sidebar.tsx` / `TopBar.tsx` with `usePathname()` / `<Link>` instead of tab state.
- **Views** (`components/app/`): copied from `LinkProAiStudio2/src/components/`. No shadcn/ui substitution; raw `<button>`, `<table>`, `<input>` preserved.

### Shared prospecting helpers

`components/app/link-pro/shared/prospect-shared.tsx` holds code extracted from the monolithic `ProspectingOutreachViews.tsx`:

- `getProjectsList()`, `LocalToast`
- Shared interfaces (`OutreachCampaign`, `PitchTemplate`, `ConnectedEmail`, etc.)

### Client-only rendering

Several views read `localStorage` during initial state setup. The dashboard layout wraps page content in `<NoSsr>` (`components/common/no-ssr.tsx`) so those views only mount in the browser — matching SPA behaviour without SSR crashes.

---

## Migration status

| Area | Status |
|---|---|
| Shell (sidebar, top bar, footer) | Done |
| All 19 view modules | Done |
| `npm run build` | Passing (23 static routes) |
| `app/api/audit-code/route.ts` | **Pending** — port of `LinkProAiStudio2/server.ts`; `AuditView` already calls `fetch("/api/audit-code")` |

Full migration notes and pixel-perfect rules: [`../MIGRATION_PLAN.md`](../MIGRATION_PLAN.md).

---

## Porting rules (summary)

When adding or editing a view, copy from `LinkProAiStudio2/src/components/` and change **only**:

1. Add `"use client"` as the first line
2. Fix imports to `@/` aliases
3. `<a href="/internal">` → `<Link href="…">` (external URLs stay `<a>`)
4. `fetch("http://localhost:PORT/…")` → `fetch("/…")`
5. Remove unused `React` import if TypeScript complains

Do not rewrite JSX, classNames, handlers, or mock data. Do not swap in design tokens or shadcn components.

---

## Related projects

| Path | Role |
|---|---|
| `../LinkProAiStudio2/` | Original Vite + React SPA (visual reference) |
| `../MIGRATION_PLAN.md` | Detailed migration plan and progress tracker |
| `../seoappsite/` | Reference only for Next.js folder conventions — no code copied |
