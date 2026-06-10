import {
  ActivitySquare,
  BarChart,
  BookMarked,
  ClipboardList,
  FolderPlus,
  FolderSync,
  Landmark,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ToolsMenuItem {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  badge?: string;
}

export const TOOLS_MENU_ITEMS: ToolsMenuItem[] = [
  {
    id: "command-center",
    label: "SEO Command Center",
    desc: "Executive suite at a glance",
    icon: Sparkles,
    badge: "New Dashboard",
  },
  {
    id: "create-project-wizard",
    label: "Create Project Wizard",
    desc: "Strategic landscape setup",
    icon: FolderPlus,
    badge: "Interactive Flow",
  },
  {
    id: "blueprint",
    label: "Master Blueprint",
    desc: "Strategy formulation & planning",
    icon: Landmark,
  },
  {
    id: "projects",
    label: "Projects Hub",
    desc: "Manage organic properties directory",
    icon: FolderSync,
  },
  {
    id: "inventory",
    label: "Link Inventory",
    desc: "Prospect profiles database ledger",
    icon: ClipboardList,
  },
  {
    id: "monitoring",
    label: "Link Monitoring",
    desc: "Real-time verification crawler",
    icon: ActivitySquare,
  },
  {
    id: "analytics",
    label: "Analytics Dashboard",
    desc: "Deep rank & authority reports",
    icon: BarChart,
  },
  {
    id: "clients",
    label: "Clients Directory",
    desc: "Stakeholder tags & account details",
    icon: Users,
  },
  {
    id: "auditor",
    label: "Blueprint Auditor",
    desc: "Validation & compliance ruleset",
    icon: BookMarked,
  },
];
