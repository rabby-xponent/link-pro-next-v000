"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowLeft,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
  Calendar,
  Zap,
  Check,
  ExternalLink,
  FileText,
  LayoutGrid,
  TrendingUp,
  Link2,
  TrendingDown,
  Info,
  Layers,
  Database,
  Anchor,
  Activity,
  UserCheck,
  Download,
  BarChart2,
  Share2,
  Flag,
  RotateCcw,
  HelpCircle,
  X,
  Server,
  Terminal,
  CheckCircle
} from "lucide-react";

import { LinkProfileEmptyView } from "./link-profile-empty-view";

// Mock collection of 35 backlinks that matches the exact structure shown in the template image
const BACKLINKS_DATA = [
  { id: 1, domain: "gitnup.com", url: "https://github.com/article-18", target: "https://uprankly.com/about", anchor: "link prospecting platform", dr: 96, type: "Dofollow", status: "Live", firstSeen: "2024-06-18" },
  { id: 2, domain: "stackoverflow.com", url: "https://stackoverflow.com/questions/best-seo-tools-2025", target: "https://uprankly.com/blog/seo-tools", anchor: "best SEO tools 2025", dr: 95, type: "Dofollow", status: "Live", firstSeen: "2024-05-17" },
  { id: 3, domain: "medium.com", url: "https://medium.com/article-7", target: "https://uprankly.com/", anchor: "outreach automation", dr: 94, type: "Dofollow", status: "Live", firstSeen: "2025-07-07" },
  { id: 4, domain: "techcrunch.com", url: "https://techcrunch.com/article-8", target: "https://uprankly.com/blog/link-pro", anchor: "Uprankly", dr: 93, type: "Dofollow", status: "Live", firstSeen: "2025-08-08" },
  { id: 5, domain: "wired.com", url: "https://wired.com/article-24", target: "https://uprankly.com/about", anchor: "competitor analysis", dr: 92, type: "Nofollow", status: "Live", firstSeen: "2024-12-24" },
  { id: 6, domain: "producthunt.com", url: "https://producthunt.com/article-9", target: "https://uprankly.com/features", anchor: "click here", dr: 91, type: "Dofollow", status: "Live", firstSeen: "2025-09-09" },
  { id: 7, domain: "theverge.com", url: "https://theverge.com/article-25", target: "https://uprankly.com/", anchor: "link building tool", dr: 91, type: "Nofollow", status: "Live", firstSeen: "2023-01-25" },
  { id: 8, domain: "arstechnica.com", url: "https://arstechnica.com/article-23", target: "https://uprankly.com/blog/seo", anchor: "domain rating checker", dr: 90, type: "Nofollow", status: "Live", firstSeen: "2024-11-23" },
  { id: 9, domain: "smashingmagazine.com", url: "https://smashingmagazine.com/backlink-checker-guide", target: "https://uprankly.com/pricing", anchor: "backlink checker", dr: 89, type: "Dofollow", status: "Live", firstSeen: "2025-04-04" },
  { id: 10, domain: "freecodecamp.org", url: "https://freecodecamp.org/article-11", target: "https://uprankly.com/blog/ranking", anchor: "domain rating checker", dr: 88, type: "Dofollow", status: "Live", firstSeen: "2025-11-11" },
  { id: 11, domain: "cloudflare.com", url: "https://cloudflare.com/article-27", target: "https://uprankly.com/features", anchor: "uprankly.com", dr: 88, type: "Nofollow", status: "Live", firstSeen: "2023-03-27" },
  { id: 12, domain: "digitalocean.com", url: "https://digitalocean.com/article-26", target: "https://uprankly.com/blog/digital", anchor: "SEO software", dr: 86, type: "Nofollow", status: "Live", firstSeen: "2023-02-26" },
  { id: 13, domain: "tutorialspoint.com", url: "https://tutorialspoint.com/article-15", target: "https://uprankly.com/features", anchor: "uprankly.com", dr: 85, type: "Dofollow", status: "Live", firstSeen: "2024-03-15" },
  { id: 14, domain: "heroku.com", url: "https://heroku.com/article-29", target: "https://uprankly.com/blog/hosting", anchor: "best SEO tools 2025", dr: 84, type: "UGC", status: "Live", firstSeen: "2023-05-01" },
  { id: 15, domain: "geeksforgeeks.org", url: "https://geeksforgeeks.org/article-list-2", target: "https://uprankly.com/pricing", anchor: "backlink checker", dr: 83, type: "Dofollow", status: "Live", firstSeen: "2024-04-16" },
  { id: 16, domain: "css-tricks.com", url: "https://css-tricks.com/article-5", target: "https://uprankly.com/blog/templates", anchor: "best SEO tools 2025", dr: 82, type: "Dofollow", status: "Live", firstSeen: "2025-05-05" },
  { id: 17, domain: "netlify.com", url: "https://netlify.com/article-28", target: "https://uprankly.com/features", anchor: "backlink checker", dr: 81, type: "Nofollow", status: "Live", firstSeen: "2023-04-28" },
  { id: 18, domain: "codepen.io", url: "https://codepen.io/article-13", target: "https://uprankly.com/", anchor: "link building tool", dr: 80, type: "Dofollow", status: "Live", firstSeen: "2024-01-13" },
  { id: 19, domain: "infoq.com", url: "https://infoq.com/article-22", target: "https://uprankly.com/", anchor: "read more", dr: 79, type: "Dofollow", status: "Live", firstSeen: "2024-10-22" },
  { id: 20, domain: "dev.to", url: "https://dev.to/article-6", target: "https://uprankly.com/about", anchor: "link prospecting platform", dr: 78, type: "Dofollow", status: "Live", firstSeen: "2025-06-06" },
  { id: 21, domain: "dzone.com", url: "https://dzone.com/article-21", target: "https://uprankly.com/", anchor: "click here", dr: 77, type: "Dofollow", status: "Live", firstSeen: "2024-09-21" },
  { id: 22, domain: "sitepoint.com", url: "https://sitepoint.com/article-10", target: "https://uprankly.com/", anchor: "read more", dr: 76, type: "Dofollow", status: "Live", firstSeen: "2025-10-10" },
  { id: 23, domain: "thenewstack.io", url: "https://thenewstack.io/article-1", target: "https://uprankly.com/", anchor: "link building tool", dr: 74, type: "Dofollow", status: "Live", firstSeen: "2025-01-01" },
  { id: 24, domain: "logrocket.com", url: "https://logrocket.com/article-34", target: "https://uprankly.com/", anchor: "read more", dr: 73, type: "Sponsored", status: "Broken", firstSeen: "2023-10-06" },
  { id: 25, domain: "hackernoon.com", url: "https://hackernoon.com/viral-app-backlink", target: "https://uprankly.com/", anchor: "uprankly.com", dr: 87, type: "Dofollow", status: "Live", firstSeen: "2025-02-14" },
  { id: 26, domain: "slashdot.org", url: "https://slashdot.org/story/new-seo-tools", target: "https://uprankly.com/about", anchor: "link building tool", dr: 86, type: "Dofollow", status: "Live", firstSeen: "2024-08-11" },
  { id: 27, domain: "reddit.com", url: "https://reddit.com/r/seo/comments/uprankly", target: "https://uprankly.com/", anchor: "uprankly.com", dr: 91, type: "UGC", status: "Live", firstSeen: "2025-02-28" },
  { id: 28, domain: "quora.com", url: "https://quora.com/What-is-the-best-linkpro-system", target: "https://uprankly.com/blog", anchor: "outreach automation", dr: 89, type: "UGC", status: "Live", firstSeen: "2024-06-25" },
  { id: 29, domain: "cssauthor.com", url: "https://cssauthor.com/best-link-builders", target: "https://uprankly.com/templates", anchor: "link prospecting platform", dr: 72, type: "Dofollow", status: "Live", firstSeen: "2025-04-18" },
  { id: 30, domain: "readwrite.com", url: "https://readwrite.com/tech-stack-options", target: "https://uprankly.com/", anchor: "SEO software", dr: 82, type: "Dofollow", status: "Live", firstSeen: "2024-03-31" },
  { id: 31, domain: "gizmodo.com", url: "https://gizmodo.com/the-future-of-internet-crawlers", target: "https://uprankly.com/about", anchor: "click here", dr: 90, type: "Nofollow", status: "Live", firstSeen: "2023-12-05" },
  { id: 32, domain: "indiehackers.com", url: "https://indiehackers.com/product/uprankly-launch", target: "https://uprankly.com/", anchor: "Uprankly", dr: 81, type: "UGC", status: "Live", firstSeen: "2024-07-19" },
  { id: 33, domain: "vimeo.com", url: "https://vimeo.com/uprankly-demo", target: "https://uprankly.com/features", anchor: "link prospecting platform", dr: 93, type: "Nofollow", status: "Live", firstSeen: "2024-01-20" },
  { id: 34, domain: "behance.net", url: "https://behance.net/gallery/seo-linkpro-case", target: "https://uprankly.com/", anchor: "outreach automation", dr: 88, type: "Nofollow", status: "Live", firstSeen: "2024-10-15" },
  { id: 35, domain: "github.blog", url: "https://github.blog/open-source-seo-tools", target: "https://uprankly.com/blog", anchor: "SEO software", dr: 94, type: "Dofollow", status: "Live", firstSeen: "2025-05-30" }
];

