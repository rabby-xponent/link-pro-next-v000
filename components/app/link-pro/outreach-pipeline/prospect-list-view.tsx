"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Trophy, 
  Search, 
  Key, 
  Globe, 
  Target, 
  Database, 
  ClipboardList, 
  Megaphone, 
  Plus, 
  FileText, 
  Mail, 
  Sparkles, 
  PlusCircle, 
  CheckCircle, 
  ArrowRight, 
  BarChart, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  Eye, 
  ExternalLink,
  ChevronDown,
  Check,
  X,
  ChevronRight,
  Info,
  Users,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  Upload,
  Download,
  Square,
  CheckSquare,
  MoreHorizontal,
  AlertCircle,
  Rocket,
  RotateCcw,
  ChevronLeft
} from "lucide-react";

// Types
export interface ProspectCRMItem {
  id: string;
  siteName: string;
  person: string;
  email: string;
  stage: "Planned" | "Contacted" | "Negotiating" | "Won" | "Rejected";
  lastContact: string;
  notes: string;
}

interface MasterProspect {
  id: string;
  domain: string;
  dr: number;
  traffic: number;
  category: string;
  score: "High" | "Medium" | "Low";
  person: string;
  email: string;
  guidelines: string;
}

// Local inline toast for zero external dependencies
const LocalToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-[100] bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700/50 flex items-center gap-3 animate-slide-up max-w-sm">
      <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
      <span className="text-xs font-semibold leading-relaxed">{message}</span>
      <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export function ProspectListView({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  // Main Lists states
  const [lists, setLists] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Switch between sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<"projects" | "repository" | "crm">("projects");

  // CRM Pipeline State
  const [prospects, setProspects] = useState<ProspectCRMItem[]>([]);

  // States for interactive alert / launch cyclers
  const [alertIndex, setAlertIndex] = useState(0);
  const [launchIndex, setLaunchIndex] = useState(0);

  // Empty state toggler
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Manual list creator state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListClient, setNewListClient] = useState("");
  const [newListStatus, setNewListStatus] = useState<"Completed" | "Processing" | "Partial" | "Failed">("Completed");
  const [newListOpps, setNewListOpps] = useState(42);

  // Table selections
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);

  // Row menus
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Predefined master prospects pool (similar to Vetted Sites)
  const PREDEFINED_PROSPECT_RECORDS: MasterProspect[] = [
    { id: "mp-1", domain: "techcrunch.com", dr: 92, traffic: 15500000, category: "Technology", score: "High", person: "Amanda Ross", email: "editor@techcrunch.com", guidelines: "Strictly exceeds 1,500 words. Subject matter covers SaaS development, AI products, or software funding news." },
    { id: "mp-2", domain: "github.com", dr: 97, traffic: 120000000, category: "Technology", score: "High", person: "Robert Chen", email: "devrel@github.com", guidelines: "TypeScript or Python code examples welcomed. Strictly technical tutorials without marketing pitch." },
    { id: "mp-3", domain: "nytimes.com", dr: 94, traffic: 84500000, category: "News/Media", score: "High", person: "Julian Forbes", email: "press@nytimes.com", guidelines: "Strict journalistic integrity. Supply third-party data validation screenshots." },
    { id: "mp-4", domain: "smashingmagazine.com", dr: 88, traffic: 2100000, category: "Marketing", score: "High", person: "Vitaly Friedman", email: "editor@smashingmag.com", guidelines: "Case-study driven blogging with deep design guidelines and responsive CSS tutorials." },
    { id: "mp-5", domain: "hubspot.com", dr: 93, traffic: 8500000, category: "Marketing", score: "High", person: "Sarah Jenkins", email: "growth@hubspot.com", guidelines: "Actionable outbound, inbound strategy guides, CRM benchmarks or lead generation tips." },
    { id: "mp-6", domain: "backlinko.com", dr: 75, traffic: 890000, category: "SEO", score: "Medium", person: "Brian Dean", email: "outreach@backlinko.com", guidelines: "Case-study driven content with high-resolution visual infographics." },
    { id: "mp-7", domain: "searchenginejournal.com", dr: 82, traffic: 1800000, category: "SEO", score: "High", person: "Marcus Vance", email: "curator@searchenginejournal.com", guidelines: "Must provide Search Console proof. Topics centered around algorithm changes, links audit, and SEO tools." },
    { id: "mp-8", domain: "searchengineland.com", dr: 80, traffic: 1200000, category: "SEO", score: "Medium", person: "Danny Sullivan", email: "editor@searchengineland.com", guidelines: "Technical audits, indexation bugs, and organic crawling guidelines." },
    { id: "mp-9", domain: "wired.com", dr: 93, traffic: 32000000, category: "Technology", score: "High", person: "Sarah Jenkins", email: "submit@wired.com", guidelines: "Future of security protocols, deep tech reviews, and decentralized internet." },
    { id: "mp-10", domain: "techradar.com", dr: 89, traffic: 14000000, category: "Technology", score: "Medium", person: "John Doe", email: "reviews@techradar.com", guidelines: "Hardware and enterprise product benchmarks." },
    { id: "mp-11", domain: "forbes.com", dr: 93, traffic: 45000000, category: "Business", score: "High", person: "Amanda Ross", email: "pitches@forbes.com", guidelines: "SaaS growth statistics and leadership methodology for startups." },
    { id: "mp-12", domain: "fastcompany.com", dr: 91, traffic: 11000000, category: "Business", score: "High", person: "Alice Jenkins", email: "growth@fastcompany.com", guidelines: "Focused on creativity, design innovation, and sustainable enterprise." },
    { id: "mp-13", domain: "coindesk.com", dr: 79, traffic: 5800000, category: "Finance", score: "High", person: "CoinMaster Admin", email: "editor@coindesk.com", guidelines: "Web3 consensus algorithms, open source protocols, and ledger solutions." }
  ];

  const [searchMode, setSearchMode] = useState<"ai" | "filters">("ai");
  const [aiQuery, setAiQuery] = useState("");
  const [aiFilterText, setAiFilterText] = useState("");

  const [domainFilter, setDomainFilter] = useState("");
  const [minDr, setMinDr] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Enrollment Selector card overlay
  const [enrollmentTarget, setEnrollmentTarget] = useState<MasterProspect | null>(null);
  const [enrollProjectID, setEnrollProjectID] = useState<string>("l-1");
  const [enrollNotes, setEnrollNotes] = useState("Acquired via vetted prospect search repository.");

  // Manual target creation fields
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualDomain, setManualDomain] = useState("");
  const [manualDr, setManualDr] = useState(60);
  const [manualTraffic, setManualTraffic] = useState("120K");
  const [manualNiche, setManualNiche] = useState("Technology");
  const [manualPerson, setManualPerson] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  // Default dataset matching your high-fidelity screenshots precisely
  const defaultLists = [
    {
      id: "l-1",
      name: "SaaS Link Building Q2",
      client: "—",
      status: "Completed",
      created: "May 15, 2026",
      progress: {
        A: { current: 5, total: 5 },
        B: { current: 42, total: 42 },
        C: { current: 42, total: 42 },
        percent: 100
      },
      results: 42
    },
    {
      id: "l-2",
      name: "Tech Blog Outreach",
      client: "—",
      status: "Completed",
      created: "May 20, 2026",
      progress: {
        A: { current: 3, total: 3 },
        B: { current: 28, total: 28 },
        C: { current: 28, total: 28 },
        percent: 100
      },
      results: 28
    },
    {
      id: "l-3",
      name: "Competitor Gap Import",
      client: "—",
      status: "Processing",
      created: "Jun 1, 2026",
      progress: {
        A: { current: 2, total: 4 },
        B: { current: 12, total: 30 },
        C: { current: 8, total: 30 },
        percent: 34
      },
      results: 30
    },
    {
      id: "l-4",
      name: "High DR Guest Posts",
      client: "Acme Corp",
      status: "Completed",
      created: "Jun 3, 2026",
      progress: {
        A: { current: 6, total: 6 },
        B: { current: 55, total: 55 },
        C: { current: 55, total: 55 },
        percent: 100
      },
      results: 55
    },
    {
      id: "l-5",
      name: "Resource Page Targets",
      client: "—",
      status: "Partial",
      created: "Jun 5, 2026",
      progress: {
        A: { current: 3, total: 3 },
        B: { current: 18, total: 18 },
        C: { current: 10, total: 18 },
        percent: 79
      },
      results: 18
    },
    {
      id: "l-6",
      name: "Niche Edit Campaign",
      client: "—",
      status: "Failed",
      created: "Jun 7, 2026",
      progress: {
        A: { current: 1, total: 2 },
        B: { current: 0, total: 0 },
        C: { current: 0, total: 0 },
        percent: 50
      },
      results: 0
    }
  ];

  // Default CRM Pipeline fallback
  const defaultProspects: ProspectCRMItem[] = [
    { id: "p-1", siteName: "Smashing Magazine", person: "Vitaly Friedman", email: "editor@smashingmag.com", stage: "Won", lastContact: "2 days ago", notes: "Skyscraper draft accepted. Outbound backlink is live and index healthy!" },
    { id: "p-2", siteName: "Wired Journal", person: "Sarah Jenkins", email: "comms@wirejournal.com", stage: "Negotiating", lastContact: "Today", notes: "Offered a premium technology review draft. Awaiting word count rules." },
    { id: "p-3", siteName: "Software Times Inc", person: "Robert Chen", email: "r.chen@softwaretimes.com", stage: "Contacted", lastContact: "Yesterday", notes: "First follow-up sent. Standard guest blogging collaboration proposal." },
    { id: "p-4", siteName: "Startup Stack Blog", person: "Amanda Ross", email: "amanda@startupstack.io", stage: "Planned", lastContact: "Never", notes: "Identified high organic traffic keyword targets. Preparing outreach template." }
  ];

  // Simulated live alerts and lists ready to launch matching screenshots
  const simulatedAlerts = [
    { id: "sa-1", name: "Niche Edit Campaign", reason: "API rate limit exceeded", action: "Resume" },
    { id: "sa-2", name: "Competitor Gap Import", reason: "Token validation failed", action: "Re-authenticate" },
    { id: "sa-3", name: "Resource Page Targets", reason: "Proxy timeout error", action: "Retry Query" }
  ];

  const simulatedLaunches = [
    { id: "sl-1", name: "SaaS Link Building Q2", count: 42, reason: "42 prospects ready for outreach", action: "Launch Campaign" },
    { id: "sl-2", name: "High DR Guest Posts", count: 55, reason: "55 prospects ready for outreach", action: "Launch Campaign" },
    { id: "sl-3", name: "Tech Blog Outreach", count: 28, reason: "28 prospects ready for outreach", action: "Launch Campaign" }
  ];

  // Run initial state loading from localStorage or fallback
  useEffect(() => {
    const saved = localStorage.getItem("link_pro_prospect_lists");
    if (saved) {
      try {
        setLists(JSON.parse(saved));
      } catch (e) {
        setLists(defaultLists);
      }
    } else {
      setLists(defaultLists);
      localStorage.setItem("link_pro_prospect_lists", JSON.stringify(defaultLists));
    }

    const savedCrm = localStorage.getItem("uprankly_crm_prospects");
    if (savedCrm) {
      try {
        setProspects(JSON.parse(savedCrm));
      } catch (e) {
        setProspects(defaultProspects);
      }
    } else {
      setProspects(defaultProspects);
      localStorage.setItem("uprankly_crm_prospects", JSON.stringify(defaultProspects));
    }
  }, []);

  const saveListsToStorage = (updated: any[]) => {
    setLists(updated);
    localStorage.setItem("link_pro_prospect_lists", JSON.stringify(updated));
  };

  const saveCrmToStorage = (updatedCrm: ProspectCRMItem[]) => {
    setProspects(updatedCrm);
    localStorage.setItem("uprankly_crm_prospects", JSON.stringify(updatedCrm));
  };

  // Switch tabs navigators
  const triggerNavigate = (tabId: string, label: string) => {
    setShowDropdown(false);
    setToast(`Navigating to group finder: ${label}...`);
    if (onTabChange) {
      setTimeout(() => onTabChange(tabId), 300);
    }
  };

  // Filter lists based on input queries
  const filteredLists = useMemo(() => {
    return lists.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lists, searchTerm, statusFilter]);

  // Bulk selector handlers
  const handleToggleAll = () => {
    if (allChecked) {
      setCheckedRows({});
    } else {
      const updated: Record<string, boolean> = {};
      filteredLists.forEach(item => {
        updated[item.id] = true;
      });
      setCheckedRows(updated);
    }
    setAllChecked(!allChecked);
  };

  const handleToggleRow = (id: string) => {
    setCheckedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Actions on lists
  const handleDeleteList = (id: string, name: string) => {
    const updated = lists.filter(item => item.id !== id);
    saveListsToStorage(updated);
    setActiveMenuId(null);
    setToast(`Archived list label: "${name}"`);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) {
      setToast("Please supply a valid list name.");
      return;
    }

    const createdList = {
      id: `l-custom-${Date.now()}`,
      name: newListName.trim(),
      client: newListClient.trim() || "—",
      status: newListStatus,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      progress: {
        A: { current: Math.max(1, Math.floor(newListOpps * 0.1)), total: Math.max(1, Math.floor(newListOpps * 0.1)) },
        B: { current: newListOpps, total: newListOpps },
        C: { current: Math.floor(newListOpps * 0.8), total: newListOpps },
        percent: newListStatus === "Completed" ? 100 : newListStatus === "Processing" ? 34 : newListStatus === "Partial" ? 79 : 50
      },
      results: newListOpps
    };

    const updated = [createdList, ...lists];
    saveListsToStorage(updated);
    setToast(`Successfully created "${newListName}" prospect label group!`);
    setShowCreateModal(false);
    setNewListName("");
    setNewListClient("");
  };

  const handleResolveAlert = (alertName: string) => {
    setToast(`Processing: Outreach resumed for "${alertName}". Connection restored.`);
  };

  const handleLaunchCampaign = (launchName: string) => {
    setToast(`Initiating outreach sequence channel for "${launchName}"... email headers queued!`);
  };

  // CRM status changes
  const handleStageChange = (id: string, newStage: ProspectCRMItem["stage"]) => {
    const updated = prospects.map(p => {
      if (p.id === id) {
        return { ...p, stage: newStage, lastContact: "Just now" };
      }
      return p;
    });
    saveCrmToStorage(updated);
    setToast(`Updated pipeline stage for target to ${newStage}!`);
  };

  const handleCrmDelete = (id: string) => {
    const updated = prospects.filter(p => p.id !== id);
    saveCrmToStorage(updated);
    setToast("Target opportunity removed from CRM pipeline.");
  };

  // Add custom target to CRM
  const handleCreateCustomCRMTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDomain || !manualEmail) {
      setToast("Please supply at least a domain name and contact email.");
      return;
    }
    const cleanDomain = manualDomain.trim().toLowerCase();
    const newTarget: ProspectCRMItem = {
      id: `p-manual-${Date.now()}`,
      siteName: cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1),
      person: manualPerson || "Admin Editor",
      email: manualEmail.trim().toLowerCase(),
      stage: "Planned",
      lastContact: "Never",
      notes: `Manually enrolled target. Niche: ${manualNiche}, DR: ${manualDr}, Traffic: ${manualTraffic}`
    };
    const updated = [newTarget, ...prospects];
    saveCrmToStorage(updated);
    setToast(`Target '${cleanDomain}' manually appended to active prospects pipeline!`);
    
    // Clear State
    setManualDomain("");
    setManualEmail("");
    setManualPerson("");
    setShowManualAdd(false);
  };

  // Curated target enrollment
  const confirmEnrollment = () => {
    if (!enrollmentTarget) return;
    
    const matchedListName = lists.find(l => l.id === enrollProjectID)?.name || "SaaS Link Building Q2";
    
    const isDuplicate = prospects.some(p => 
      p.email.toLowerCase() === enrollmentTarget.email.toLowerCase() || 
      p.siteName.toLowerCase().includes(enrollmentTarget.domain.toLowerCase())
    );

    if (isDuplicate) {
      setToast(`'${enrollmentTarget.domain}' is already active in your relationship list.`);
      setEnrollmentTarget(null);
      return;
    }

    const newProspect: ProspectCRMItem = {
      id: `p-enrolled-${Date.now()}`,
      siteName: enrollmentTarget.domain.charAt(0).toUpperCase() + enrollmentTarget.domain.slice(1),
      person: enrollmentTarget.person,
      email: enrollmentTarget.email,
      stage: "Planned",
      lastContact: "Never",
      notes: `Target enrolled under prospect list [${matchedListName}]. DR: ${enrollmentTarget.dr}. Category: ${enrollmentTarget.category}. Notes: ${enrollNotes}`
    };

    const updated = [...prospects, newProspect];
    saveCrmToStorage(updated);
    setToast(`Successfully added '${enrollmentTarget.domain}' to '${matchedListName}' Prospect List!`);
    setEnrollmentTarget(null);
  };

  // Format Helper
  const formatCompactValue = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    return num.toString();
  };

  // Helper selectors
  const isAlreadyInCRM = (domain: string) => {
    return prospects.some(p => p.siteName.toLowerCase().includes(domain.toLowerCase()) || p.email.toLowerCase().includes(domain.toLowerCase()));
  };

  // NLP and traditional filtered curated prospects
  const filteredProspects = useMemo(() => {
    let items = [...PREDEFINED_PROSPECT_RECORDS];

    if (searchMode === "ai" && aiFilterText) {
      const q = aiFilterText.toLowerCase().trim();

      const drMatch = q.match(/dr\s*(?:above|>|>=|\+)?\s*([0-9]+)/i);
      const drMatchGeneric = q.match(/(?:above|>|>=|\+)?\s*([0-9]+)\s*dr/i);
      const finalDr = drMatch || drMatchGeneric;
      if (finalDr) {
        const threshold = parseInt(finalDr[1], 10);
        if (!isNaN(threshold)) {
          items = items.filter(i => i.dr >= threshold);
        }
      }

      const trafficMatch = q.match(/([0-9.]+)\s*(m|k)\+?\s*traffic/i);
      if (trafficMatch) {
        let val = parseFloat(trafficMatch[1]);
        if (trafficMatch[2].toLowerCase() === "m") val *= 1000000;
        else if (trafficMatch[2].toLowerCase() === "k") val *= 1000;
        items = items.filter(i => i.traffic >= val);
      }

      const categoriesList = ["technology", "marketing", "seo", "news", "media", "business", "finance"];
      const matchedCategories = categoriesList.filter(c => q.includes(c));
      
      if (matchedCategories.length > 0) {
        items = items.filter(i => 
          matchedCategories.some(cat => i.category.toLowerCase().includes(cat))
        );
      }

      const nonMetricWords = q.split(/\s+/).filter(w => !w.includes("dr") && !w.includes("traffic") && isNaN(parseInt(w, 10)));
      if (nonMetricWords.length > 0) {
        items = items.filter(i => 
          nonMetricWords.some(word => i.domain.toLowerCase().includes(word) || i.category.toLowerCase().includes(word))
        );
      }
    } else if (searchMode === "filters") {
      if (domainFilter) {
        items = items.filter(i => i.domain.toLowerCase().includes(domainFilter.toLowerCase()));
      }
      if (minDr > 0) {
        items = items.filter(i => i.dr >= minDr);
      }
      if (selectedCategory !== "All") {
        items = items.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase());
      }
    }

    return items;
  }, [searchMode, aiFilterText, domainFilter, minDr, selectedCategory]);


  // Calculate dynamic stats
  const activeListsCount = isEmptyState ? 0 : lists.length;
  const oppsCount = isEmptyState ? 0 : lists.reduce((sum, item) => sum + (Number(item.results) || 0), 0);
  const readyNowCount = isEmptyState ? 0 : 125;
  const inCampaignCount = isEmptyState ? 0 : lists.filter(item => item.status === "Processing" || item.status === "Partial").reduce((sum, item) => sum + (Number(item.results) || 27), 0);
  const linksWonCount = isEmptyState ? 0 : 5;

  return (
    <div className="space-y-6 animate-fade-in" id="prospect-master-canvas">
      
      {/* Visual Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200/60 pb-1.5 gap-4" id="prospect-view-tab-bar">
        <button
          onClick={() => { setActiveSubTab("projects"); }}
          className={`pb-2 px-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === "projects" ? "text-teal-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
          id="tab-btn-projects"
        >
          <Database className="w-4 h-4 shrink-0 pointer-events-none" />
          <span>Prospect Lists Workspace ({activeListsCount})</span>
          {activeSubTab === "projects" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0d9488] rounded-full" />
          )}
        </button>

        <button
          onClick={() => { setActiveSubTab("repository"); }}
          className={`pb-2 px-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === "repository" ? "text-teal-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
          id="tab-btn-repository"
        >
          <Globe className="w-4 h-4 shrink-0 pointer-events-none" />
          <span>Vetted Prospects Directory ({filteredProspects.length})</span>
          {activeSubTab === "repository" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0d9488] rounded-full" />
          )}
        </button>

        <button
          onClick={() => { setActiveSubTab("crm"); }}
          className={`pb-2 px-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeSubTab === "crm" ? "text-teal-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
          id="tab-btn-crm"
        >
          <Users className="w-4 h-4 shrink-0 pointer-events-none" />
          <span>Outreach Relations CRM ({prospects.length})</span>
          {activeSubTab === "crm" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0d9488] rounded-full" />
          )}
        </button>
      </div>

      {/* TAB CONTENT 1: PROSPECT LISTS OVERVIEW */}
      {activeSubTab === "projects" && (
        <div className="space-y-6 animate-fade-in" id="prospect-lists-overview-section">
          
          {/* 1. Header Row Panel with Dropdown logic */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-40" id="prospects-header-panel">
            <div>
              <h1 className="text-2xl font-sans font-extrabold text-[#0b1c30] tracking-tight flex items-center gap-2">
                Prospect Lists
              </h1>
              <p className="text-xs text-[#6d7a77] font-medium leading-relaxed mt-1">
                Research, organize, review, and convert opportunities into outreach campaigns.
              </p>
            </div>

            {/* Create List dropdown trigger button action block */}
            <div className="relative inline-block text-left w-full sm:w-auto" id="create-list-dropdown-container">
              <button 
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0d9488] hover:bg-[#008276] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                id="create-list-menu-btn"
              >
                <Plus className="w-4 h-4 font-extrabold" />
                <span>Create List</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {/* Screenshot Dropdown Overlay menu exactly matching design */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 shrink-0 transition-all origin-top-right scale-100 focus:outline-none z-50 animate-slide-down">
                  <div className="pb-3 border-b border-slate-100 mb-2">
                    <h3 className="text-xs font-sans font-black text-slate-800 uppercase tracking-wider">Choose a prospecting method</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Find sites to add to your prospect list</p>
                  </div>

                  <div className="space-y-1" id="methods-list">
                    <button
                      type="button"
                      onClick={() => triggerNavigate("keyword-prospecting", "Keyword Prospecting")}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-start gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800">Keyword Prospecting</h5>
                        <p className="text-[10px] text-slate-500 leading-tight">Find sites via Google SERP keyword analysis</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerNavigate("vetted-sites", "Vetted Sites")}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-start gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800">Vetted Sites</h5>
                        <p className="text-[10px] text-slate-500 leading-tight">Browse our curated site database</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerNavigate("competitor-opportunities", "Competitor Opportunities")}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-start gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800">Competitor Opportunities</h5>
                        <p className="text-[10px] text-slate-500 leading-tight">Import link gaps from competitor analysis</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerNavigate("my-list", "My List")}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-start gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800">My List</h5>
                        <p className="text-[10px] text-slate-500 leading-tight">Add from your uploaded inventory</p>
                      </div>
                    </button>

                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          setShowCreateModal(true);
                        }}
                        className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg text-center cursor-pointer block border border-slate-200"
                      >
                        + Create Custom Local Label
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Numerical Row of 5 Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="prospects-metrics-grid">
            <div className="bg-white p-5 rounded-2xl border border-slate-150/60 shadow-sm flex items-center justify-between" id="metric-active-lists">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans block">Active Lists</span>
                <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{activeListsCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shadow-xs">
                <Database className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-150/60 shadow-sm flex items-center justify-between" id="metric-opportunities">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans block">Opportunities</span>
                <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{oppsCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shadow-xs">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-150/60 shadow-sm flex items-center justify-between" id="metric-ready-now">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans block">Ready Now</span>
                <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{readyNowCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50/50 text-teal-600 flex items-center justify-center shadow-xs">
                <Rocket className="w-5 h-5 text-teal-500" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-150/60 shadow-sm flex items-center justify-between animate-pulse-light animate-duration-slow" id="metric-in-campaign">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans block">In Campaign</span>
                <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{inCampaignCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shadow-xs">
                <Megaphone className="w-5 h-5 text-slate-500" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-150/60 shadow-sm flex items-center justify-between col-span-2 md:col-span-1" id="metric-links-won">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans block">Links Won</span>
                <span className="text-3xl font-extrabold text-[#006056] mt-1 block">{linksWonCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#eefdfa] text-teal-700 flex items-center justify-center shadow-xs">
                <Trophy className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </div>

          {/* 3. Alerts & Launched Campaign Quick Tracks Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="status-quicktracks-row">
            
            {/* Action Required Alert widget with arrow controllers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-xs" id="quicktrack-action-required">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-rose-600 font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    Action Required
                  </span>
                  <span className="bg-rose-50 text-rose-700 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-100 shrink-0">
                    3 Alerts
                  </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]" id="pager-alert-cycles">
                  <button 
                    onClick={() => setAlertIndex(prev => (prev === 0 ? simulatedAlerts.length - 1 : prev - 1))}
                    className="p-1 hover:bg-slate-50 hover:text-slate-700 rounded transition-colors"
                    title="Previous alert"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-slate-500">1-1 of 3</span>
                  <button 
                    onClick={() => setAlertIndex(prev => (prev === simulatedAlerts.length - 1 ? 0 : prev + 1))}
                    className="p-1 hover:bg-slate-50 hover:text-slate-700 rounded transition-colors"
                    title="Next alert"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Alert Card */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                    <RotateCcw className="w-4 h-4 text-slate-500 animate-spin-hover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
                      <span className="text-sm font-sans font-black text-slate-800">{simulatedAlerts[alertIndex].name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{simulatedAlerts[alertIndex].reason}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleResolveAlert(simulatedAlerts[alertIndex].name)}
                  className="px-4 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-bold rounded-lg transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  {simulatedAlerts[alertIndex].action}
                </button>
              </div>
            </div>

            {/* Ready to Launch Campaigns widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-xs" id="quicktrack-ready-launch">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-teal-700 font-bold uppercase tracking-wider">
                    <Rocket className="w-4 h-4 text-teal-500 shrink-0" />
                    Ready to Launch
                  </span>
                  <span className="bg-teal-50 text-teal-700 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-teal-100 shrink-0">
                    3 Lists
                  </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]" id="pager-launch-cycles">
                  <button 
                    onClick={() => setLaunchIndex(prev => (prev === 0 ? simulatedLaunches.length - 1 : prev - 1))}
                    className="p-1 hover:bg-slate-50 hover:text-slate-700 rounded transition-colors"
                    title="Previous list"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-slate-500">1-1 of 3</span>
                  <button 
                    onClick={() => setLaunchIndex(prev => (prev === simulatedLaunches.length - 1 ? 0 : prev + 1))}
                    className="p-1 hover:bg-slate-50 hover:text-slate-700 rounded transition-colors"
                    title="Next list"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Launch Card */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
                    <Rocket className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-sm font-sans font-black text-slate-800">{simulatedLaunches[launchIndex].name}</span>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{simulatedLaunches[launchIndex].reason}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchCampaign(simulatedLaunches[launchIndex].name)}
                  className="px-4 py-1.5 bg-[#0d9488] hover:bg-[#008276] text-white text-xs font-bold rounded-lg transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            </div>
          </div>

          {/* 4. Filter actions search header bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-150/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4" id="table-filters-container">
            <div className="relative w-full sm:max-w-md" id="search-input-frame">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lists..."
                className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-slate-800 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3 w-full sm:w-auto" id="filter-util-buttons">
              {/* Status filter select pill */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2 pr-8 rounded-xl text-xs focus:outline-none cursor-pointer"
                  id="status-filter-dropdown"
                >
                  <option value="All">Status: All</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Partial">Partial</option>
                  <option value="Failed">Failed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sync Refresh trigger */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setToast("Refreshed latest prospect lists sync.");
                }}
                className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer shrink-0"
                title="Refresh database state"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Screenshot Demo Empty state toggle pill button */}
              <button
                type="button"
                onClick={() => {
                  setIsEmptyState(!isEmptyState);
                  setToast(isEmptyState ? "Loaded active lists data" : "Demonstrating empty lists layout");
                }}
                className={`px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  isEmptyState 
                    ? "bg-slate-850 text-white hover:bg-slate-900 border border-slate-700" 
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-transparent"
                }`}
                title="Toggle simulated empty table dashboard layout"
                id="toggle-empty-state-btn"
              >
                Show Empty State
              </button>
            </div>
          </div>

          {/* 5. Main Prospect Lists Table Panel */}
          <div className="bg-white rounded-2xl border border-slate-150/80 shadow-xs overflow-hidden" id="prospect-table-carrier">
            
            {isEmptyState ? (
              /* Empty state view matching exact requirements if toggled or list has 0 length */
              <div className="py-20 text-center" id="empty-lists-showcase">
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold font-sans text-slate-800">No prospect list collections found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto px-4 leading-relaxed">
                  Create a labeled prospect list folder manually or search/scrape sites using Google SERP keywords prospecting methods.
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    + Create custom list
                  </button>
                  <button
                    onClick={() => triggerNavigate("keyword-prospecting", "Keyword Prospecting")}
                    className="px-4 py-2 bg-[#0d9488] hover:bg-[#008276] text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Keyword Search Pro
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-150/40 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <th className="p-4 pl-6 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={allChecked} 
                          onChange={handleToggleAll}
                          className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488] h-3.5 w-3.5 cursor-pointer"
                        />
                      </th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created</th>
                      <th className="p-4 text-center">Progress (A / B / C)</th>
                      <th className="p-4 text-right pr-6 md:w-28 text-[#0d9488]">Results</th>
                      <th className="p-4 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredLists.length > 0 ? (
                      filteredLists.map((item) => {
                        const isRowChecked = !!checkedRows[item.id];
                        return (
                          <tr 
                            key={item.id} 
                            className={`hover:bg-slate-50/30 transition-colors ${isRowChecked ? "bg-slate-50/20" : ""}`}
                            id={`list-row-${item.id}`}
                          >
                            {/* Checkbox */}
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isRowChecked}
                                onChange={() => handleToggleRow(item.id)}
                                className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488] h-3.5 w-3.5 cursor-pointer"
                              />
                            </td>

                            {/* Name */}
                            <td className="p-4 text-slate-900 font-black text-sm">
                              <span className="hover:text-teal-700 transition-colors cursor-pointer block max-w-xs truncate">
                                {item.name}
                              </span>
                            </td>

                            {/* Client */}
                            <td className="p-4 text-slate-400">
                              {item.client}
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span className={`text-[10px] font-sans font-black px-2.5 py-1 rounded-full border tracking-wide uppercase shrink-0 ${
                                item.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                item.status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-100 animate-pulse" :
                                item.status === "Partial" ? "bg-pink-50 text-pink-700 border-pink-100" :
                                "bg-rose-50 text-rose-700 border-rose-200"
                              }`}>
                                {item.status}
                              </span>
                            </td>

                            {/* Created Date */}
                            <td className="p-4 text-slate-400 font-sans">
                              {item.created}
                            </td>

                            {/* Progress phase pills A b c */}
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded border border-blue-100 shrink-0 select-none">
                                  A {item.progress.A.current}/{item.progress.A.total}
                                </span>
                                <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded border border-blue-100 shrink-0 select-none">
                                  B {item.progress.B.current}/{item.progress.B.total}
                                </span>
                                <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded border border-blue-100 shrink-0 select-none">
                                  C {item.progress.C.current}/{item.progress.C.total}
                                </span>
                                <span className="text-[11px] text-slate-400 font-black ml-1 font-sans shrink-0">
                                  {item.progress.percent}%
                                </span>
                              </div>
                            </td>

                            {/* Results bolder indicator */}
                            <td className="p-4 text-right pr-6 font-sans text-sm font-extrabold shrink-0">
                              {item.results > 0 ? (
                                <span className="text-emerald-600">
                                  {item.results}
                                </span>
                              ) : (
                                <span className="text-slate-500">
                                  0
                                </span>
                              )}
                            </td>

                            {/* Options button with menu dropdown */}
                            <td className="p-4 text-center relative">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                title="List Options"
                                id={`option-btn-${item.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {activeMenuId === item.id && (
                                <div className="absolute right-6 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-150 p-2 z-50 text-left">
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setToast(`Details: ${item.name} currently contains ${item.results} prospects.`);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded text-slate-700 text-xs font-semibold"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      const name = prompt("Enter new name for list label:", item.name);
                                      if (name) {
                                        const updated = lists.map(l => l.id === item.id ? { ...l, name } : l);
                                        saveListsToStorage(updated);
                                        setToast(`Renamed list label to "${name}"`);
                                      }
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded text-slate-700 text-xs font-semibold"
                                  >
                                    Rename Label
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      const clientName = prompt("Enter Client association name:", item.client === "—" ? "" : item.client);
                                      if (clientName !== null) {
                                        const updated = lists.map(l => l.id === item.id ? { ...l, client: clientName || "—" } : l);
                                        saveListsToStorage(updated);
                                        setToast(`Modified Client attribution of "${item.name}"`);
                                      }
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded text-slate-700 text-xs font-semibold"
                                  >
                                    Edit Client
                                  </button>
                                  <div className="border-t border-slate-100 my-1" />
                                  <button
                                    onClick={() => handleDeleteList(item.id, item.name)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-rose-50 rounded text-rose-600 text-xs font-bold"
                                  >
                                    Delete / Archive
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No prospect lists match your current filter keywords.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. Dynamic Bottom Panels Row (Insights + Activity Streams) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4" id="insights-activity-flex">
            
            {/* Link Pro Insights - Celestial Slate Card styling */}
            <div className="bg-[#0b1c30] text-slate-100 p-6 rounded-2xl shadow-md border border-slate-800 space-y-4" id="link-pro-insights-box">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                <h3 className="text-xs font-sans font-black uppercase tracking-wider text-teal-300">Link Pro Insights</h3>
              </div>

              <div className="space-y-3" id="insights-list-box">
                {/* Best Source card */}
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Best Source</span>
                    <span className="font-extrabold text-slate-200 mt-1 block">Competitor Gap</span>
                  </div>
                  <span className="bg-emerald-900/40 text-emerald-300 font-bold px-2 py-1 rounded border border-emerald-800">
                    +24% conversion rate
                  </span>
                </div>

                {/* Highest Quality card */}
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Highest Quality List</span>
                    <span className="font-extrabold text-slate-200 mt-1 block">High DR Guest Posts</span>
                  </div>
                  <span className="bg-teal-500/10 text-teal-300 font-bold px-2 py-1 rounded border border-teal-500/20">
                    55 prospects
                  </span>
                </div>

                {/* Recommendation card */}
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Recommendation</span>
                    <span className="font-extrabold text-slate-200 mt-1 block">Launch SaaS Link Building Q2</span>
                  </div>
                  <span className="bg-indigo-950/40 text-indigo-300 font-bold px-2 py-1 rounded border border-indigo-900">
                    42 prospects ready
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity lists timeline flow with color dots */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4" id="recent-activity-box">
              <div className="pb-1 border-b border-slate-100">
                <h3 className="text-xs font-sans font-black uppercase tracking-wider text-slate-800">Recent Activity</h3>
              </div>

              <div className="space-y-4 font-sans text-xs text-slate-600" id="activity-timeline">
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-extrabold text-slate-800">34 prospects</span> enriched for <span className="text-slate-800 underline font-bold cursor-pointer">SaaS Link Building Q2</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-extrabold text-slate-800">12 contacts</span> found for <span className="text-slate-800 underline font-bold cursor-pointer">Tech Blog Outreach</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-extrabold text-[#006056]">7 prospects</span> approved by AI
                    <p className="text-[10px] text-slate-400 mt-0.5">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-slate-800">New report generated</span> for <span className="text-slate-800 underline font-bold cursor-pointer font-sans">Competitor Gap Import</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">3 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-slate-800">Competitor data refreshed</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: curated prospects finder directory */}
      {activeSubTab === "repository" && (
        <div className="space-y-6 animate-fade-in" id="vetted-prospects-directory-section">
          
          {/* Enrollment Selector card overlay if one is selected */}
          {enrollmentTarget && (
            <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-lg border border-teal-800 space-y-4" id="enrollment-wizard-box">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-extrabold font-sans text-teal-200">Enroll Prospect Target into Prospect List</h3>
                  <p className="text-[11px] text-teal-100">Configure client assignment for: <span className="font-mono font-bold underline">{enrollmentTarget.domain}</span></p>
                </div>
                <button 
                  onClick={() => setEnrollmentTarget(null)}
                  className="p-1 hover:bg-teal-800 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-teal-200 tracking-wider mb-1">Target Prospect List</label>
                  <select
                    value={enrollProjectID}
                    onChange={(e) => setEnrollProjectID(e.target.value)}
                    className="w-full bg-teal-800 text-white border border-teal-700 rounded-lg p-2 font-bold focus:outline-none"
                    id="enroll-project-dropdown"
                  >
                    {lists.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.client})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-teal-200 tracking-wider mb-1">Campaign Strategy Notes / Goal</label>
                  <input
                    type="text"
                    value={enrollNotes}
                    onChange={(e) => setEnrollNotes(e.target.value)}
                    placeholder="e.g. Broken link post, skyscraper draft column, business quote"
                    className="w-full bg-teal-800 text-white border border-teal-700 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEnrollmentTarget(null)}
                  className="px-4 py-1.5 bg-transparent hover:bg-teal-850 hover:text-white text-teal-100 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmEnrollment}
                  className="px-5 py-1.5 bg-[#0d9488] hover:bg-[#0b8377] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  id="enroll-confirm-btn"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Enrollment</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Manual Add target subform */}
          {showManualAdd && (
            <form onSubmit={handleCreateCustomCRMTarget} className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs space-y-4 animate-fade-in" id="manual-add-form-expanded">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <div className="flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-[#0d9488]" />
                  <span className="text-xs font-bold text-slate-800 tracking-wide uppercase font-sans">Add Custom Vetted Publisher</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowManualAdd(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Domain Name *</label>
                  <input
                    type="text"
                    required
                    value={manualDomain}
                    onChange={(e) => setManualDomain(e.target.value)}
                    placeholder="e.g. exampleblog.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0d9488]"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="e.g. collabs@exampleblog.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={manualPerson}
                    onChange={(e) => setManualPerson(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Domain Rating (DR)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={manualDr}
                    onChange={(e) => setManualDr(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-[#0d9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Organic Monthly Traffic</label>
                  <input
                    type="text"
                    value={manualTraffic}
                    onChange={(e) => setManualTraffic(e.target.value)}
                    placeholder="e.g. 240K"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Target Niche</label>
                  <select
                    value={manualNiche}
                    onChange={(e) => setManualNiche(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="News/Media">News/Media</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div className="flex items-end gap-2 text-xs">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0d9488] hover:bg-[#0b8377] text-white text-xs font-bold rounded-lg cursor-pointer"
                    id="submit-manual-target"
                  >
                    Enroll Custom Target
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManualAdd(false)}
                    className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Prompt search bar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4" id="nlp-search-container">
            <div className="flex items-center justify-between border-b border-slate-150 pb-2">
              <div className="flex gap-2" id="filter-tab-bar">
                <button
                  onClick={() => setSearchMode("ai")}
                  className={`pb-2 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                    searchMode === "ai"
                      ? "border-text-[#0d9488] text-[#0d9488] border-[#0d9488]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                  id="ai-search-toggle"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>AI Search Prompt</span>
                </button>
                <button
                  onClick={() => setSearchMode("filters")}
                  className={`pb-2 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                    searchMode === "filters"
                      ? "border-text-[#0d9488] text-[#0d9488] border-[#0d9488]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                  id="manual-filters-toggle"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Standard Filters</span>
                </button>
              </div>

              <button
                onClick={() => setShowManualAdd(!showManualAdd)}
                className="px-3 py-1 border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-800 text-[11px] rounded-lg font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3 text-teal-600" />
                <span>Add Custom Target</span>
              </button>
            </div>

            {searchMode === "ai" ? (
              <div className="space-y-2" id="ai-nlp-wrapper">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAiFilterText(aiQuery);
                    setToast(`Aetheric query applied: "${aiQuery}"`);
                  }} 
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Sparkles className="w-4 h-4 text-[#0d9488] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder='e.g. "DR 80+ in technology niche" or "marketing articles above 50 dr"'
                      className="w-full bg-[#f8f9ff] pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-[#0d9488] transition-all font-medium text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0b8377] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                    id="search-btn-primary"
                  >
                    <Search className="w-3.5 h-3.5 font-bold" />
                    <span>Search</span>
                  </button>
                </form>
                <p className="text-[10px] text-slate-400 font-mono">
                  Describe metrics and niches in plain English. Powered by local metric parser filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1" id="manual-filters-row">
                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-1">Domain Search</label>
                  <input
                    type="text"
                    value={domainFilter}
                    onChange={(e) => setDomainFilter(e.target.value)}
                    placeholder="e.g. nytimes.com"
                    className="w-full bg-[#f8f9ff] text-slate-700 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#0d9488]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-1">Min Domain Rating ({minDr}+)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={minDr}
                    onChange={(e) => setMinDr(Number(e.target.value))}
                    className="w-full mt-2 accent-[#0d9488] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-1">Niche Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#f8f9ff] text-slate-700 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#0d9488]"
                  >
                    <option value="All">All Niches</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="News/Media">News/Media</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setDomainFilter("");
                      setMinDr(0);
                      setSelectedCategory("All");
                      setToast("Reset search conditions.");
                    }}
                    className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-lg w-full cursor-pointer transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vetted List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="vetted-prospects-container">
            <div className="overflow-x-auto">
              {filteredProspects.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse" id="curated-prospect-table">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[#6d7a77] font-semibold uppercase text-[10px]">
                      <th className="p-4 pl-6 text-slate-700">Domain Publisher</th>
                      <th className="p-4 text-center text-slate-700 font-bold">DR</th>
                      <th className="p-4 text-center text-slate-700">Traffic</th>
                      <th className="p-4 text-slate-700">Category</th>
                      <th className="p-4 text-center text-slate-700 font-sans">Priority Score</th>
                      <th className="p-4 text-slate-700">Contact / Editor</th>
                      <th className="p-4 pr-6 text-center text-slate-700 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {filteredProspects.map((site) => {
                      const exists = isAlreadyInCRM(site.domain);
                      return (
                        <tr key={site.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4 pl-6 font-bold text-slate-800 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-900 font-sans">{site.domain}</span>
                              <a
                                href={`https://${site.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-[#0d9488]"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-normal font-sans pt-0.5 max-w-sm leading-tight">
                              {site.guidelines}
                            </span>
                          </td>
                          
                          <td className="p-4 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[11px]">
                              {site.dr}
                            </span>
                          </td>

                          <td className="p-4 text-center font-mono text-slate-600 font-bold">
                            {formatCompactValue(site.traffic)}
                          </td>

                          <td className="p-4">
                            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-150">
                              {site.category}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              site.score === "High" ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              {site.score}
                            </span>
                          </td>

                          <td className="p-4 text-slate-700">
                            <div className="font-bold">{site.person}</div>
                            <span className="text-[10px] text-slate-400 font-mono block leading-none">{site.email}</span>
                          </td>

                          <td className="p-4 pr-6 text-center">
                            {exists ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Active in CRM</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setEnrollmentTarget(site);
                                  setEnrollNotes(`Direct partner target for category ${site.category}`);
                                  window.scrollTo({ top: 120, behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 bg-teal-50 hover:bg-[#0d9488] hover:text-white text-[#0d9488] text-[11px] font-bold rounded-lg transition-all cursor-pointer border border-teal-150 flex items-center justify-center gap-1 mx-auto"
                                title="Add this prospect to customizable project lists"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to List</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center text-slate-400" id="no-filtered-data">
                  <Globe className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-80" />
                  <p className="text-sm font-bold text-slate-600">No vetted publisher matches your filters</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Try searching a general word like &quot;technology&quot; or resetting the Domain Rating (DR) range bar slider!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: RELATION PIPELINE STAGES */}
      {activeSubTab === "crm" && (
        <div className="space-y-6 animate-fade-in" id="crm-pipeline-stages-section">
          {/* CRM table card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="crm-table-card">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Active Partner Ledger</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full font-mono">
                {prospects.filter(p => p.stage === "Won").length} links secured
              </span>
            </div>

            <div className="overflow-x-auto">
              {prospects.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20 border-b border-slate-100 text-[#6d7a77] font-semibold">
                      <th className="p-4 pl-6">Prospecting Destination</th>
                      <th className="p-4">Contact Authority</th>
                      <th className="p-4 text-center font-bold">Pipeline Progress Stage</th>
                      <th className="p-4">Last Interaction Logs</th>
                      <th className="p-4 md:w-80">Chronology strategy notes</th>
                      <th className="p-4 pr-6 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {prospects.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                        <td className="p-4 pl-6 font-bold text-slate-800">
                          <div className="flex items-center gap-1">
                            <span>{item.siteName}</span>
                            <a
                              href={`https://${item.siteName.toLowerCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-teal-600"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.email}</span>
                        </td>
                        <td className="p-4 text-slate-600">{item.person}</td>
                        <td className="p-4 text-center">
                          <select
                            value={item.stage}
                            onChange={(e) => handleStageChange(item.id, e.target.value as any)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer focus:outline-none border border-slate-200 ${
                              item.stage === "Won" ? "bg-emerald-50 text-emerald-700 border-l-4 border-l-emerald-500" :
                              item.stage === "Negotiating" ? "bg-amber-50 text-amber-700 border-l-4 border-l-amber-500" :
                              item.stage === "Contacted" ? "bg-indigo-50 text-indigo-700 border-l-4 border-l-indigo-500" :
                              item.stage === "Rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            <option value="Planned">Planned</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Negotiating">Negotiating</option>
                            <option value="Won">Won</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-4 font-mono text-slate-500">{item.lastContact}</td>
                        <td className="p-4 text-slate-500 leading-normal text-[11px] truncate max-w-xs" title={item.notes}>
                          {item.notes}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleCrmDelete(item.id)}
                            className="p-1 px-2.5 hover:bg-rose-50 text-rose-500 rounded font-bold cursor-pointer transition-all border border-transparent hover:border-rose-100"
                            title="Remove target from this crm pipeline"
                          >
                            Archive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center text-slate-400" id="empty-pipeline">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">Your relationship pipeline is completely empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Go to the Vetted Prospects directory tab and click &quot;Add to List&quot; to enroll publishers into this CRM workflow!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Lists Creation modal popup */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="creation-modal-backdrop">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-scale-up" id="creation-modal-block">
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-sans font-extrabold text-slate-900 flex items-center gap-2 mb-2">
              <PlusCircle className="w-5 h-5 text-teal-600" />
              <span>Create Prospect List Label</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Add a custom label for grouping prospect sites. You can add prospects to this list through Google search or competitor imports.
            </p>

            <form onSubmit={handleCreateList} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. SaaS Link Building Q2, FinTech Outreach"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0d9488] text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Client Attribution</label>
                <input
                  type="text"
                  value={newListClient}
                  onChange={(e) => setNewListClient(e.target.value)}
                  placeholder="e.g. Acme Corp (or leave blank)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0d9488]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Initial Status</label>
                  <select
                    value={newListStatus}
                    onChange={(e) => setNewListStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Partial">Partial</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Prospect Count</label>
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={newListOpps}
                    onChange={(e) => setNewListOpps(Number(e.target.value))}
                    className="w-full bg-[#f8f9ff] border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d9488] hover:bg-[#008276] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
