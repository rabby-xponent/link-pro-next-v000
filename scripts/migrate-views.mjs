import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "..", "LinkProAiStudio2", "src", "components");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function transformView(content) {
  let result = content;

  if (!result.startsWith('"use client"')) {
    result = '"use client";\n\n' + result;
  }

  result = result.replace(/export default function (\w+)/g, "export function $1");
  result = result.replace(/from "\.\.\/types"/g, 'from "@/types/index"');
  result = result.replace(/from '\.\.\/types'/g, "from '@/types/index'");
  result = result.replace(/from "\.\/LinkProfileEmptyView"/g, 'from "./link-profile-empty-view"');
  result = result.replace(/from "\.\/CompetitorDashboardView"/g, 'from "./competitor-dashboard-view"');
  result = result.replace(/fetch\("http:\/\/localhost:\d+([^"]*)"\)/g, 'fetch("$1")');

  return result;
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function copyAndTransform(srcName, destPath) {
  const src = path.join(SRC, srcName);
  const content = transformView(fs.readFileSync(src, "utf8"));
  writeFile(destPath, content);
  return destPath;
}

// --- Standalone view copies ---
const standalone = [
  ["BlueprintView.tsx", "components/app/link-pro/blueprint/blueprint-view.tsx"],
  ["LinkProfileEmptyView.tsx", "components/app/link-pro/blueprint/link-profile-empty-view.tsx"],
  ["ProjectsView.tsx", "components/app/link-pro/projects/projects-view.tsx"],
  ["CreateProjectWizardView.tsx", "components/app/link-pro/create-project-wizard/create-project-wizard-view.tsx"],
  ["LinkInventoryView.tsx", "components/app/link-pro/inventory/link-inventory-view.tsx"],
  ["LinkMonitoringView.tsx", "components/app/link-monitor-pro/link-monitoring-view.tsx"],
  ["AnalyticsView.tsx", "components/app/analytics/analytics-view.tsx"],
  ["ClientsView.tsx", "components/app/link-pro/prospects/clients-view.tsx"],
  ["AuditView.tsx", "components/app/audit/audit-view.tsx"],
  ["CompetitorDashboardView.tsx", "components/app/link-pro/competitors/competitor-dashboard-view.tsx"],
  ["ProspectListView.tsx", "components/app/link-pro/outreach-pipeline/prospect-list-view.tsx"],
];

const created = [];

for (const [src, dest] of standalone) {
  const full = path.join(ROOT, dest);
  copyAndTransform(src, full);
  created.push(dest);
}

// --- ProspectingOutreachViews split ---
const povPath = path.join(SRC, "ProspectingOutreachViews.tsx");
const povContent = fs.readFileSync(povPath, "utf8");
const povLines = povContent.split("\n");

const sharedHeader = povLines.slice(44, 157).join("\n"); // interfaces + getProjectsList + LocalToast

const lucideImport = `import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
`;

const sharedPath = "components/app/link-pro/shared/prospect-shared.tsx";
writeFile(
  path.join(ROOT, sharedPath),
  `"use client";

import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

${sharedHeader
  .replace(/^interface ViewToastProps/m, "export interface ViewToastProps")
  .replace(/^const getProjectsList/m, "export const getProjectsList")
  .replace(/^const LocalToast/m, "export const LocalToast")}
`
);
created.push(sharedPath);

const povSections = [
  {
    name: "competitors-view.tsx",
    dest: "components/app/link-pro/competitors/competitors-view.tsx",
    start: 162,
    end: 165,
    extraImports: 'import { CompetitorDashboardView } from "./competitor-dashboard-view";\n',
    useShared: false,
  },
  {
    name: "keyword-prospecting-view.tsx",
    dest: "components/app/link-pro/keyword-prospecting/keyword-prospecting-view.tsx",
    start: 170,
    end: 1289,
    useShared: true,
  },
  {
    name: "vetted-sites-view.tsx",
    dest: "components/app/link-pro/site-finder/vetted-sites-view.tsx",
    start: 1294,
    end: 2639,
    useShared: true,
  },
  {
    name: "competitor-opportunities-view.tsx",
    dest: "components/app/link-pro/competitor-opportunities/competitor-opportunities-view.tsx",
    start: 2640,
    end: 4700,
    useShared: true,
  },
  {
    name: "my-list-view.tsx",
    dest: "components/app/link-pro/my-list/my-list-view.tsx",
    start: 4701,
    end: 5505,
    useShared: true,
  },
  {
    name: "campaigns-view.tsx",
    dest: "components/app/link-pro/campaigns/campaigns-view.tsx",
    start: 6514,
    end: 6631,
    useShared: true,
  },
  {
    name: "create-campaign-view.tsx",
    dest: "components/app/link-pro/campaigns/create-campaign-view.tsx",
    start: 6636,
    end: 6754,
    useShared: true,
  },
  {
    name: "pitch-templates-view.tsx",
    dest: "components/app/link-pro/pitch-templates/pitch-templates-view.tsx",
    start: 6755,
    end: 6881,
    useShared: true,
  },
  {
    name: "email-accounts-view.tsx",
    dest: "components/app/link-pro/email-accounts/email-accounts-view.tsx",
    start: 6886,
    end: 6966,
    useShared: true,
  },
];

for (const section of povSections) {
  const body = povLines.slice(section.start, section.end).join("\n");
  let file = '"use client";\n\n';
  file += section.extraImports || "";
  if (section.useShared) {
    file += lucideImport;
    file += `import { LocalToast, getProjectsList } from "@/components/app/link-pro/shared/prospect-shared";\n\n`;
    // Remove duplicate LocalToast/getProjectsList from body if present (they're in shared now)
    file += body
      .replace(/\bLocalToast\b/g, "LocalToast")
      .replace(/\bgetProjectsList\b/g, "getProjectsList");
  } else {
    file += body + "\n";
  }
  writeFile(path.join(ROOT, section.dest), file);
  created.push(section.dest);
}

// Fix link-profile-empty-view default export name
const lpePath = path.join(ROOT, "components/app/link-pro/blueprint/link-profile-empty-view.tsx");
let lpe = fs.readFileSync(lpePath, "utf8");
lpe = lpe.replace(/export function LinkProfileEmptyView/g, "export function LinkProfileEmptyView");
writeFile(lpePath, lpe);

// --- Route client + page generation ---
const TAB_TO_HREF = {
  "command-center": "/app/command-center",
  projects: "/app/link-pro",
  "create-project-wizard": "/app/link-pro/projects/new",
  blueprint: "/app/link-pro/projects",
  competitors: "/app/link-pro/competitors",
  "keyword-prospecting": "/app/link-pro/keyword-prospecting",
  "vetted-sites": "/app/link-pro/site-finder",
  "competitor-opportunities": "/app/link-pro/competitor-opportunities",
  "my-list": "/app/link-pro/my-list",
  "prospect-list": "/app/link-pro/outreach-pipeline",
  clients: "/app/link-pro/prospects",
  campaigns: "/app/link-pro/campaigns",
  "create-campaign": "/app/link-pro/campaigns/new",
  "pitch-templates": "/app/link-pro/pitch-templates",
  "email-accounts": "/app/link-pro/email-accounts",
  inventory: "/app/link-pro/inventory",
  monitoring: "/app/link-monitor-pro",
  analytics: "/app/analytics",
  auditor: "/app/audit",
};

const routes = [
  {
    route: "app/(dashboard)/app/(modules)/link-pro/projects",
    clientName: "BlueprintClient",
    viewImport: '@/components/app/link-pro/blueprint/blueprint-view',
    viewName: "BlueprintView",
    clientBody: `  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <BlueprintView
      isSidebarCollapsedGlobal={isSidebarCollapsed}
      onToggleSidebarGlobal={setIsSidebarCollapsed}
    />
  );`,
    extraImports: ['import { useState } from "react";'],
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro",
    clientName: "ProjectsClient",
    viewImport: '@/components/app/link-pro/projects/projects-view',
    viewName: "ProjectsView",
    clientBody: `  const router = useRouter();
  return <ProjectsView onRequestCreate={() => router.push("/app/link-pro/projects/new")} />;`,
    extraImports: ['import { useRouter } from "next/navigation";'],
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/projects/new",
    clientName: "CreateProjectWizardClient",
    viewImport: '@/components/app/link-pro/create-project-wizard/create-project-wizard-view',
    viewName: "CreateProjectWizardView",
    clientBody: `  const router = useRouter();
  return (
    <CreateProjectWizardView
      onComplete={() => router.push("/app/link-pro")}
      onCancel={() => router.push("/app/link-pro")}
    />
  );`,
    extraImports: ['import { useRouter } from "next/navigation";'],
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/inventory",
    clientName: "LinkInventoryClient",
    viewImport: '@/components/app/link-pro/inventory/link-inventory-view',
    viewName: "LinkInventoryView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-monitor-pro",
    clientName: "LinkMonitoringClient",
    viewImport: '@/components/app/link-monitor-pro/link-monitoring-view',
    viewName: "LinkMonitoringView",
  },
  {
    route: "app/(dashboard)/app/(root)/analytics",
    clientName: "AnalyticsClient",
    viewImport: '@/components/app/analytics/analytics-view',
    viewName: "AnalyticsView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/prospects",
    clientName: "ClientsClient",
    viewImport: '@/components/app/link-pro/prospects/clients-view',
    viewName: "ClientsView",
  },
  {
    route: "app/(dashboard)/app/(root)/audit",
    clientName: "AuditClient",
    viewImport: '@/components/app/audit/audit-view',
    viewName: "AuditView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/competitors",
    clientName: "CompetitorsClient",
    viewImport: '@/components/app/link-pro/competitors/competitors-view',
    viewName: "CompetitorsView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/keyword-prospecting",
    clientName: "KeywordProspectingClient",
    viewImport: '@/components/app/link-pro/keyword-prospecting/keyword-prospecting-view',
    viewName: "KeywordProspectingView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/site-finder",
    clientName: "VettedSitesClient",
    viewImport: '@/components/app/link-pro/site-finder/vetted-sites-view',
    viewName: "VettedSitesView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/competitor-opportunities",
    clientName: "CompetitorOpportunitiesClient",
    viewImport: '@/components/app/link-pro/competitor-opportunities/competitor-opportunities-view',
    viewName: "CompetitorOpportunitiesView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/my-list",
    clientName: "MyListClient",
    viewImport: '@/components/app/link-pro/my-list/my-list-view',
    viewName: "MyListView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/outreach-pipeline",
    clientName: "ProspectListClient",
    viewImport: '@/components/app/link-pro/outreach-pipeline/prospect-list-view',
    viewName: "ProspectListView",
    clientBody: `  const router = useRouter();
  const tabToHref: Record<string, string> = ${JSON.stringify(TAB_TO_HREF, null, 2).replace(/"([^"]+)":/g, "$1:")};
  return (
    <ProspectListView
      onTabChange={(tab) => {
        const href = tabToHref[tab];
        if (href) router.push(href);
      }}
    />
  );`,
    extraImports: ['import { useRouter } from "next/navigation";'],
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/campaigns",
    clientName: "CampaignsClient",
    viewImport: '@/components/app/link-pro/campaigns/campaigns-view',
    viewName: "CampaignsView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/campaigns/new",
    clientName: "CreateCampaignClient",
    viewImport: '@/components/app/link-pro/campaigns/create-campaign-view',
    viewName: "CreateCampaignView",
    clientBody: `  const router = useRouter();
  return (
    <CreateCampaignView
      onComplete={() => router.push("/app/link-pro/campaigns")}
      onCancel={() => router.push("/app/link-pro/campaigns")}
    />
  );`,
    extraImports: ['import { useRouter } from "next/navigation";'],
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/pitch-templates",
    clientName: "PitchTemplatesClient",
    viewImport: '@/components/app/link-pro/pitch-templates/pitch-templates-view',
    viewName: "PitchTemplatesView",
  },
  {
    route: "app/(dashboard)/app/(modules)/link-pro/email-accounts",
    clientName: "EmailAccountsClient",
    viewImport: '@/components/app/link-pro/email-accounts/email-accounts-view',
    viewName: "EmailAccountsView",
  },
];

for (const r of routes) {
  const routeDir = path.join(ROOT, r.route);
  const pageName = r.clientName.replace(/Client$/, "Page");

  const extra = (r.extraImports || []).join("\n");
  const body =
    r.clientBody ||
    `  return <${r.viewName} />;`;

  const clientTsx = `"use client";

${extra ? extra + "\n" : ""}import { ${r.viewName} } from "${r.viewImport}";

export function ${r.clientName}() {
${body}
}
`;

  const pageTsx = `import { ${r.clientName} } from "./client";

export default function ${pageName}() {
  return <${r.clientName} />;
}
`;

  writeFile(path.join(routeDir, "client.tsx"), clientTsx);
  writeFile(path.join(routeDir, "page.tsx"), pageTsx);
  created.push(`${r.route}/client.tsx`, `${r.route}/page.tsx`);
}

console.log("Migration complete. Files created/updated:", created.length);
created.forEach((f) => console.log(" -", f));
