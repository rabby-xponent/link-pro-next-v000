"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
import { LocalToast, getProjectsList } from "@/components/app/link-pro/shared/prospect-shared";

export function VettedSitesView() {
  // 1. Extended Mock Database of Vetted High-DA Publisher Partners
  interface ExtendedVettedSite {
    id: string;
    domain: string;
    categories: string[];
    niche: string;
    dr: number;
    traffic: string;
    trafficNum: number;
    spamScore: number;
    backlinks: number;
    refDomains: number;
    postPrice: number;
    contactEmail: string;
    contactName: string;
    isUnlocked: boolean;
    editorialReviewDays: number;
    maxOutboundLinks: number;
    socialFollowers: string;
    guidelines: string;
    recentRankings: string[];
  }

  const [sites, setSites] = useState<ExtendedVettedSite[]>([
    {
      id: "v-1",
      domain: "techcrunch-digital.com",
      categories: ["Technology", "SaaS"],
      niche: "SaaS Dev Tools",
      dr: 89,
      traffic: "3.5M",
      trafficNum: 3500000,
      spamScore: 1,
      backlinks: 1240000,
      refDomains: 15400,
      postPrice: 420,
      contactEmail: "editor@techcrunch-digital.com",
      contactName: "Alice Jenkins",
      isUnlocked: false,
      editorialReviewDays: 5,
      maxOutboundLinks: 1,
      socialFollowers: "220K",
      guidelines: "Articles must strictly exceed 1,500 words. Subject matter must cover enterprise SaaS architectures, cloud storage, or automated pipelines. No software referral sales copy.",
      recentRankings: ["enterprise saas tools", "cloud orchestration guide", "automated pipelines build"]
    },
    {
      id: "v-2",
      domain: "saasfounder-weekly.com",
      categories: ["SaaS", "Marketing"],
      niche: "SEO Strategies",
      dr: 76,
      traffic: "480K",
      trafficNum: 480000,
      spamScore: 2,
      backlinks: 180000,
      refDomains: 2300,
      postPrice: 280,
      contactEmail: "pitches@saasfounder-weekly.com",
      contactName: "Marcus Vance",
      isUnlocked: false,
      editorialReviewDays: 3,
      maxOutboundLinks: 2,
      socialFollowers: "45K",
      guidelines: "Case-study driven blogging only. Must supply real Google Search Console metrics screenshot. Backlinks must be contextual and point to trusted non-spam resources.",
      recentRankings: ["saas founder interviews", "b2b bootstrapper handbook", "organic growth seo case study"]
    },
    {
      id: "v-3",
      domain: "growthmentor-seo.com",
      categories: ["SaaS", "Marketing"],
      niche: "Link Building",
      dr: 67,
      traffic: "140K",
      trafficNum: 140000,
      spamScore: 1,
      backlinks: 84000,
      refDomains: 1100,
      postPrice: 190,
      contactEmail: "partners@growthmentor-seo.com",
      contactName: "Debra Stone",
      isUnlocked: true,
      editorialReviewDays: 4,
      maxOutboundLinks: 1,
      socialFollowers: "12K",
      guidelines: "Focuses on advanced marketing strategies for early-stage bootstrapped teams. Prefers ultimate guide format with detailed actionable subheadings and interactive code code blocks.",
      recentRankings: ["backlink outreach rules", "painless link indexing", "growth mentoring tutorials"]
    },
    {
      id: "v-4",
      domain: "fintech-pioneer.org",
      categories: ["Finance"],
      niche: "Crypto Ledger",
      dr: 78,
      traffic: "550K",
      trafficNum: 550000,
      spamScore: 3,
      backlinks: 290000,
      refDomains: 3100,
      postPrice: 350,
      contactEmail: "press@fintech-pioneer.org",
      contactName: "Julian Forbes",
      isUnlocked: false,
      editorialReviewDays: 6,
      maxOutboundLinks: 1,
      socialFollowers: "78K",
      guidelines: "Accepts modern financial technology analysis. Focuses heavily on open banking protocols, decentralized ledger scalability, and digital asset custodian rules.",
      recentRankings: ["fintech trends c-suite", "open banking layers", "ledger security standards"]
    },
    {
      id: "v-5",
      domain: "lifestyle-bloom.net",
      categories: ["Lifestyle"],
      niche: "Eco Travel",
      dr: 64,
      traffic: "620K",
      trafficNum: 620000,
      spamScore: 4,
      backlinks: 92000,
      refDomains: 950,
      postPrice: 150,
      contactEmail: "editorial@lifestyle-bloom.net",
      contactName: "Fiona Rose",
      isUnlocked: true,
      editorialReviewDays: 2,
      maxOutboundLinks: 3,
      socialFollowers: "110K",
      guidelines: "Highly visual, lifestyle travel logs and sustainable housing tips. High emphasis on photographic references or vector diagram overlays.",
      recentRankings: ["sustainable travel packing list", "eco homestay listings", "zero carbon vacation suggestions"]
    },
    {
      id: "v-6",
      domain: "retailtrends-journal.com",
      categories: ["Retail", "Finance"],
      niche: "E-Commerce",
      dr: 71,
      traffic: "190K",
      trafficNum: 190000,
      spamScore: 2,
      backlinks: 110000,
      refDomains: 1250,
      postPrice: 210,
      contactEmail: "collab@retailtrends-journal.com",
      contactName: "Gavin Hayes",
      isUnlocked: false,
      editorialReviewDays: 4,
      maxOutboundLinks: 2,
      socialFollowers: "30K",
      guidelines: "Topics must analyze modern POS, supply-chain automation, or retail checkout conversion optimization. No fluff or generic overviews.",
      recentRankings: ["modern checkout conversion benchmarks", "dropshipping warehouse locations", "automated pos review"]
    },
    {
      id: "v-7",
      domain: "healthweb-authority.com",
      categories: ["Health"],
      niche: "Medical Tech",
      dr: 82,
      traffic: "2.1M",
      trafficNum: 2100000,
      spamScore: 1,
      backlinks: 950000,
      refDomains: 8400,
      postPrice: 400,
      contactEmail: "editor@healthweb-authority.com",
      contactName: "Dr. Laura Vance",
      isUnlocked: false,
      editorialReviewDays: 7,
      maxOutboundLinks: 1,
      socialFollowers: "380K",
      guidelines: "Medical claims must have official DOI references or peer-reviewed bibliography list attached at footer. Checked by registered health professionals.",
      recentRankings: ["telehealth security protocols", "smart medical wearables catalog", "biometrics compliance indices"]
    },
    {
      id: "v-8",
      domain: "cryptoinsider-news.com",
      categories: ["Finance"],
      niche: "Web3/Crypto",
      dr: 72,
      traffic: "830K",
      trafficNum: 830000,
      spamScore: 5,
      backlinks: 310000,
      refDomains: 3800,
      postPrice: 320,
      contactEmail: "submit@cryptoinsider-news.com",
      contactName: "Ray Sterling",
      isUnlocked: false,
      editorialReviewDays: 3,
      maxOutboundLinks: 2,
      socialFollowers: "64K",
      guidelines: "We feature protocol-level analysis, smart contract audit tutorials, and developer interviews. Sponsored contributions marked accordingly.",
      recentRankings: ["defy protocol standards", "smart contract deployment guides", "layer 3 scaling models"]
    },
    {
      id: "v-9",
      domain: "the-ai-revolution.io",
      categories: ["Technology"],
      niche: "Generative AI",
      dr: 85,
      traffic: "1.8M",
      trafficNum: 1800000,
      spamScore: 1,
      backlinks: 1400000,
      refDomains: 12000,
      postPrice: 450,
      contactEmail: "press@the-ai-revolution.io",
      contactName: "Vikram Mehta",
      isUnlocked: false,
      editorialReviewDays: 4,
      maxOutboundLinks: 1,
      socialFollowers: "155K",
      guidelines: "Deep technical articles on generative neural networks, fine-tuning techniques, or multi-agent pipelines. Include code snippets in TypeScript or Python.",
      recentRankings: ["generative neural network nodes", "recurrent fine tuning rules", "nodejs gemini sdk examples"]
    },
    {
      id: "v-10",
      domain: "seo-masters-academy.com",
      categories: ["SaaS", "Marketing"],
      niche: "SEO Audits",
      dr: 75,
      traffic: "240K",
      trafficNum: 240000,
      spamScore: 1,
      backlinks: 150000,
      refDomains: 1900,
      postPrice: 250,
      contactEmail: "outreach@seo-masters-academy.com",
      contactName: "Nate Robinson",
      isUnlocked: true,
      editorialReviewDays: 3,
      maxOutboundLinks: 2,
      socialFollowers: "28K",
      guidelines: "Actionable link building, technical audits, and digital PR execution steps. We prefer screenshots illustrating Google Search Console metrics.",
      recentRankings: ["technical audit checklists", "digital pr strategy benchmarks", "ranking factors crawler"]
    },
    {
      id: "v-11",
      domain: "dev-ops-chronicles.com",
      categories: ["Technology"],
      niche: "Cloud Ops",
      dr: 80,
      traffic: "920K",
      trafficNum: 920000,
      spamScore: 2,
      backlinks: 640000,
      refDomains: 5900,
      postPrice: 380,
      contactEmail: "editor@dev-ops-chronicles.com",
      contactName: "Aris Thorne",
      isUnlocked: false,
      editorialReviewDays: 5,
      maxOutboundLinks: 1,
      socialFollowers: "82K",
      guidelines: "Focus on Kubernetes configuration, hybrid-cloud setups, or CI/CD pipelines. Articles must contain real-world architectural diagrams.",
      recentRankings: ["kubernetes cluster setup profiles", "hybrid cloud configuration", "cicd pipelines devsecops"]
    },
    {
      id: "v-12",
      domain: "realestate-maven.com",
      categories: ["Lifestyle"],
      niche: "Real Estate",
      dr: 65,
      traffic: "310K",
      trafficNum: 310000,
      spamScore: 3,
      backlinks: 75000,
      refDomains: 800,
      postPrice: 190,
      contactEmail: "team@realestate-maven.com",
      contactName: "Darlene Diaz",
      isUnlocked: true,
      editorialReviewDays: 3,
      maxOutboundLinks: 2,
      socialFollowers: "19K",
      guidelines: "Curated real estate investment analysis. Target audience consists of single-family developers and property managers.",
      recentRankings: ["commercial property management tools", "single family mortgage criteria", "reit investment portfolios"]
    }
  ]);

  // 2. Main Page Layout state managers
  const [toast, setToast] = useState<string | null>(null);
  
  // Lookups and remaining Credits (Standard for premium link engines / CRM packages)
  const [credits, setCredits] = useState<number>(145);

  // Stepper current workflow indicator (Interactive!)
  const [activeStepTab, setActiveStepTab] = useState<"search" | "filter" | "unlock" | "enroll" | "outreach">("search");

  // Search input and translation rules
  const [searchMode, setSearchMode] = useState<"ai" | "manual">("ai");
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isAiParsing, setIsAiParsing] = useState<boolean>(false);
  const [aiParsingMessage, setAiParsingMessage] = useState<string>("");
  const [translatedRuleText, setTranslatedRuleText] = useState<string | null>(null);

  // Dropdown manual filters
  const [keywordFilter, setKeywordFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [nicheFilter, setNicheFilter] = useState<string>("All");
  const [drRangeFilter, setDrRangeFilter] = useState<string>("All");
  const [trafficFilter, setTrafficFilter] = useState<string>("All");
  const [spamFilter, setSpamFilter] = useState<string>("All");
  const [contactFilter, setContactFilter] = useState<string>("All");

  // Checkbox list selections for bulk enrollment / "Add To" operations
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Columns visibility toggling menu state
  const [showColumnsPopover, setShowColumnsPopover] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState({
    domain: true,
    categories: true,
    niches: true,
    dr: true,
    traffic: true,
    spamScore: true,
    backlinks: true,
    refDomains: true,
    contact: true
  });

  // Details sidebar flyout matching modern corporate portals
  const [selectedSiteDetail, setSelectedSiteDetail] = useState<ExtendedVettedSite | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Campaign List items for "Add To" actions
  const [showAddToDropdown, setShowAddToDropdown] = useState<boolean>(false);
  const campaignsList = [
    { id: "c-1", name: "CyberGuard SaaS Drive" },
    { id: "c-2", name: "Uprankly Guest Blogging" },
    { id: "c-3", name: "TechFlow Skyscraper Thread" },
    { id: "c-4", name: "FinTech Hub Guest Placements" }
  ];

  // Helper trigger
  const triggerToast = (msg: string) => {
    setToast(null);
    setTimeout(() => setToast(msg), 50);
  };

  // Stepper helper text guides
  const stepGuides = {
    search: "Step 1: AI Search — Type queries in plain English. Link Pro translates text to filters automatically.",
    filter: "Step 2: Filter & Compare — Intersect authority ratings, monthly metrics and publisher niches.",
    unlock: "Step 3: Unlock Contacts — Resolve 100% deliverable webmaster and editorial emails in real-time.",
    enroll: "Step 4: Add to Prospect List — Check domains and bulk-enroll them into corresponding sequence queues.",
    outreach: "Step 5: Active Outreach — Customize pitch drafts, select mailers, and trigger automated delivery streams."
  };

  // AI query natural language translator parsing mechanics
  const handleAiSearchParse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiParsing(true);
    setTranslatedRuleText(null);

    const stages = [
      "Analyzing natural linguistics semantic intent...",
      "Matching domains containing SEO niches or cloud tags...",
      "Generating automated database lookup rules..."
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < stages.length) {
        setAiParsingMessage(stages[count]);
        count++;
      } else {
        clearInterval(interval);
        setIsAiParsing(false);

        const lower = aiQuery.toLowerCase();
        let cat = "All";
        let minDr = 0;
        let trafficThreshold = 0;
        let onlyUnlocked = false;
        let explanationParts: string[] = [];

        // Check categories mapping
        if (lower.includes("tech") || lower.includes("dev") || lower.includes("cloud")) {
          cat = "Technology";
          explanationParts.push("Category matching 'Technology'");
        } else if (lower.includes("saas") || lower.includes("software")) {
          cat = "SaaS";
          explanationParts.push("Category matching 'SaaS'");
        } else if (lower.includes("finance") || lower.includes("pioneer") || lower.includes("crypto") || lower.includes("money")) {
          cat = "Finance";
          explanationParts.push("Category matching 'Finance'");
        } else if (lower.includes("lifestyle") || lower.includes("travel") || lower.includes("bloom")) {
          cat = "Lifestyle";
          explanationParts.push("Category matching 'Lifestyle'");
        } else if (lower.includes("health") || lower.includes("medical")) {
          cat = "Health";
          explanationParts.push("Category matching 'Health'");
        }

        // Check DR rating extraction
        const drFilterNum = lower.match(/dr\s*(\d+)\+?/);
        if (drFilterNum) {
          const val = parseInt(drFilterNum[1]);
          minDr = val;
          explanationParts.push(`Minimum DR rating >= ${val}`);
        } else if (lower.includes("high dr") || lower.includes("authority")) {
          minDr = 75;
          explanationParts.push("High DR affinity filter enabled (DR >= 75)");
        }

        // Check Traffic threshold
        if (lower.includes("1m") || lower.includes("1 million") || lower.includes("million")) {
          trafficThreshold = 1000000;
          explanationParts.push("Monthly Search Traffic > 1M");
        } else if (lower.includes("500k") || lower.includes("half million")) {
          trafficThreshold = 500000;
          explanationParts.push("Monthly Search Traffic > 500K");
        } else if (lower.includes("100k") || lower.includes("100,000")) {
          trafficThreshold = 100000;
          explanationParts.push("Monthly Search Traffic > 100K");
        } else if (lower.includes("1000+") || lower.includes("thousand")) {
          trafficThreshold = 1000;
          explanationParts.push("Monthly Search Traffic > 1K");
        }

        // Apply rules directly to manual fields to show synchronicity!
        setCategoryFilter(cat);
        if (minDr >= 80) setDrRangeFilter("DR 80+");
        else if (minDr >= 70) setDrRangeFilter("DR 70+");
        else if (minDr >= 60) setDrRangeFilter("DR 60+");
        else if (minDr >= 50) setDrRangeFilter("DR 50+");
        else setDrRangeFilter("All");

        if (trafficThreshold >= 1000000) setTrafficFilter("> 1M");
        else if (trafficThreshold >= 500000) setTrafficFilter("> 500K");
        else if (trafficThreshold >= 100000) setTrafficFilter("> 100K");
        else setTrafficFilter("All");

        if (lower.includes("contact") || lower.includes("email") || lower.includes("unlocked")) {
          setContactFilter("Unlocked");
          explanationParts.push("Pre-Unlocked contacts only");
        } else {
          setContactFilter("All");
        }

        setTranslatedRuleText(explanationParts.length > 0 ? explanationParts.join(" ➔ ") : "General Keyword Filter");
        triggerToast(`Translated plain text query into ${explanationParts.length} search filter nodes successfully.`);
      }
    }, 400);
  };

  // Manual values resets
  const handleResetSearchFilters = () => {
    setAiQuery("");
    setKeywordFilter("");
    setCategoryFilter("All");
    setNicheFilter("All");
    setDrRangeFilter("All");
    setTrafficFilter("All");
    setSpamFilter("All");
    setContactFilter("All");
    setTranslatedRuleText(null);
    setSelectedRowIds([]);
    triggerToast("Search and filters reset to default catalog view.");
  };

  // Core filter execution
  const filteredCatalog = sites.filter((item) => {
    // 1. Text keyword search
    if (keywordFilter) {
      const q = keywordFilter.toLowerCase();
      const matchesSearch = item.domain.toLowerCase().includes(q) ||
                            item.niche.toLowerCase().includes(q) ||
                            item.categories.some(c => c.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // 2. Category Dropdown
    if (categoryFilter !== "All") {
      const matchCat = item.categories.some(c => c.toLowerCase() === categoryFilter.toLowerCase());
      if (!matchCat) return false;
    }

    // 3. Niche Dropdown
    if (nicheFilter !== "All") {
      if (item.niche.toLowerCase() !== nicheFilter.toLowerCase()) return false;
    }

    // 4. DR ranges
    if (drRangeFilter !== "All") {
      if (drRangeFilter === "DR 80+" && item.dr < 80) return false;
      if (drRangeFilter === "DR 70+" && item.dr < 70) return false;
      if (drRangeFilter === "DR 60+" && item.dr < 60) return false;
      if (drRangeFilter === "DR 50+" && item.dr < 50) return false;
    }

    // 5. Traffic ranges
    if (trafficFilter !== "All") {
      if (trafficFilter === "> 1M" && item.trafficNum < 1000000) return false;
      if (trafficFilter === "> 500K" && item.trafficNum < 500000) return false;
      if (trafficFilter === "> 100K" && item.trafficNum < 100000) return false;
    }

    // 6. Spam Score ranges
    if (spamFilter !== "All") {
      if (spamFilter === "< 2%" && item.spamScore >= 2) return false;
      if (spamFilter === "< 5%" && item.spamScore >= 5) return false;
    }

    // 7. Contact states
    if (contactFilter !== "All") {
      if (contactFilter === "Unlocked" && !item.isUnlocked) return false;
      if (contactFilter === "Locked" && item.isUnlocked) return false;
    }

    return true;
  });

  // Unlocking editorial contacts via Credits system (Very high UX fidelity)
  const handleUnlockContact = (id: string, domain: string) => {
    if (credits <= 0) {
      triggerToast("Insufficient validation credits. Please refill search credits.");
      return;
    }

    setSites(prev => prev.map((s) => {
      if (s.id === id) {
        return { ...s, isUnlocked: true };
      }
      return s;
    }));
    
    setCredits(prev => Math.max(0, prev - 1));
    triggerToast(`Unlocked direct publisher contact: verified ${domain} editor!`);
  };

  // Refill credits function for easy software demoing
  const handleRefillDemoCredits = () => {
    setCredits(prev => prev + 100);
    triggerToast("Credited +100 developer lookup keys into active profile!");
  };

  // Row selection handles
  const handleToggleRowSelect = (id: string) => {
    setSelectedRowIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleToggleAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredCatalog.map(x => x.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // Bulk add to Outreach Campaigns in LocalStorage
  const handleBulkEnrollToCampaign = (campaignName: string) => {
    if (selectedRowIds.length === 0) {
      triggerToast("No directory publishers checked. Please select rows in the directory!");
      setShowAddToDropdown(false);
      return;
    }

    const sitesToEnroll = sites.filter(s => selectedRowIds.includes(s.id));
    const savedCRM = localStorage.getItem("uprankly_crm_prospects") || "[]";
    try {
      const parsedCRM = JSON.parse(savedCRM);
      sitesToEnroll.forEach(item => {
        const exists = parsedCRM.some((c: any) => c.email === item.contactEmail);
        if (!exists) {
          parsedCRM.push({
            id: `crm-vetted-${Date.now()}-${Math.random()}`,
            siteName: item.domain,
            person: item.contactName,
            email: item.contactEmail,
            stage: "Planned",
            lastContact: "Just now",
            notes: `Enrolled via Vetted Editorial Directory bulk selector under campaign '${campaignName}'. Authority DR: ${item.dr} | Price: $${item.postPrice}.`
          });
        }
      });
      localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsedCRM));
    } catch (e) {
      // ignore
    }

    triggerToast(`Successfully enrolled ${selectedRowIds.length} high-domain-rating publishers into Campaign '${campaignName}'!`);
    setSelectedRowIds([]);
    setShowAddToDropdown(false);
  };

  // Open detailing sidebar flyout for granular overview
  const handleOpenRowDetails = (site: ExtendedVettedSite) => {
    setSelectedSiteDetail(site);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6" id="vetted-sites-panel-v2">
      
      {/* 2.1 Breadcrumb & Main Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
          <span>Link Pro</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#0d9488] font-bold">Vetted Sites</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-sans font-bold text-slate-800 tracking-tight">Vetted Sites</h2>
            <p className="text-xs text-[#6d7a77] font-medium mt-1">Search our curated database of sites, unlock contacts, and add to your prospect list</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-55 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-wider">Credits remaining:</span>
              <span className="text-xs font-mono font-black text-indigo-900">{credits}</span>
            </div>
            
            <button 
              onClick={handleRefillDemoCredits}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold"
              title="Add research credits"
            >
              <RefreshCw className="w-3 h-3 text-slate-400 animate-spin-hover" />
              <span>Refill</span>
            </button>
          </div>
        </div>

        {/* 2.2 Navigation Stepper (Horizontal tabs from screenshot of correct workflow phases) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            {[
              { key: "search", label: "Search sites" },
              { key: "filter", label: "Filter & compare" },
              { key: "unlock", label: "Unlock contacts" },
              { key: "enroll", label: "Add to prospect list" },
              { key: "outreach", label: "Outreach" }
            ].map((step, idx, arr) => {
              const isActive = activeStepTab === step.key;
              return (
                <React.Fragment key={step.key}>
                  <button
                    onClick={() => setActiveStepTab(step.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                      isActive 
                        ? "bg-teal-50 text-[#006a61] border border-teal-200 shadow-2xs" 
                        : "bg-white text-slate-500 hover:text-slate-800 border border-slate-150 hover:border-slate-250"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-black ${
                      isActive ? "bg-[#0d9488] text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{step.label}</span>
                  </button>
                  {idx < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Stepper info hint line */}
          <div className="mt-3.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/50 flex items-center gap-2 text-xs text-slate-600 font-sans">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-medium">{(stepGuides as any)[activeStepTab]}</span>
          </div>
        </div>
      </div>

      {/* 2.3 Interactive Search Control Module (AI Search vs Multi Filters) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        
        {/* Toggle selectors (AI Search & Filters matches screenshot exactly) */}
        <div className="flex items-center gap-1 bg-slate-105 p-1 rounded-xl w-fit border border-slate-150">
          <button 
            onClick={() => setSearchMode("ai")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              searchMode === "ai" 
                ? "bg-white text-[#0d9488] shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>AI Search</span>
          </button>
          
          <button 
            onClick={() => setSearchMode("manual")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              searchMode === "manual" 
                ? "bg-white text-[#0d9488] shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Filters</span>
          </button>
        </div>

        {/* Form view blocks depending on search mode */}
        {searchMode === "ai" ? (
          <form onSubmit={handleAiSearchParse} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder='e.g. "DR 70+ technology with 500k monthly traffic and contact info"'
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-205 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-500/5 hover:bg-slate-50/40 outline-none font-medium"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isAiParsing}
                className="px-6 py-3 bg-[#0d9488] hover:bg-[#0b8e81] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none border-t border-[#12c4b5]"
              >
                {isAiParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Parsing query...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-1">
              Describe what you're looking for in plain English. We'll translate it into search filters automatically.
            </p>

            {/* Simulated interactive live feedback block */}
            {isAiParsing && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 animate-pulse flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#0d9488]" />
                <span>{aiParsingMessage}</span>
              </div>
            )}

            {translatedRuleText && !isAiParsing && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-150 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-emerald-600 text-white font-mono font-bold px-1.5 py-0.5 rounded uppercase">NL MATCH</span>
                  <span className="font-mono text-[11px] font-medium">{translatedRuleText}</span>
                </div>
                
                <button 
                  type="button"
                  onClick={handleResetSearchFilters}
                  className="text-[10px] underline font-bold hover:text-[#0d9488] transition-colors"
                >
                  Clear AI Translation
                </button>
              </div>
            )}
          </form>
        ) : (
          /* MANUAL FILTERS CONTEXT CONTAINER (Direct matches of second screenshots) */
          <div className="space-y-4 animate-fade-in">
            {/* Direct Filters line controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Domain Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Domain Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search domain or keyword..."
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                >
                  {["All", "Technology", "SaaS", "Finance", "Lifestyle", "Health", "Retail"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Niche selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Niche</label>
                <select
                  value={nicheFilter}
                  onChange={(e) => setNicheFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                >
                  {["All", "SaaS Dev Tools", "SEO Strategies", "Link Building", "Crypto Ledger", "Eco Travel", "E-Commerce", "Medical Tech", "Web3/Crypto", "Generative AI", "SEO Audits", "Cloud Ops", "Real Estate"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* DR Rating range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Authority (DR)</label>
                <select
                  value={drRangeFilter}
                  onChange={(e) => setDrRangeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                >
                  {["All", "DR 80+", "DR 70+", "DR 60+", "DR 50+"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Traffic Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Monthly Traffic</label>
                <select
                  value={trafficFilter}
                  onChange={(e) => setTrafficFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                >
                  <option value="All">All Traffic Categories</option>
                  <option value="> 1M">&gt; 1M /mo visitors</option>
                  <option value="> 500K">&gt; 500K /mo visitors</option>
                  <option value="> 100K">&gt; 100K /mo visitors</option>
                </select>
              </div>

              {/* Spam Index Score */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Max Spam Index</label>
                <select
                  value={spamFilter}
                  onChange={(e) => setSpamFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                >
                  <option value="All">All Spam Levels</option>
                  <option value="< 2%">Very Low (&lt; 2%)</option>
                  <option value="< 5%">Low (&lt; 5%)</option>
                </select>
              </div>

              {/* Contact status resolver */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider">Unlocked Contact Info</label>
                <select
                  value={contactFilter}
                  onChange={(e) => setContactFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                >
                  <option value="All">All Sites</option>
                  <option value="Unlocked">Already Unlocked</option>
                  <option value="Locked">Locked (Require Credits)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={handleResetSearchFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors cursor-pointer select-none"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2.4 Tables Action Bar (Add to dropdown, Columns menu, stats readouts) */}
      <div className="flex items-center justify-between flex-wrap gap-4" id="table-action-bar-v2">
        <div className="flex items-center gap-2">
          {/* Add to Campaign dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowAddToDropdown(!showAddToDropdown)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer select-none flex items-center gap-2"
            >
              <span>Add to</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {showAddToDropdown && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden font-sans">
                <div className="p-2 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Target Campaigns list
                </div>
                <div className="py-1">
                  {campaignsList.map((camp) => (
                    <button
                      key={camp.id}
                      onClick={() => handleBulkEnrollToCampaign(camp.name)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer flex items-center gap-2 font-medium"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                      <span>{camp.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-105 my-1" />
                  <button
                    onClick={() => {
                      triggerToast("Launching campaign creation draft flow...");
                      setShowAddToDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#0d9488] font-bold hover:bg-slate-50 transition-colors cursor-pointer block"
                  >
                    + Create New Campaign
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Credits Quick Indicator */}
          <div className="text-xs text-slate-400 font-mono font-medium flex items-center gap-1">
            <span>{selectedRowIds.length} checked</span>
            {selectedRowIds.length > 0 && (
              <span className="text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded border border-teal-100 font-bold font-sans animate-bounce ml-1">
                Ready to Enroll!
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Column Toggles button and popover */}
        <div className="relative">
          <button 
            onClick={() => setShowColumnsPopover(!showColumnsPopover)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-2 select-none"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Columns</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showColumnsPopover && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-205 rounded-xl shadow-xl z-20 overflow-hidden text-xs">
              <div className="p-3 border-b border-slate-100 bg-slate-50 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Show Columns
              </div>
              
              <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto font-medium">
                {Object.keys(visibleColumns).map((colKey) => {
                  const label = colKey === "spamScore" ? "Spam Score" :
                                colKey === "refDomains" ? "Ref Domains" :
                                colKey.charAt(0).toUpperCase() + colKey.slice(1);
                  return (
                    <label key={colKey} className="flex items-center justify-between cursor-pointer group select-none">
                      <span className="text-slate-650 group-hover:text-slate-900 transition-colors text-[11.5px] font-bold">{label}</span>
                      <input 
                        type="checkbox"
                        checked={(visibleColumns as any)[colKey]}
                        onChange={(e) => setVisibleColumns(prev => ({ ...prev, [colKey]: e.target.checked }))}
                        className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
              
              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <button 
                  onClick={() => setShowColumnsPopover(false)}
                  className="w-full py-1 text-[10px] text-teal-700 font-bold hover:underline"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2.5 The Custom Interactive Vetted Sites Data table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="sites-table-card-v2">
        {filteredCatalog.length === 0 ? (
          /* PERFECT MATCH OF SCREENSHOT EMPTY STATES */
          <div className="p-16 flex flex-col items-center text-center justify-center space-y-5 animate-fade-in" id="empty-results-box">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400">
              <Globe className="w-8 h-8 text-slate-300 stroke-1" />
            </div>
            
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-bold text-slate-800">No sites found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {searchMode === "ai" 
                  ? "Try describing what you're looking for, like 'DR 40+ tech blogs with 1000+ monthly visitors and contact info'"
                  : "Adjust your filters or try a different search term to find sites in our database."}
              </p>
            </div>

            <button 
              onClick={handleResetSearchFilters}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer font-sans"
            >
              Reset Filters & Retest
            </button>
          </div>
        ) : (
          /* Rich high performance enterprise table content view */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[#6d7a77] text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4 pl-6 text-center w-12">
                    <input 
                      type="checkbox"
                      onChange={handleToggleAllRows}
                      checked={selectedRowIds.length === filteredCatalog.length && filteredCatalog.length > 0}
                      className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>
                  
                  {visibleColumns.domain && <th className="p-4">Referring Domain</th>}
                  {visibleColumns.categories && <th className="p-4">Category</th>}
                  {visibleColumns.niches && <th className="p-4">Publisher Niche</th>}
                  {visibleColumns.dr && <th className="p-4">Domain Authority (DR)</th>}
                  {visibleColumns.traffic && <th className="p-4">Monthly Search Traffic</th>}
                  {visibleColumns.spamScore && <th className="p-4">Spam Score</th>}
                  {visibleColumns.backlinks && <th className="p-4">Backlinks</th>}
                  {visibleColumns.refDomains && <th className="p-4">Ref Domains</th>}
                  {visibleColumns.contact && <th className="p-4 pr-6 text-right">Publisher Contact</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCatalog.map((item) => {
                  const isChecked = selectedRowIds.includes(item.id);
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-55/65 transition-all text-slate-700 ${isChecked ? "bg-slate-50/50" : ""}`}
                    >
                      {/* Checkbox selector */}
                      <td className="p-4 pl-6 text-center">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRowSelect(item.id)}
                          className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Domain column */}
                      {visibleColumns.domain && (
                        <td className="p-4 font-sans">
                          <button 
                            onClick={() => handleOpenRowDetails(item)}
                            className="font-bold text-slate-800 hover:text-teal-700 text-left hover:underline flex items-center gap-1.5 cursor-pointer select-all"
                          >
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.domain}</span>
                          </button>
                          
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9.5px] text-slate-400 font-mono">Est rate:</span>
                            <span className="text-[10px] text-emerald-600 font-bold font-mono">${item.postPrice}</span>
                          </div>
                        </td>
                      )}

                      {/* Categories column */}
                      {visibleColumns.categories && (
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {item.categories.map((cat, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded text-[9.5px] font-sans">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}

                      {/* Niches column */}
                      {visibleColumns.niches && (
                        <td className="p-4 text-slate-600 font-medium text-[11px]">
                          {item.niche}
                        </td>
                      )}

                      {/* DR column */}
                      {visibleColumns.dr && (
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="w-9 text-slate-800 font-black font-mono text-[11px] bg-slate-100/70 border border-slate-150 px-1.5 py-0.5 rounded text-center">
                              {item.dr}
                            </span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0 hidden sm:block">
                              <div 
                                className={`h-full rounded-full ${
                                  item.dr >= 80 ? "bg-[#0d9488]" :
                                  item.dr >= 70 ? "bg-indigo-600" : "bg-emerald-500"
                                }`}
                                style={{ width: `${item.dr}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Monthly traffic column */}
                      {visibleColumns.traffic && (
                        <td className="p-4 font-mono font-bold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                            <span>{item.traffic}/mo</span>
                          </div>
                        </td>
                      )}

                      {/* Spam Score column */}
                      {visibleColumns.spamScore && (
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            item.spamScore <= 2 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {item.spamScore}% Spam
                          </span>
                        </td>
                      )}

                      {/* Backlinks */}
                      {visibleColumns.backlinks && (
                        <td className="p-4 font-mono text-slate-500">
                          {item.backlinks.toLocaleString()}
                        </td>
                      )}

                      {/* Ref Domains */}
                      {visibleColumns.refDomains && (
                        <td className="p-4 font-mono text-slate-500">
                          {item.refDomains.toLocaleString()}
                        </td>
                      )}

                      {/* Actions Column (Unlock Contact matching screens design flow) */}
                      {visibleColumns.contact && (
                        <td className="p-4 pr-6 text-right">
                          {item.isUnlocked ? (
                            <div className="space-y-0.5 text-right">
                              <span className="text-[10.5px] font-mono font-black text-slate-700 block select-all">
                                {item.contactEmail}
                              </span>
                              <span className="text-[9.5px] text-slate-400 block font-sans">
                                Host: {item.contactName}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUnlockContact(item.id, item.domain)}
                              className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white rounded-lg text-[10.5px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wide select-none outline-none"
                              title="Spend 1 Credit to revealVerified Email"
                            >
                              <span>Unlock Contact</span>
                              <span className="text-[8.5px] bg-orange-900 px-1 py-0.2 rounded font-mono font-black ml-0.5">1 CR</span>
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2.6 ADVANCED DETAILS DRAWER (FLYOUT SCREEN) */}
      {isDrawerOpen && selectedSiteDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="site-details-drawer">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Flyout Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0d9488]/10 flex items-center justify-center font-bold text-[#0d9488]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-black text-slate-800 uppercase tracking-wider">{selectedSiteDetail.domain}</h3>
                    <span className="text-[10px] text-[#6d7a77] font-medium font-mono">Publisher ID: {selectedSiteDetail.id}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Flyout Body (Deep analytical overview stats) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Meta Statistics Grid */}
                <div className="space-y-2.5">
                  <h4 className="text-[10.5px] font-sans font-bold text-slate-400 uppercase tracking-widest">Authority Core Metrics</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-medium block">Domain Rating (DR)</span>
                      <span className="text-lg font-mono font-black text-indigo-700">{selectedSiteDetail.dr}/100</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-medium block">Monthly Traffic</span>
                      <span className="text-lg font-mono font-black text-slate-800">{selectedSiteDetail.traffic}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-medium block">Total Backlinks</span>
                      <span className="text-base font-mono font-extrabold text-slate-700">{selectedSiteDetail.backlinks.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-medium block">Spam Index</span>
                      <span className="text-base font-mono font-extrabold text-amber-600">{selectedSiteDetail.spamScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Categories & Niches badges */}
                <div className="space-y-2 text-left">
                  <span className="text-[10.5px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Topic Categories</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSiteDetail.categories.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 bg-teal-50 text-[#006a61] font-bold text-[10.5px] rounded-lg border border-teal-100 font-sans">
                        {c}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-[10.5px] rounded-lg border border-slate-200">
                      {selectedSiteDetail.niche}
                    </span>
                  </div>
                </div>

                {/* Pre-negotiated Placement details */}
                <div className="bg-[#f0fdf4] p-4 rounded-xl border border-emerald-150 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-sans font-bold text-emerald-800">
                    <span>Negotiated Rate Ticket</span>
                    <span className="font-mono text-emerald-700 font-black text-sm">${selectedSiteDetail.postPrice} USD</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] text-emerald-700 font-medium">
                    <div>⏱️ Review: {selectedSiteDetail.editorialReviewDays} Days max</div>
                    <div>🔗 Outbound Links: {selectedSiteDetail.maxOutboundLinks} context link</div>
                  </div>
                </div>

                {/* Editorial contribution guidelines */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Publishing Guidelines</span>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-sans font-medium text-left">
                    {selectedSiteDetail.guidelines}
                  </div>
                </div>

                {/* Recent High search volume rankings list */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-sans font-bold text-slate-400 uppercase tracking-widest block">Target Organic Keyword Node Placement</span>
                  <div className="space-y-1.5">
                    {selectedSiteDetail.recentRankings.map((ranking, index) => (
                      <div key={index} className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-150 transition-colors">
                        <span className="font-bold">{ranking}</span>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-1.5 py-0.2 rounded">Pos 1-3</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Flyout bottom action parameters */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                {selectedSiteDetail.isUnlocked ? (
                  <div className="space-y-2.5">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center font-mono">
                      <span className="text-[#0d9488] font-bold text-[10px] uppercase block">Direct verified editor address</span>
                      <span className="text-slate-800 font-black text-sm block select-all select-none mt-1">{selectedSiteDetail.contactEmail}</span>
                    </div>

                    <button
                      onClick={() => {
                        triggerToast(`Loading email outreach templates linked to ${selectedSiteDetail.domain}...`);
                        setIsDrawerOpen(false);
                      }}
                      className="w-full py-3 bg-[#0d9488] hover:bg-teal-800 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-emerald-300" />
                      <span>Draft Outreach Sequence Now</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleUnlockContact(selectedSiteDetail.id, selectedSiteDetail.domain);
                      // Update current flyout status instantly too
                      setSelectedSiteDetail(prev => prev ? { ...prev, isUnlocked: true } : null);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Unlock Direct Email Contact</span>
                    <span className="bg-orange-950 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-black ml-1">1 Credit</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Local system Toast notification matching overall platform */}
      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