interface ProjectCardData {
  id: string;
  name: string;
  domain: string;
  dr: number;
  traffic: string;
  trafficVal: number; 
  refDomains: number;
  backlinks: number;
  lastUpdated: string;
  strategy: string;
  doFollowPct: number;
  growthPct: number;
}

interface BlueprintViewProps {
  isSidebarCollapsedGlobal: boolean;
  onToggleSidebarGlobal: (val: boolean) => void;
}

export function BlueprintView({ 
  isSidebarCollapsedGlobal, 
  onToggleSidebarGlobal 
}: BlueprintViewProps) {
  
  // 1. All core project cards in directory
  const [projects, setProjects] = useState<ProjectCardData[]>([
    { id: "p-0", name: "NoLinks Beta", domain: "nolinksbeta.co", dr: 14, traffic: "0", trafficVal: 0, refDomains: 0, backlinks: 0, lastUpdated: "Just Added", strategy: "Setup", doFollowPct: 0, growthPct: 0 },
    { id: "p-1", name: "Uprankly", domain: "uprankly.com", dr: 42, traffic: "14.7K", trafficVal: 14700, refDomains: 520, backlinks: 8412, lastUpdated: "Today", strategy: "Outreach", doFollowPct: 78, growthPct: 12 },
    { id: "p-2", name: "CyberGuard", domain: "cyberguard.io", dr: 38, traffic: "8.2K", trafficVal: 8200, refDomains: 310, backlinks: 2140, lastUpdated: "Yesterday", strategy: "Monitoring", doFollowPct: 52, growthPct: -3 },
    { id: "p-3", name: "TechFlow", domain: "techflow.dev", dr: 29, traffic: "4.5K", trafficVal: 4500, refDomains: 180, backlinks: 1280, lastUpdated: "2 Days Ago", strategy: "Prospecting", doFollowPct: 74, growthPct: 8 },
    { id: "p-4", name: "Client A", domain: "clienta.com", dr: 61, traffic: "22.4K", trafficVal: 22400, refDomains: 840, backlinks: 6420, lastUpdated: "Today", strategy: "Research", doFollowPct: 81, growthPct: 15 },
    { id: "p-5", name: "GrowthStack", domain: "growthstack.co", dr: 45, traffic: "11.2K", trafficVal: 11200, refDomains: 480, backlinks: 3950, lastUpdated: "Today", strategy: "Monitoring", doFollowPct: 62, growthPct: 7 },
    { id: "p-6", name: "SaaS Rocket", domain: "saasrocket.io", dr: 52, traffic: "19.5K", trafficVal: 19500, refDomains: 620, backlinks: 5120, lastUpdated: "3 Days Ago", strategy: "Outreach", doFollowPct: 70, growthPct: 11 },
    { id: "p-7", name: "HealthPal", domain: "healthpal.org", dr: 33, traffic: "5.1K", trafficVal: 5100, refDomains: 220, backlinks: 1650, lastUpdated: "Yesterday", strategy: "Research", doFollowPct: 58, growthPct: 2 },
    { id: "p-8", name: "Apex Devs", domain: "apexdevs.com", dr: 40, traffic: "12.0K", trafficVal: 12000, refDomains: 410, backlinks: 3400, lastUpdated: "Today", strategy: "Prospecting", doFollowPct: 65, growthPct: 9 },
    { id: "p-9", name: "EduGen", domain: "edugen.net", dr: 24, traffic: "1.8K", trafficVal: 1800, refDomains: 95, backlinks: 720, lastUpdated: "4 Days Ago", strategy: "Setup", doFollowPct: 45, growthPct: -1 },
    { id: "p-10", name: "SmartFin", domain: "smartfin.finance", dr: 55, traffic: "30.2K", trafficVal: 30200, refDomains: 990, backlinks: 8150, lastUpdated: "Today", strategy: "Outreach", doFollowPct: 85, growthPct: 24 },
    { id: "p-11", name: "EcoLogic", domain: "ecologic.earth", dr: 31, traffic: "3.4K", trafficVal: 3400, refDomains: 140, backlinks: 1150, lastUpdated: "1 Week Ago", strategy: "Research", doFollowPct: 60, growthPct: 4 },
    { id: "p-12", name: "BuildFast", domain: "buildfast.app", dr: 35, traffic: "9.8K", trafficVal: 9800, refDomains: 290, backlinks: 2460, lastUpdated: "Yesterday", strategy: "Monitoring", doFollowPct: 50, growthPct: 6 }
  ]);

  // Overall Directory level states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dr" | "traffic" | "backlinks" | "name">("dr");
  const [filterDR, setFilterDR] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Active loaded project Link Profile view
  const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);

  // DEV EMPTY STATE TOGGLE & DYNAMIC BACKLINKS DATA
  const [forceEmptyLinkProfile, setForceEmptyLinkProfile] = useState(false);
  const [backlinksList, setBacklinksList] = useState<any[]>(BACKLINKS_DATA);

  // Simulated Priority crawler scanner
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Manual Backlink creation block
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualDomain, setManualDomain] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualTargetPath, setManualTargetPath] = useState("");
  const [manualAnchor, setManualAnchor] = useState("");
  const [manualDR, setManualDR] = useState(65);
  const [manualType, setManualType] = useState("Dofollow");
  const [manualStatus, setManualStatus] = useState("Live");

  // Add Project Quick Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDomain, setNewProjDomain] = useState("");
  const [newProjDR, setNewProjDR] = useState(30);
  const [newProjTraffic, setNewProjTraffic] = useState("5.0K");
  const [newProjRefDomains, setNewProjRefDomains] = useState(150);
  const [newProjBacklinks, setNewProjBacklinks] = useState(1200);

  // Advanced Backlink Table States for the revitalised selectedProject detailed view
  const [backlinkSearch, setBacklinkSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [minDRRange, setMinDRRange] = useState<number>(0);
  const [maxDRRange, setMaxDRRange] = useState<number>(100);
  const [backlinkPage, setBacklinkPage] = useState(1);
  const [checkedBacklinkIds, setCheckedBacklinkIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Quick toast dispatcher helper
  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 3500);
  };

  // Directory changelogs
  const changelogs = [
    { text: "Uprankly gained 12 new referring domains", type: "gain", time: "Today" },
    { text: "CyberGuard lost 3 backlinks", type: "loss", time: "Yesterday" },
    { text: "TechFlow DR increased from 28 → 29", type: "gain", time: "2 Days ago" },
    { text: "Client A gained 42 new backlinks", type: "gain", time: "Today" }
  ];

  // Calculated totals of the active collection
  const totalProjects = projects.length;
  const avgDR = useMemo(() => {
    if (projects.length === 0) return 0;
    return Math.round(projects.reduce((sum, p) => sum + p.dr, 0) / projects.length);
  }, [projects]);
  const totalRefDomains = useMemo(() => {
    return projects.reduce((sum, p) => sum + p.refDomains, 0);
  }, [projects]);
  const totalBacklinksCount = useMemo(() => {
    return projects.reduce((sum, p) => sum + p.backlinks, 0);
  }, [projects]);

  // Actions
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjDomain) {
      alert("Please provide the project name and domain suffix.");
      return;
    }

    const tVal = parseFloat(newProjTraffic.replace(/[^\d.]/g, "")) * (newProjTraffic.toLowerCase().includes("k") ? 1000 : 1);
    
    const newRecord: ProjectCardData = {
      id: `p-${Date.now()}`,
      name: newProjName,
      domain: newProjDomain.toLowerCase(),
      dr: Number(newProjDR) || 12,
      traffic: newProjTraffic || "1.0K",
      trafficVal: tVal || 1000,
      refDomains: Number(newProjRefDomains) || 50,
      backlinks: Number(newProjBacklinks) || 400,
      lastUpdated: "Today",
      strategy: "Setup",
      doFollowPct: 60,
      growthPct: 0
    };

    setProjects(prev => [newRecord, ...prev]);
    setShowAddModal(false);
    
    // Clear inputs
    setNewProjName("");
    setNewProjDomain("");
    setNewProjDR(30);
    setNewProjTraffic("5.0K");
    setNewProjRefDomains(150);
    setNewProjBacklinks(1200);

    triggerToast(`Added project "${newProjName}" successfully.`);
  };

  // Main Directory search and filter
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q));
    }

    if (filterDR !== "all") {
      if (filterDR === "high") {
        result = result.filter(p => p.dr >= 50);
      } else if (filterDR === "medium") {
        result = result.filter(p => p.dr >= 30 && p.dr < 50);
      } else if (filterDR === "low") {
        result = result.filter(p => p.dr < 30);
      }
    }

    result.sort((a, b) => {
      if (sortBy === "dr") return b.dr - a.dr;
      if (sortBy === "traffic") return b.trafficVal - a.trafficVal;
      if (sortBy === "backlinks") return b.backlinks - a.backlinks;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [projects, searchQuery, sortBy, filterDR]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;

  // Revamped Detailed view query processing
  const filteredBacklinks = useMemo(() => {
    if (forceEmptyLinkProfile || (selectedProject && selectedProject.backlinks === 0)) {
      return [];
    }
    return backlinksList.filter(item => {
      // 1. Search Query
      if (backlinkSearch.trim() !== "") {
        const query = backlinkSearch.toLowerCase();
        const matchesQuery = 
          item.domain.toLowerCase().includes(query) || 
          item.anchor.toLowerCase().includes(query) || 
          item.url.toLowerCase().includes(query) || 
          item.target.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. DR range
      if (item.dr < minDRRange || item.dr > maxDRRange) {
        return false;
      }

      // 3. Type Toggle Chips
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(item.type)) {
          return false;
        }
      }

      // 4. Status Toggle Chips
      if (selectedStatuses.length > 0) {
        // Handle "Lost" mapping to "Broken" in backend dataset
        const mappedStatuses = selectedStatuses.map(s => s === "Lost" ? "Broken" : s);
        if (!mappedStatuses.includes(item.status)) {
          return false;
        }
      }

      return true;
    });
  }, [backlinksList, forceEmptyLinkProfile, selectedProject, backlinkSearch, selectedTypes, selectedStatuses, minDRRange, maxDRRange]);

  // Backlink page limits: 25 items per page to perfectly mimic "Showing 1-25 of 35 backlinks" and pagination "1/2"
  const BACKLINKS_PER_PAGE = 25;
  const paginatedBacklinks = useMemo(() => {
    const start = (backlinkPage - 1) * BACKLINKS_PER_PAGE;
    return filteredBacklinks.slice(start, start + BACKLINKS_PER_PAGE);
  }, [filteredBacklinks, backlinkPage]);

  const totalBacklinkPages = Math.ceil(filteredBacklinks.length / BACKLINKS_PER_PAGE) || 1;

  // Toggle filter logic
  const handleTypeChipToggle = (type: string) => {
    setSelectedTypes(prev => {
      const active = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      return active;
    });
    setBacklinkPage(1);
  };

  const handleStatusChipToggle = (status: string) => {
    setSelectedStatuses(prev => {
      const active = prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status];
      return active;
    });
    setBacklinkPage(1);
  };

  // Row selection handlers
  const handleToggleSelectAll = () => {
    const pageIds = paginatedBacklinks.map(b => b.id);
    const allOnPageChecked = pageIds.every(id => checkedBacklinkIds.includes(id));
    if (allOnPageChecked) {
      setCheckedBacklinkIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setCheckedBacklinkIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectOne = (id: number) => {
    setCheckedBacklinkIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Return to directory and reset sub-dashboard states
  const handleBackToDirectory = () => {
    setSelectedProject(null);
    setBacklinkSearch("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setMinDRRange(0);
    setMaxDRRange(100);
    setBacklinkPage(1);
    setCheckedBacklinkIds([]);
  };

  // Priority Crawler scan simulator for empty state
  const handlePriorityScan = () => {
    if (isScanning || !selectedProject) return;
    setIsScanning(true);
    setScanProgress(8);
    setScanLogs([`[INFO] Ingesting priority domain scan sequence for ${selectedProject.domain}...`]);

    const messages = [
      { progress: 20, log: `[${new Date().toLocaleTimeString()}] DNS records lookup completed. Resolving global class subnet allocations...` },
      { progress: 45, log: `[${new Date().toLocaleTimeString()}] Querying 42,000 backlink indices & active historical crawl maps...` },
      { progress: 70, log: `[${new Date().toLocaleTimeString()}] Evaluating anchor distribution node matrices and Spam Rating indices...` },
      { progress: 90, log: `[${new Date().toLocaleTimeString()}] Verifying live remote HTTP response codes and absolute redirect chains...` },
      { progress: 100, log: `[${new Date().toLocaleTimeString()}] SUCCESS: 3 high-authority backlink references discovered for ${selectedProject.domain}!` }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < messages.length) {
        const step = messages[currentStep];
        setScanProgress(step.progress);
        setScanLogs(prev => [...prev, step.log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Inject 3 high-authority backlinks specifically tailored for this selected domain
          const newLinks = [
            {
              id: Date.now() + 100,
              domain: "github.com",
              url: "https://github.com/topics/seo-automation",
              target: `https://${selectedProject.domain}/oss-tools`,
              anchor: `${selectedProject.name} open source`,
              dr: 94,
              type: "Dofollow",
              status: "Live",
              firstSeen: "Just Now"
            },
            {
              id: Date.now() + 101,
              domain: "news.ycombinator.com",
              url: "https://news.ycombinator.com/item?id=381920",
              target: `https://${selectedProject.domain}/`,
              anchor: `Show HN: ${selectedProject.name}`,
              dr: 91,
              type: "Dofollow",
              status: "Live",
              firstSeen: "Just Now"
            },
            {
              id: Date.now() + 102,
              domain: "medium.com",
              url: "https://medium.com/tag/link-building",
              target: `https://${selectedProject.domain}/case-study`,
              anchor: `${selectedProject.name} strategy guide`,
              dr: 85,
              type: "UGC",
              status: "Live",
              firstSeen: "Just Now"
            }
          ];

          setBacklinksList(prev => [...newLinks, ...prev]);

          // Update projects state
          setProjects(prev => prev.map(p => {
            if (p.id === selectedProject.id) {
              const updated = { 
                ...p, 
                backlinks: 3, 
                refDomains: 3, 
                dr: p.dr < 18 ? 24 : p.dr,
                doFollowPct: 100,
                growthPct: 3
              };
              // Update working project selected state
              setSelectedProject(updated);
              return updated;
            }
            return p;
          }));

          setForceEmptyLinkProfile(false);
          setIsScanning(false);
          triggerToast("Successfully crawled and ingested 3 high-authority backlinks!", "success");
        }, 800);
      }
    }, 950);
  };

  // Submit manual backlinks creation action
  const handleManualLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !manualDomain.trim()) return;

    const domainClean = manualDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    const newLink = {
      id: Date.now(),
      domain: domainClean,
      url: manualUrl || `https://${domainClean}/resource-list`,
      target: manualTargetPath || `https://${selectedProject.domain}/`,
      anchor: manualAnchor || `${selectedProject.name} platform`,
      dr: Number(manualDR) || 65,
      type: manualType,
      status: manualStatus,
      firstSeen: "Just Now"
    };

    setBacklinksList(prev => [newLink, ...prev]);

    // Update project state list
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProject.id) {
        const updatedCount = p.backlinks + 1;
        const updatedRefDomains = p.refDomains + 1;
        const updated = { 
          ...p, 
          backlinks: updatedCount, 
          refDomains: updatedRefDomains,
          dr: Math.min(100, Math.max(p.dr, Math.ceil(manualDR * 0.4)))
        };
        setSelectedProject(updated);
        return updated;
      }
      return p;
    }));

    // Reset manual form fields
    setManualDomain("");
    setManualUrl("");
    setManualTargetPath("");
    setManualAnchor("");
    setManualDR(65);
    setManualType("Dofollow");
    setManualStatus("Live");
    setShowManualModal(false);
    setForceEmptyLinkProfile(false);

    triggerToast("Inbound backlink registered and successfully indexed!", "success");
  };

  // Render project Link Profile sub-dashboard with unparalleled accuracy
  if (selectedProject) {
    return (
      <div className="space-y-8 animate-fade-in" id="link-profile-detail-improved-view">
        
        {/* Toast Alert Widget */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 border border-slate-800 text-white shadow-2xl rounded-xl px-4 py-3.5 flex items-center gap-3 animate-fade-in text-xs font-semibold max-w-sm transition-all" id="app-trigger-toast">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping absolute -top-0.5 -right-0.5" />
            <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
            <p className="mr-4 leading-relaxed">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white transition-colors p-1 rounded font-mono text-base font-bold ml-auto">&times;</button>
          </div>
        )}

        {/* 1. Header Path and Active Title Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-200/80" id="detail-head-layout">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase" id="crumb-nav">
              <span className="hover:text-teal-600 transition-colors cursor-pointer" onClick={handleBackToDirectory}>Link Pro</span>
              <span className="text-slate-300">/</span>
              <span className="hover:text-teal-600 transition-colors cursor-pointer" onClick={handleBackToDirectory}>Projects</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 uppercase">{selectedProject.name}</span>
              <span className="text-slate-300">/</span>
              <span className="text-teal-600 font-bold">Link Profile</span>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 font-sans" id="primary-sec-heading">
              Link Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">
              Backlink portfolio for {selectedProject.domain}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3" id="top-ctrl-buttons">
            <button 
              onClick={() => {
                triggerToast("Opening comprehensive competitors analysis matrix report...", "info");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
              id="competition-report-btn"
            >
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <span>Competition Report</span>
            </button>

            <button 
              onClick={() => {
                triggerToast(`Successfully exported ${filteredBacklinks.length} backlink records to LinkProfile_${selectedProject.name}.csv`, "success");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-all hover:shadow-xs active:scale-95 cursor-pointer"
              id="export-csv-btn"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button 
              onClick={handleBackToDirectory}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              id="return-dir-btn"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Projects Hub</span>
            </button>
          </div>
        </div>

        {/* 1.5 Developer Sandbox Helper Control Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl text-white my-4" id="dev-sim-sandbox">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">Developer Helper Sandbox</p>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                Testing domain: <span className="font-mono text-white underline">{selectedProject.domain}</span> ({selectedProject.backlinks === 0 ? "0 links - EMPTY STATE Active" : `${selectedProject.backlinks} links - POPULATED Active`})
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setForceEmptyLinkProfile(prev => !prev);
                triggerToast(!forceEmptyLinkProfile ? "Switched to standard empty state view!" : "Switched back to standard populated view!", "info");
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded text-[10.5px] font-mono font-bold text-slate-200 cursor-pointer active:scale-95 transition-all"
            >
              [ {forceEmptyLinkProfile ? "🔌 FORCE POPULATED VIEW" : "🔌 FORCE EMPTY STATE VIEW"} ]
            </button>
            
            <button
              onClick={() => {
                // Instantly reset this project back to 0 backlinks to test natural empty state
                setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, backlinks: 0, refDomains: 0 } : p));
                setSelectedProject(current => current ? { ...current, backlinks: 0, refDomains: 0 } : null);
                setForceEmptyLinkProfile(false);
                triggerToast(`Project metadata stats reset to 0 backlinks for ${selectedProject.name}!`, "info");
              }}
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900 rounded text-[10.5px] font-mono font-bold text-rose-300 cursor-pointer active:scale-95 transition-all"
            >
              [ 🧹 RESET BACKLINKS COUNT TO 0 ]
            </button>
          </div>
        </div>

        {/* 2. Main content switch: Empty State vs Original Portfolio Dashboard */}
        { (forceEmptyLinkProfile || selectedProject.backlinks === 0) ? (
          <LinkProfileEmptyView 
            selectedProject={selectedProject}
            isScanning={isScanning}
            scanProgress={scanProgress}
            scanLogs={scanLogs}
            onPriorityScan={handlePriorityScan}
            onRegisterManually={() => setShowManualModal(true)}
          />
        ) : (
          <>
            {/* 2. Executive Metric Scorecard Row - 6 Dynamic Cards matching the screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="executive-dashboard-metrics">
          
          {/* Card 1: Domain Rating */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="metric-domain-rating">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Domain Rating</span>
              <span className="text-[9.5px] bg-[#e6f4ea] text-[#137333] font-bold px-1.5 py-0.5 rounded-md font-mono flex items-center">
                ↑ +3
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{selectedProject.dr}</p>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 font-mono uppercase">Ahrefs Platform Rating</p>
            </div>
          </div>

          {/* Card 2: Referring Domains */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="metric-ref-domains">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Referring Domains</span>
              <span className="text-[9.5px] bg-[#e6f4ea] text-[#137333] font-bold px-1.5 py-0.5 rounded-md font-mono flex items-center">
                ↑ +8
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{selectedProject.refDomains}</p>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 font-mono uppercase">Unique Class Subnets</p>
            </div>
          </div>

          {/* Card 3: Total Backlinks */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="metric-total-backlinks">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Total Backlinks</span>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {selectedProject.backlinks.toLocaleString()}
              </p>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 font-mono uppercase">Validated Live Indices</p>
            </div>
          </div>

          {/* Card 4: Dofollow Ratio */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="metric-dofollow-ratio">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">DoFollow Ratio</span>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {selectedProject.doFollowPct}%
              </p>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 font-mono uppercase">Equity Transfer Scope</p>
            </div>
          </div>

          {/* Card 5: Gained 30d */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="metric-gained-30d">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Gained (30d)</span>
              <span className="text-[9.5px] bg-[#e6f4ea] text-[#137333] font-bold px-1.5 py-0.5 rounded-md font-mono flex items-center">
                ↑ +12
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">12</p>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 font-mono uppercase">Fresh Crawled Inflows</p>
            </div>
          </div>

          {/* Card 6: Lost 30d */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="metric-lost-30d">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lost (30d)</span>
              <span className="text-[9.5px] bg-[#fce8e6] text-[#c5221f] font-bold px-1.5 py-0.5 rounded-md font-mono flex items-center">
                ↓ -3
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">3</p>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 font-mono uppercase">Broken or Retired Links</p>
            </div>
          </div>

        </div>

        {/* 3. Competition Benchmark Slide panel */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs relative overflow-hidden" id="competition-benchmark-widget">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Competition Benchmark</h3>
          
          {/* Custom Horizontal visual track representing competitor ratings */}
          <div className="my-6 relative" id="slider-container-box">
            <div className="w-full bg-slate-100 h-2 rounded-full relative overflow-visible">
              {/* Core active track colored slate */}
              <div className="absolute top-0 bottom-0 left-0 bg-[#0d9488]/25 rounded-full" style={{ width: "85%" }} />
              
              {/* Competitor Dots and labels precisely layered */}
              {/* Dot 1: Competitor linkbuilding.co at DR 25 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[25%] flex flex-col items-center group/dot" style={{ transform: "translate(-50%, -50%)" }}>
                <div className="w-3 h-3 rounded-full bg-slate-400 border border-white shadow-xs cursor-help transition-all group-hover/dot:scale-125" />
                <span className="absolute bottom-5 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 pointer-events-none group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-20">
                  LinkBuilder (DR 25)
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 mt-3">DR 25</span>
              </div>

              {/* Dot 2: Competitor seoboost.io at DR 38 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[38%] flex flex-col items-center group/dot" style={{ transform: "translate(-50%, -50%)" }}>
                <div className="w-3 h-3 rounded-full bg-slate-400 border border-white shadow-xs cursor-help transition-all group-hover/dot:scale-125" />
                <span className="absolute bottom-5 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 pointer-events-none group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-20">
                  SEOBoost (DR 38)
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 mt-3">DR 38</span>
              </div>

              {/* Dot 3: Active selected project (Uprankly) at DR 42 - Highlighted */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[42%] flex flex-col items-center group/dot" style={{ transform: "translate(-50%, -50%)" }}>
                <span className="absolute -top-1 bg-[#0d9488] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider -translate-y-full z-10 animate-bounce">
                  YOU
                </span>
                <div className="w-5 h-5 rounded-full bg-[#0d9488] border-2 border-white shadow-md cursor-pointer transition-transform group-hover/dot:scale-110 flex items-center justify-center">
                  <div className="w-2,5 h-2,5 rounded-full bg-teal-200 animate-pulse" />
                </div>
                <span className="absolute bottom-7 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-20 border border-slate-700">
                  {selectedProject.name} (DR {selectedProject.dr})
                </span>
                <span className="text-[10px] font-mono font-black text-[#0d9488] mt-3">{selectedProject.name} (DR {selectedProject.dr})</span>
              </div>

              {/* Dot 4: Competitor ahrefs.com/authority-blog or giant-rival at DR 85 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[85%] flex flex-col items-center group/dot" style={{ transform: "translate(-50%, -50%)" }}>
                <div className="w-3 h-3 rounded-full bg-[#c5221f] border border-white shadow-xs cursor-help transition-all group-hover/dot:scale-125" />
                <span className="absolute bottom-5 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 pointer-events-none group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-20">
                  Ahrefs Competitor (DR 85)
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-500 mt-3">Ahrefs DR 85</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-10 border-t border-slate-100 text-xs font-semibold" id="benchmark-foot-details">
            <p className="text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                You are <strong className="text-slate-900 font-bold">#3</strong> of 4 tracked competitors by DR. You gained <strong className="text-[#0d9488] font-bold">{selectedProject.growthPct || 12}</strong> links this month. Ahrefs competitor gained 28.
              </span>
            </p>
            <button 
              onClick={() => {
                triggerToast("Generating fully aggregated competitive metrics timeline index...", "info");
              }}
              className="text-[#0d9488] hover:text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View full Competition Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Filter Toolbar & Detailed Backlinks Table List */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden" id="detailed-backlinks-ledger">
          
          {/* Section banner */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50" id="table-sec-banner">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#0d9488]" />
                <span>Backlinks</span>
                <span className="text-xs bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded-full ml-1">
                  {filteredBacklinks.length} total
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore comprehensive inbound link equity profiles discovered by our index crawler.</p>
            </div>

            {/* If items are selected, show bulk actions */}
            {checkedBacklinkIds.length > 0 && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 flex items-center gap-2 anim-fade-in text-xs" id="bulk-controls">
                <span className="font-bold text-teal-800 font-mono">{checkedBacklinkIds.length} checked</span>
                <div className="h-4 w-px bg-teal-200 mx-1" />
                <button 
                  onClick={() => {
                    triggerToast(`Initiating disavow export schema for ${checkedBacklinkIds.length} target records...`, "info");
                    setCheckedBacklinkIds([]);
                  }}
                  className="text-amber-800 hover:text-amber-950 font-bold transition-all hover:underline"
                >
                  Disavow
                </button>
                <span className="text-teal-300">&bull;</span>
                <button 
                  onClick={() => {
                    triggerToast(`Successfully queued ${checkedBacklinkIds.length} backlinks to CRM pipeline!`, "success");
                    setCheckedBacklinkIds([]);
                  }}
                  className="text-[#0d9488] hover:text-teal-800 font-bold transition-all hover:underline"
                >
                  Bulk Outreach
                </button>
                <span className="text-teal-300">&bull;</span>
                <button 
                  onClick={() => setCheckedBacklinkIds([])}
                  className="text-slate-500 hover:text-slate-700 font-medium transition-all"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Table Filters bar corresponding to the exact provided layout */}
          <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4" id="ledger-filter-row">
            
            {/* Search Input box */}
            <div className="relative w-full xl:max-w-xs shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search domain or anchor text..."
                value={backlinkSearch}
                onChange={(e) => {
                  setBacklinkSearch(e.target.value);
                  setBacklinkPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Quick Toggle Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 min-w-0" id="filter-types-chips">
              
              {/* Type Category labels */}
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mr-1">Types:</span>
              {["Dofollow", "Nofollow", "UGC", "Sponsored"].map(type => {
                const isActive = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChipToggle(type)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#0d9488] border-[#0d9488] text-white" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden lg:block" />

              {/* Status Categorization tags */}
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mr-1">Statuses:</span>
              {["Live", "Lost", "Broken"].map(status => {
                const isActive = selectedStatuses.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChipToggle(status)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#0d9488] border-[#0d9488] text-white" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}

              {/* Reset Active Filtering options */}
              {(selectedTypes.length > 0 || selectedStatuses.length > 0 || backlinkSearch !== "") && (
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedStatuses([]);
                    setBacklinkSearch("");
                    setBacklinkPage(1);
                  }}
                  className="p-1 px-2.5 text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* DR Slider Range inputs matching exact provided image layout style */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 whitespace-nowrap bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-3 self-start xl:self-auto" id="dr-range-component">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>DR</span>
              <input 
                type="number" 
                min={0}
                max={100}
                value={minDRRange}
                onChange={(e) => {
                  setMinDRRange(Math.max(0, parseInt(e.target.value) || 0));
                  setBacklinkPage(1);
                }}
                className="w-10 bg-white border border-slate-200 text-center rounded py-0.5 outline-none font-mono font-bold text-slate-800"
              />
              <span className="text-slate-300">-</span>
              <input 
                type="number" 
                min={0}
                max={100}
                value={maxDRRange}
                onChange={(e) => {
                  setMaxDRRange(Math.min(100, parseInt(e.target.value) || 100));
                  setBacklinkPage(1);
                }}
                className="w-10 bg-white border border-slate-200 text-center rounded py-0.5 outline-none font-mono font-bold text-slate-800"
              />
            </div>

          </div>

          {/* Table Container element */}
          <div className="overflow-x-auto" id="ledger-table-container">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={handleToggleSelectAll}
                      checked={paginatedBacklinks.length > 0 && paginatedBacklinks.every(item => checkedBacklinkIds.includes(item.id))}
                      className="rounded border-slate-300 bg-white checkmark-box"
                    />
                  </th>
                  <th className="p-4 min-w-[200px]">Source Domain</th>
                  <th className="p-4 min-w-[150px]">Target URL</th>
                  <th className="p-4 min-w-[160px]">Anchor Text</th>
                  <th className="p-4 w-16 text-center">DR</th>
                  <th className="p-4 w-28 text-center">Type</th>
                  <th className="p-4 w-24 text-center">Status</th>
                  <th className="p-4 w-28 text-center">First Seen</th>
                  <th className="p-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedBacklinks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-400 font-semibold">
                      <HelpCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      <p>No backlink records match your active query constraints.</p>
                      <button 
                        onClick={() => {
                          setSelectedTypes([]);
                          setSelectedStatuses([]);
                          setBacklinkSearch("");
                          setMinDRRange(0);
                          setMaxDRRange(100);
                        }}
                        className="mt-3 text-[#0d9488] hover:underline hover:text-teal-800 font-bold"
                      >
                        Reset applied constraints
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedBacklinks.map((item) => {
                    const isChecked = checkedBacklinkIds.includes(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-50/50 transition-colors ${isChecked ? "bg-teal-50/20" : ""}`}
                        id={`backlink-row-${item.id}`}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleToggleSelectOne(item.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        
                        {/* Source domain with target path underneath */}
                        <td className="p-4">
                          <div className="font-bold text-slate-800 truncate max-w-xs">{item.domain}</div>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-slate-400 font-semibold font-mono hover:text-[#0d9488] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span className="truncate max-w-xs">{item.url}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </td>

                        {/* Target URL */}
                        <td className="p-4">
                          <div className="text-slate-600 truncate max-w-xs font-mono text-[10.5px]">
                            {item.target}
                          </div>
                        </td>

                        {/* Anchor tag text */}
                        <td className="p-4">
                          <span className="text-slate-700 bg-slate-50 border border-slate-200/50 rounded px-2 py-0.5 font-sans">
                            {item.anchor}
                          </span>
                        </td>

                        {/* Domain rating stats */}
                        <td className="p-4 text-center font-mono font-black text-slate-800">
                          {item.dr}
                        </td>

                        {/* Backlink equity type element */}
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.type === "Dofollow" 
                              ? "bg-teal-50 text-teal-700 border border-teal-100" 
                              : item.type === "Nofollow"
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : item.type === "UGC"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-purple-50 text-purple-700 border border-purple-100"
                          }`}>
                            {item.type}
                          </span>
                        </td>

                        {/* Ingestion live/broken status indicator */}
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "Live" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* First crawls datetime */}
                        <td className="p-4 text-center text-slate-500 font-mono text-[10.5px]">
                          {item.firstSeen}
                        </td>

                        {/* Actions shortcuts */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                triggerToast(`Re-crawling target index for backlink ${item.domain}...`, "info");
                              }}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#0d9488] rounded transition-colors"
                              title="Re-verify Link"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                triggerToast(`Flagged backlink on ${item.domain} for active monitoring sequences.`, "info");
                              }}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Flag Link Alert"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Section matching image precisely */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs font-semibold text-slate-500" id="table-pagination-footer">
            <span className="font-mono">
              Showing {filteredBacklinks.length > 0 ? (backlinkPage - 1) * BACKLINKS_PER_PAGE + 1 : 0}-
              {Math.min(backlinkPage * BACKLINKS_PER_PAGE, filteredBacklinks.length)} of {filteredBacklinks.length} backlinks
            </span>

            <div className="flex items-center gap-3">
              <button
                disabled={backlinkPage === 1}
                onClick={() => setBacklinkPage(prev => Math.max(prev - 1, 1))}
                className="p-1 px-2.5 rounded border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="font-mono text-slate-700">
                {backlinkPage} / {totalBacklinkPages}
              </span>

              <button
                disabled={backlinkPage === totalBacklinkPages}
                onClick={() => setBacklinkPage(prev => Math.min(prev + 1, totalBacklinkPages))}
                className="p-1 px-2.5 rounded border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 5. Intelligence Bottom grid section with 3 customized modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="intelligence-bottom-section">
          
          {/* Box 1: Recovery Opportunities */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="intel-recovery-opportunities bg">
            <div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-slate-800">Intelligence</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-rose-500" />
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Recovery Opportunities</h4>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-1.5 py-0.5 rounded-full ml-auto">5</span>
              </div>

              <div className="space-y-3" id="recovery-recommendations-list">
                
                {/* Rec Item 1 */}
                <div className="flex items-center justify-between border border-slate-100 rounded-lg p-2.5 hover:bg-slate-50 transition-colors text-xs text-slate-600">
                  <div>
                    <h5 className="font-bold text-slate-800">betterstack.com</h5>
                    <p className="text-[10px] text-slate-400">SEO software</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">DR 55</span>
                    <button 
                      onClick={() => {
                        triggerToast("Outreach sequence queued for betterstack.com editor-in-chief.", "success");
                      }}
                      className="text-[#0d9488] hover:text-teal-800 font-bold hover:underline"
                    >
                      Recover
                    </button>
                  </div>
                </div>

                {/* Rec Item 2 */}
                <div className="flex items-center justify-between border border-slate-100 rounded-lg p-2.5 hover:bg-slate-50 transition-colors text-xs text-slate-600">
                  <div>
                    <h5 className="font-bold text-slate-800">logrocket.com</h5>
                    <p className="text-[10px] text-slate-400">link building tool</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">DR 73</span>
                    <button 
                      onClick={() => {
                        triggerToast("Outreach sequence queued for logrocket.com webmaster.", "success");
                      }}
                      className="text-[#0d9488] hover:text-teal-800 font-bold hover:underline"
                    >
                      Recover
                    </button>
                  </div>
                </div>

                {/* Rec Item 3 */}
                <div className="flex items-center justify-between border border-slate-100 rounded-lg p-2.5 hover:bg-slate-50 transition-colors text-xs text-slate-600">
                  <div>
                    <h5 className="font-bold text-slate-800">indiehackers.com</h5>
                    <p className="text-[10px] text-slate-400">Uprankly</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">DR 65</span>
                    <button 
                      onClick={() => {
                        triggerToast("Queued broken forum redirect repair to indiehackers.com.", "success");
                      }}
                      className="text-[#0d9488] hover:text-teal-800 font-bold hover:underline"
                    >
                      Recover
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <button 
              onClick={() => {
                triggerToast("Redirecting to Broken Link Reclaimer automation dashboard...", "info");
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors w-full text-left pt-3 border-t border-slate-100 mt-4 flex items-center justify-between hover:underline"
            >
              <span>View all 5 lost links</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Box 2: Link Velocity */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="intel-link-velocity">
            <div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Link Velocity</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                    Gaining
                  </span>
                </div>
              </div>

              {/* Metric Breakdown Table */}
              <div className="space-y-4 text-xs font-semibold py-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Gained (30d)</span>
                  <span className="font-mono text-emerald-600 font-bold text-sm">+12</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "75%" }} />
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Lost (30d)</span>
                  <span className="font-mono text-rose-500 font-bold text-sm">-3</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "18%" }} />
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Competitors avg</span>
                  <span className="font-mono text-slate-900 font-bold text-sm">+17</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold font-mono uppercase text-center mt-4 pt-3 border-t border-slate-100">
              Velocity Index: Healthy Growth Spectrum
            </p>
          </div>

          {/* Box 3: Anchor Distribution */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="intel-anchor-distribution">
            <div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Anchor Distribution</h4>
                </div>
              </div>

              {/* Progress bars of actual anchors */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center font-semibold text-slate-600 mb-1">
                    <span className="truncate max-w-[140px]">uprankly.com</span>
                    <span className="font-mono text-slate-800">18%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center font-semibold text-slate-600 mb-1">
                    <span className="truncate max-w-[140px]">Uprankly</span>
                    <span className="font-mono text-slate-800">16%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "16%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center font-semibold text-slate-600 mb-1">
                    <span className="truncate max-w-[140px]">link building tool</span>
                    <span className="font-mono text-slate-800">13%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-2 rounded-full" style={{ width: "13%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center font-semibold text-slate-600 mb-1">
                    <span className="truncate max-w-[140px]">SEO software</span>
                    <span className="font-mono text-slate-800">10%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-300 h-2 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center font-semibold text-slate-600 mb-1">
                    <span className="truncate max-w-[140px]">click here</span>
                    <span className="font-mono text-slate-800">8%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-2 rounded-full" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-4 text-xs font-bold text-slate-600" id="anchor-summary">
              <span>Branded ratio</span>
              <span className="text-slate-900 font-black">34%</span>
            </div>
          </div>

        </div>

          </>
        )}

        {/* Manual Modal Inbound Backlink Registry */}
        {showManualModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 min-h-screen" id="manual-backlink-modal-backdrop">
            {/* Glass background overlay */}
            <div 
              className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-xs" 
              onClick={() => setShowManualModal(false)}
            />
            
            <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden animate-slide-up" id="manual-modal-container-body">
              <div className="pb-3 border-b border-slate-100 mb-5 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight flex items-center gap-1.5 font-sans">
                    <Link2 className="w-4 h-4 text-[#0d9488]" />
                    <span>Register Inbound Link</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Inject high-equity backlink reference manually.</p>
                </div>
                <button 
                  onClick={() => setShowManualModal(false)} 
                  className="text-slate-900 hover:text-rose-600 transition-colors font-mono font-bold text-lg cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleManualLinkSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Source Referring Domain (required)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. hackernews.com"
                    value={manualDomain}
                    onChange={(e) => setManualDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Absolute Source URL (optional)</label>
                  <input 
                    type="url" 
                    placeholder="e.g. https://hackernews.com/post/1"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Path on {selectedProject.domain} (optional)</label>
                  <input 
                    type="text"
                    placeholder={`https://${selectedProject.domain}/pricing`}
                    value={manualTargetPath}
                    onChange={(e) => setManualTargetPath(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Anchor Text (optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. top SEO tools suite"
                    value={manualAnchor}
                    onChange={(e) => setManualAnchor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Domain Rating (1-100)</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={100}
                      value={manualDR}
                      onChange={(e) => setManualDR(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Equity Type</label>
                    <select 
                      value={manualType}
                      onChange={(e) => setManualType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      <option value="Dofollow">Dofollow</option>
                      <option value="Nofollow">Nofollow</option>
                      <option value="UGC">UGC (Comments)</option>
                      <option value="Sponsored">Sponsored</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Index Ingestion Status</label>
                  <select 
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <option value="Live">Live (Active link)</option>
                    <option value="Broken">Broken (404/Missing)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer rounded-lg text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#0d9488] hover:bg-teal-700 text-white cursor-pointer rounded-lg font-bold"
                  >
                    Confirm Registry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- STANDARD DIRECTORY VIEW RENDERING FOR LINK PROJECTS ---
  return (
    <div className="space-y-8 animate-fade-in" id="link-profiles-directory-view">
      
      {/* Toast alert on folder directory level too */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 border border-slate-800 text-white shadow-2xl rounded-xl px-4 py-3.5 flex items-center gap-3 animate-fade-in text-xs font-semibold max-w-sm" id="app-trigger-toast-main">
          <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          <p className="mr-4 leading-relaxed">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white transition-colors p-1 rounded font-mono text-base font-bold ml-auto">&times;</button>
        </div>
      )}

      {/* 2. Headline with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#bcc9c6]/25" id="profiles-header-row">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono" id="breadcrumbs">
            <span className="hover:text-teal-600 cursor-pointer">LINK PRO</span>
            <span>/</span>
            <span className="text-teal-600 font-bold">LINK PROFILES</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 mt-2">LINK PROFILES</h1>
          <p className="text-xs text-slate-500 font-medium">
            Select a project to analyze backlink authority, referring domains, link distribution, velocity, and growth opportunities.
          </p>
        </div>

        {/* Primary header Call-to-Action to invoke quick launcher creation schema */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9488] hover:bg-[#0c8075] text-white text-xs font-bold rounded-lg transition-transform active:scale-95 cursor-pointer shadow-sm"
          id="trigger-proj-modal-btn"
        >
          <Plus className="w-4 h-4" />
          <span>+ Project</span>
        </button>
      </div>

      {/* 3. Executive Scorecard stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-scorecard-grid">
        <div className="bg-white border border-[#bcc9c6]/30 rounded-xl p-5 hover:shadow-xs transition-shadow">
          <span className="text-[10px] font-bold text-[#6d7a77]/80 uppercase tracking-widest block font-sans">Projects</span>
          <p className="text-3xl font-black text-slate-800 mt-1 font-sans">{totalProjects}</p>
        </div>

        <div className="bg-white border border-[#bcc9c6]/30 rounded-xl p-5 hover:shadow-xs transition-shadow">
          <span className="text-[10px] font-bold text-[#6d7a77]/80 uppercase tracking-widest block font-sans">Avg DR</span>
          <p className="text-3xl font-black text-slate-800 mt-1 font-sans">{avgDR}</p>
        </div>

        <div className="bg-white border border-[#bcc9c6]/30 rounded-xl p-5 hover:shadow-xs transition-shadow">
          <span className="text-[10px] font-bold text-[#6d7a77]/80 uppercase tracking-widest block font-sans">Ref Domains</span>
          <p className="text-3xl font-black text-slate-800 mt-1 font-sans">{totalRefDomains.toLocaleString()}</p>
        </div>

        <div className="bg-white border border-[#bcc9c6]/30 rounded-xl p-5 hover:shadow-xs transition-shadow">
          <span className="text-[10px] font-bold text-[#6d7a77]/80 uppercase tracking-widest block font-sans">Backlinks</span>
          <p className="text-3xl font-black text-slate-800 mt-1 font-sans">{totalBacklinksCount.toLocaleString()}</p>
        </div>
      </div>

      {/* 4. Filter bar matching exact wireframe layout specifications */}
      <div className="bg-white border border-[#bcc9c6]/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="directory-filter-bar">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects by authority key, brand, suffix host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-[#0d9488] focus:border-[#0d9488] transition-all outline-none text-slate-800 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Sorting options */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 font-medium whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline text-slate-400 font-bold uppercase text-[9.5px]">Filter DR:</span>
            <select 
              value={filterDR}
              onChange={(e) => setFilterDR(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">DR: All Tiers</option>
              <option value="high">High DR (&ge; 50)</option>
              <option value="medium">Medium DR (30 - 49)</option>
              <option value="low">Low DR (&lt; 30)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 font-medium whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-bold uppercase text-[9.5px]">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="dr">Domain Rating (DR)</option>
              <option value="traffic">Organic Traffic</option>
              <option value="backlinks">Backlinks Count</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

        </div>
      </div>

      <div id="project-directory-title">
        <h2 className="text-xs font-bold font-mono text-[#6d7a77] tracking-widest uppercase mb-1">PROJECT DIRECTORY</h2>
        <div className="w-full h-px bg-[#bcc9c6]/20" />
      </div>

      {/* 5. Clean Stripe/Linear-inspired cards directory (3-4 cards per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="projects-card-directory">
        {paginatedProjects.map((p) => {
          return (
            <div 
              key={p.id}
              className="bg-white border border-[#bcc9c6]/30 hover:border-[#0d9488]/40 rounded-xl p-5 hover:shadow-md transition-all justify-between flex flex-col group relative"
              id={`project-card-${p.id}`}
            >
              {/* Card Header information */}
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-4">
                  <div className="truncate">
                    <h3 className="font-bold text-[#0b1c30] group-hover:text-[#0d9488] transition-colors leading-tight truncate uppercase tracking-tight text-sm">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-[#6d7a77] font-mono leading-none mt-1 truncate">
                      {p.domain}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-white bg-[#0d9488] font-bold px-2 py-0.5 rounded">
                    {p.strategy}
                  </span>
                </div>

                {/* Grid stats structured list */}
                <div className="space-y-2 mb-6 font-sans text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>DR</span>
                    <span className="font-mono font-bold text-slate-900">{p.dr}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Traffic</span>
                    <span className="font-mono font-semibold text-slate-900">{p.traffic}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Ref Domains</span>
                    <span className="font-mono text-slate-900">{p.refDomains.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Backlinks</span>
                    <span className="font-mono text-slate-900">{p.backlinks.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic last updated state and interactive launch CTA */}
              <div>
                <p className="text-[10px] text-slate-400 font-mono italic mb-4">
                  Last Updated: {p.lastUpdated}
                </p>

                <button 
                  onClick={() => setSelectedProject(p)}
                  className="w-full text-center py-2 border border-[#bcc9c6]/40 hover:border-[#0d9488] hover:bg-[#eaf5f4] text-slate-700 hover:text-[#0d9488] text-[11px] font-bold rounded-lg transition-all focus:outline-none cursor-pointer"
                  id={`open-profile-btn-${p.id}`}
                >
                  [ Open Link Profile ]
                </button>
              </div>
            </div>
          );
        })}

        {/* 6. "+ ADD PROJECT" interactive card precisely as wireframed */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-[#bcc9c6]/40 bg-slate-50/50 hover:bg-[#edf9f8]/30 hover:border-[#0d9488]/40 rounded-xl p-6 flex flex-col justify-center items-center text-center group cursor-pointer transition-all min-h-[220px]"
          id="add-project-dashed-card"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#dcf2f0] flex items-center justify-center text-slate-400 group-hover:text-[#0d9488] transition-colors mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-700 group-hover:text-[#0b1c30] uppercase tracking-wide">
            + Add Project
          </h4>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">
            Add a new website and start tracking its backlink profile and authority growth.
          </p>
        </button>
      </div>

      {/* 7. RECENTLY UPDATED Section */}
      <div className="bg-slate-50/50 border border-[#bcc9c6]/20 rounded-xl p-5 space-y-3" id="recently-updated-box">
        <h4 className="text-xs font-bold font-mono text-[#6d7a77] tracking-widest uppercase">RECENTLY UPDATED</h4>
        <div className="w-full h-px bg-[#bcc9c6]/20 mb-2" />
        <ul className="space-y-2 text-xs font-semibold text-slate-700" id="recently-updated-ul">
          {changelogs.map((item, index) => {
            return (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
                <p>
                  <span>{item.text}</span>
                  <span className="text-[9.5px] text-slate-400 font-mono ml-2 font-normal">({item.time})</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 8. Pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4" id="pagination-footer">
        <div className="text-[11px] text-slate-500 font-semibold font-mono">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="flex items-center gap-1 hover:text-teal-600 active:scale-95 transition-all text-[11px] disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-bold"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="font-mono text-[11px] text-slate-500 font-bold">
            Page {currentPage} of {totalPages}
          </span>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="flex items-center gap-1 hover:text-teal-600 active:scale-95 transition-all text-[11px] disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-bold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New Project Dialog Modal (Stripe Style) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen" id="add-project-modal-backdrop">
          {/* Glass background overlay */}
          <div 
            className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-xs" 
            onClick={() => setShowAddModal(false)}
          />
          
          <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden animate-slide-up" id="modal-container-body">
            <div className="pb-3 border-b border-slate-100 mb-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Provision Authority Tracker</h3>
                <p className="text-[11px] text-slate-500">Configure strategic backlink metrics parameters.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-900 hover:text-rose-600 transition-colors font-mono font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Uprankly LLC"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Host URL (domain)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. uprankly.com"
                  value={newProjDomain}
                  onChange={(e) => setNewProjDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Estimated Traffic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 14.7K"
                    value={newProjTraffic}
                    onChange={(e) => setNewProjTraffic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Initial DR (1-100)</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={100}
                    value={newProjDR}
                    onChange={(e) => setNewProjDR(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Referring Domains</label>
                  <input 
                    type="number" 
                    value={newProjRefDomains}
                    onChange={(e) => setNewProjRefDomains(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Backlinks</label>
                  <input 
                    type="number" 
                    value={newProjBacklinks}
                    onChange={(e) => setNewProjBacklinks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0d9488] hover:bg-teal-700 text-white cursor-pointer rounded-lg font-bold"
                >
                  Confirm Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
