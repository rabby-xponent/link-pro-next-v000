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

export function CompetitorOpportunitiesView() {
  // Define structures for Competitor Gaps
  interface CompetitorGapItem {
    id: string;
    domain: string;
    dr: number;
    traffic: string;
    trafficNum: number;
    overlap: number;
    score: "High" | "Medium" | "Low";
    type: "Resource Page" | "Editorial" | "Guest Post";
    hasContact: boolean;
    contactEmail: string;
    contactName: string;
    status: "New" | "Pitched" | "Planned";
    projectType: "uprankly" | "cyberguard" | "techflow";
    spamScore: number;
    competitors: { name: string; targetUrl: string; anchor: string }[];
    backlinks: number;
    refDomains: number;
    estimatedCost: string;
  }

  // 1. Interactive Mock Database of Gaps spanning different selected projects
  const [gaps, setGaps] = useState<CompetitorGapItem[]>([
    // Project: Uprankly gaps
    {
      id: "gap-1",
      domain: "yoast.com",
      dr: 88,
      traffic: "4.5M",
      trafficNum: 4500000,
      overlap: 3,
      score: "High",
      type: "Resource Page",
      hasContact: true,
      contactEmail: "outreach@yoast.com",
      contactName: "Joost de Valk",
      status: "New",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 1200000,
      refDomains: 14000,
      estimatedCost: "Resource Directory Listing",
      competitors: [
        { name: "semrush.com", targetUrl: "/blog/seo-audit", anchor: "digital marketing audit framework" },
        { name: "ahrefs.com", targetUrl: "/backlink-checker", anchor: "comprehensive backlink indexing" },
        { name: "moz.com", targetUrl: "/domain-analysis", anchor: "organic search crawler benchmark" }
      ]
    },
    {
      id: "gap-2",
      domain: "smashingmagazine.com",
      dr: 89,
      traffic: "2.4M",
      trafficNum: 2400000,
      overlap: 3,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "editorial@smashingmagazine.com",
      contactName: "Vitaly Friedman",
      status: "New",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 920000,
      refDomains: 11000,
      estimatedCost: "Editorial Review Guidelines",
      competitors: [
        { name: "semrush.com", targetUrl: "/academy", anchor: "seo learning hub" },
        { name: "ahrefs.com", targetUrl: "/blog", anchor: "backlink outreach lessons" },
        { name: "moz.com", targetUrl: "/beginners-guide-to-seo", anchor: "advanced optimization checklist" }
      ]
    },
    {
      id: "gap-3",
      domain: "hubspot.com",
      dr: 93,
      traffic: "8.5M",
      trafficNum: 8500000,
      overlap: 2,
      score: "High",
      type: "Resource Page",
      hasContact: false,
      contactEmail: "partners@hubspot.com",
      contactName: "Brian Halligan",
      status: "New",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 4800000,
      refDomains: 34000,
      estimatedCost: "Affiliate Page Inclusion",
      competitors: [
        { name: "ahrefs.com", targetUrl: "/keywords-explorer", anchor: "high density keyword map" },
        { name: "moz.com", targetUrl: "/blog", anchor: "inbound growth signals" }
      ]
    },
    {
      id: "gap-4",
      domain: "backlinko.com",
      dr: 75,
      traffic: "890K",
      trafficNum: 890000,
      overlap: 3,
      score: "High",
      type: "Guest Post",
      hasContact: true,
      contactEmail: "brian@backlinko.com",
      contactName: "Brian Dean",
      status: "New",
      projectType: "uprankly",
      spamScore: 2,
      backlinks: 430000,
      refDomains: 3200,
      estimatedCost: "Case Study Guest Post",
      competitors: [
        { name: "semrush.com", targetUrl: "/features", anchor: "crawler indexing speed" },
        { name: "ahrefs.com", targetUrl: "/site-audit", anchor: "on-page crawl guide" },
        { name: "moz.com", targetUrl: "/explorer", anchor: "domain metrics query" }
      ]
    },
    {
      id: "gap-5",
      domain: "searchenginejournal.com",
      dr: 82,
      traffic: "1.8M",
      trafficNum: 1800000,
      overlap: 2,
      score: "High",
      type: "Guest Post",
      hasContact: true,
      contactEmail: "pitches@searchenginejournal.com",
      contactName: "Loren Baker",
      status: "New",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 1300000,
      refDomains: 9500,
      estimatedCost: "Contributed Guest Guide",
      competitors: [
        { name: "semrush.com", targetUrl: "/pricing", anchor: "comparative digital stats" },
        { name: "moz.com", targetUrl: "/pro", anchor: "seo keyword priority checker" }
      ]
    },
    {
      id: "gap-6",
      domain: "searchengineland.com",
      dr: 80,
      traffic: "1.2M",
      trafficNum: 1200000,
      overlap: 2,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "editor@searchengineland.com",
      contactName: "Danny Sullivan",
      status: "Pitched",
      projectType: "uprankly",
      spamScore: 2,
      backlinks: 850000,
      refDomains: 6200,
      estimatedCost: "Editorial Press Release",
      competitors: [
        { name: "ahrefs.com", targetUrl: "/rank-tracker", anchor: "serp tracking dashboard" },
        { name: "semrush.com", targetUrl: "/sensor", anchor: "algo fluctuation indexes" }
      ]
    },
    {
      id: "gap-7",
      domain: "medium.com/seo-trends",
      dr: 90,
      traffic: "12M",
      trafficNum: 12000000,
      overlap: 4,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "trends@medium.com",
      contactName: "Sarah Connor",
      status: "New",
      projectType: "uprankly",
      spamScore: 3,
      backlinks: 6400000,
      refDomains: 52000,
      estimatedCost: "Author Column Syndication",
      competitors: [
        { name: "semrush.com", targetUrl: "/", anchor: "marketing tactics database" },
        { name: "moz.com", targetUrl: "/blog", anchor: "syndicated content trends" }
      ]
    },
    {
      id: "gap-8",
      domain: "buffer.com/resources",
      dr: 85,
      traffic: "1.1M",
      trafficNum: 1100000,
      overlap: 3,
      score: "High",
      type: "Resource Page",
      hasContact: true,
      contactEmail: "hello@buffer.com",
      contactName: "Joel Gascoigne",
      status: "New",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 510000,
      refDomains: 4900,
      estimatedCost: "Resource Page Link Addition",
      competitors: [
        { name: "ahrefs.com", targetUrl: "/", anchor: "backlink crawler software" },
        { name: "semrush.com", targetUrl: "/social-trends", anchor: "social media optimization parameters" }
      ]
    },
    {
      id: "gap-9",
      domain: "neilpatel.com",
      dr: 87,
      traffic: "5.2M",
      trafficNum: 5200000,
      overlap: 3,
      score: "High",
      type: "Editorial",
      hasContact: false,
      contactEmail: "team@neilpatel.com",
      contactName: "Neil Patel",
      status: "Planned",
      projectType: "uprankly",
      spamScore: 4,
      backlinks: 1100000,
      refDomains: 9100,
      estimatedCost: "Editorial Placement Rate",
      competitors: [
        { name: "moz.com", targetUrl: "/", anchor: "domain metrics query" },
        { name: "semrush.com", targetUrl: "/seo-audit", anchor: "site audit benchmarking" }
      ]
    },
    {
      id: "gap-10",
      domain: "shopify.com/blog",
      dr: 94,
      traffic: "15M",
      trafficNum: 15000000,
      overlap: 2,
      score: "Medium",
      type: "Editorial",
      hasContact: false,
      contactEmail: "blog@shopify.com",
      contactName: "Harley Finkelstein",
      status: "New",
      projectType: "uprankly",
      spamScore: 2,
      backlinks: 7200000,
      refDomains: 42000,
      estimatedCost: "Partner Integration Guide",
      competitors: [
        { name: "semrush.com", targetUrl: "/", anchor: "e-commerce research logs" }
      ]
    },
    {
      id: "gap-11",
      domain: "ahrefs.com/blog",
      dr: 88,
      traffic: "2.1M",
      trafficNum: 2100000,
      overlap: 4,
      score: "High",
      type: "Guest Post",
      hasContact: true,
      contactEmail: "tim@ahrefs.com",
      contactName: "Tim Soulo",
      status: "Pitched",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 1800000,
      refDomains: 13000,
      estimatedCost: "Premium Case Guest Contribution",
      competitors: [
        { name: "semrush.com", targetUrl: "/", anchor: "backlink checker alternatives" },
        { name: "moz.com", targetUrl: "/domain-analysis", anchor: "crawler metrics check" }
      ]
    },
    {
      id: "gap-12",
      domain: "moz.com/blog",
      dr: 89,
      traffic: "1.5M",
      trafficNum: 1500000,
      overlap: 3,
      score: "High",
      type: "Resource Page",
      hasContact: true,
      contactEmail: "charly@moz.com",
      contactName: "Charly Wycliff",
      status: "New",
      projectType: "uprankly",
      spamScore: 1,
      backlinks: 1400000,
      refDomains: 10500,
      estimatedCost: "Whiteboard Friday Placement",
      competitors: [
        { name: "ahrefs.com", targetUrl: "/", anchor: "seo search ranking indices" }
      ]
    },

    // Project: CyberGuard gaps
    {
      id: "gap-13",
      domain: "wired.com",
      dr: 92,
      traffic: "5.5M",
      trafficNum: 5500000,
      overlap: 3,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "press@wired.com",
      contactName: "Gideon Lichfield",
      status: "New",
      projectType: "cyberguard",
      spamScore: 2,
      backlinks: 5100000,
      refDomains: 38000,
      estimatedCost: "Tech Editorial Request",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/threat-feed", anchor: "real-time ransomware index" }
      ]
    },
    {
      id: "gap-14",
      domain: "techcrunch.com",
      dr: 91,
      traffic: "3.2M",
      trafficNum: 3200000,
      overlap: 3,
      score: "High",
      type: "Resource Page",
      hasContact: true,
      contactEmail: "tips@techcrunch.com",
      contactName: "Matthew Panzarino",
      status: "New",
      projectType: "cyberguard",
      spamScore: 1,
      backlinks: 3400000,
      refDomains: 24000,
      estimatedCost: "Startup directory resource",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/cloud-sec", anchor: "cloud vulnerability standard" }
      ]
    },
    {
      id: "gap-15",
      domain: "hackernews.ycombinator.com",
      dr: 91,
      traffic: "8.0M",
      trafficNum: 8000000,
      overlap: 2,
      score: "High",
      type: "Editorial",
      hasContact: false,
      contactEmail: "hn@ycombinator.com",
      contactName: "Paul Graham",
      status: "New",
      projectType: "cyberguard",
      spamScore: 1,
      backlinks: 2900000,
      refDomains: 18000,
      estimatedCost: "Show HN placement",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/sandbox", anchor: "open-source sandboxing network" }
      ]
    },
    {
      id: "gap-16",
      domain: "csoonline.com",
      dr: 81,
      traffic: "410K",
      trafficNum: 410000,
      overlap: 3,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "editor@csoonline.com",
      contactName: "Steve Ragan",
      status: "New",
      projectType: "cyberguard",
      spamScore: 2,
      backlinks: 190000,
      refDomains: 2100,
      estimatedCost: "Enterprise security whitepaper",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/zero-trust", anchor: "zero trust compliance" }
      ]
    },
    {
      id: "gap-17",
      domain: "darkreading.com",
      dr: 80,
      traffic: "320K",
      trafficNum: 320000,
      overlap: 2,
      score: "Medium",
      type: "Guest Post",
      hasContact: true,
      contactEmail: "contrib@darkreading.com",
      contactName: "Kelly Jackson",
      status: "Pitched",
      projectType: "cyberguard",
      spamScore: 4,
      backlinks: 150000,
      refDomains: 1700,
      estimatedCost: "Tech Industry Opinion Post",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/active-endpoint", anchor: "edr telemetry benchmarks" }
      ]
    },
    {
      id: "gap-18",
      domain: "scmagazine.com",
      dr: 78,
      traffic: "180K",
      trafficNum: 180000,
      overlap: 2,
      score: "Medium",
      type: "Editorial",
      hasContact: true,
      contactEmail: "pitches@scmagazine.com",
      contactName: "Illena Armstrong",
      status: "New",
      projectType: "cyberguard",
      spamScore: 2,
      backlinks: 85000,
      refDomains: 950,
      estimatedCost: "Expert Quote Backlink",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/ids", anchor: "ids detection heuristics" }
      ]
    },
    {
      id: "gap-19",
      domain: "securityweekly.com",
      dr: 72,
      traffic: "50K",
      trafficNum: 50000,
      overlap: 1,
      score: "Low",
      type: "Guest Post",
      hasContact: true,
      contactEmail: "podcasts@securityweekly.com",
      contactName: "Paul Asadoorian",
      status: "New",
      projectType: "cyberguard",
      spamScore: 5,
      backlinks: 24000,
      refDomains: 340,
      estimatedCost: "Podcast Interview Link",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/fw", anchor: "stateless firewalls list" }
      ]
    },
    {
      id: "gap-20",
      domain: "threatpost.com",
      dr: 76,
      traffic: "120K",
      trafficNum: 120000,
      overlap: 2,
      score: "Medium",
      type: "Resource Page",
      hasContact: false,
      contactEmail: "editor@threatpost.com",
      contactName: "Tom Spring",
      status: "Planned",
      projectType: "cyberguard",
      spamScore: 3,
      backlinks: 62000,
      refDomains: 780,
      estimatedCost: "Industry threat index page",
      competitors: [
        { name: "cyberguard-competitor.com", targetUrl: "/botnet", anchor: "active botnet tracking mapping" }
      ]
    },

    // Project: TechFlow gaps
    {
      id: "gap-21",
      domain: "github.com",
      dr: 96,
      traffic: "22M",
      trafficNum: 22000000,
      overlap: 2,
      score: "High",
      type: "Resource Page",
      hasContact: false,
      contactEmail: "support@github.com",
      contactName: "Thomas Dohmke",
      status: "New",
      projectType: "techflow",
      spamScore: 1,
      backlinks: 48000000,
      refDomains: 190000,
      estimatedCost: "Awesome List Link Submission",
      competitors: [
        { name: "techflow-competitor.com", targetUrl: "/ts-library", anchor: "typesafe network serialization" }
      ]
    },
    {
      id: "gap-22",
      domain: "npmtrends.com",
      dr: 71,
      traffic: "210K",
      trafficNum: 210000,
      overlap: 2,
      score: "High",
      type: "Guest Post",
      hasContact: true,
      contactEmail: "trends@npmtrends.com",
      contactName: "John Doe",
      status: "New",
      projectType: "techflow",
      spamScore: 1,
      backlinks: 34000,
      refDomains: 450,
      estimatedCost: "Guest post benchmark series",
      competitors: [
        { name: "techflow-competitor.com", targetUrl: "/perf-metric", anchor: "throughput speed limits" }
      ]
    },
    {
      id: "gap-23",
      domain: "dev.to",
      dr: 85,
      traffic: "3.5M",
      trafficNum: 3500000,
      overlap: 4,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "editorial@dev.to",
      contactName: "Ben Halpern",
      status: "New",
      projectType: "techflow",
      spamScore: 1,
      backlinks: 2200000,
      refDomains: 16000,
      estimatedCost: "Dev community guest column",
      competitors: [
        { name: "techflow-competitor.com", targetUrl: "/devops-automate", anchor: "immutable pipeline templates" }
      ]
    },
    {
      id: "gap-24",
      domain: "stackshare.io",
      dr: 81,
      traffic: "890K",
      trafficNum: 890000,
      overlap: 3,
      score: "High",
      type: "Editorial",
      hasContact: true,
      contactEmail: "shares@stackshare.io",
      contactName: "Yonas Beshawred",
      status: "Pitched",
      projectType: "techflow",
      spamScore: 2,
      backlinks: 290000,
      refDomains: 3400,
      estimatedCost: "Stack Inclusion profiling",
      competitors: [
        { name: "techflow-competitor.com", targetUrl: "/server-mesh", anchor: "lightweight server mesh container" }
      ]
    },
    {
      id: "gap-25",
      domain: "css-tricks.com",
      dr: 88,
      traffic: "1.4M",
      trafficNum: 1400000,
      overlap: 2,
      score: "Medium",
      type: "Resource Page",
      hasContact: true,
      contactEmail: "editorial@css-tricks.com",
      contactName: "Chris Coyier",
      status: "New",
      projectType: "techflow",
      spamScore: 1,
      backlinks: 1200000,
      refDomains: 11000,
      estimatedCost: "Reference link guide",
      competitors: [
        { name: "techflow-competitor.com", targetUrl: "/grid-utility", anchor: "responsive layouts generator" }
      ]
    }
  ]);

  // 2. State management variables matching high-fidelity workflow coordinates
  const [toast, setToast] = useState<string | null>(null);
  const [researchCredits, setResearchCredits] = useState<number>(145);

  // Stepper Current Phase indicator (Perfect alignment with screenshot steps)
  const [currentStepperPhase, setCurrentStepperPhase] = useState<"select" | "view" | "filter" | "enroll" | "outreach">("select");

  // Project Checkbox states
  const [selectedProjects, setSelectedProjects] = useState<string[]>(["uprankly"]); // Uprankly checked by default as requested

  // Row checkbox selections for bulk actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Columns menu dropdown toggler & states
  const [showColumnsMenu, setShowColumnsMenu] = useState<boolean>(false);
  const [displayedColumns, setDisplayedColumns] = useState({
    domain: true,
    dr: true,
    traffic: true,
    overlap: true,
    score: true,
    type: true,
    contact: true,
    status: true
  });

  // Bulk addition dropdown variables
  const [showCampaignDropdown, setShowCampaignDropdown] = useState<boolean>(false);
  const coreCampaigns = [
    { id: "camp-cyber", name: "CyberGuard SaaS Campaign" },
    { id: "camp-rank", name: "Uprankly Guest Posting" },
    { id: "camp-sky", name: "TechFlow Skyscraper Outreach" },
    { id: "camp-premium", name: "Enterprise Context Links" }
  ];

  // AI Search rules and manual filter controllers
  const [lensMode, setLensMode] = useState<"ai" | "filters">("ai");
  const [aiTextFilter, setAiTextFilter] = useState<string>("");
  const [isAiTranslating, setIsAiTranslating] = useState<boolean>(false);
  const [translationActivity, setTranslationActivity] = useState<string>("");
  const [activeNlFilterCriteria, setActiveNlFilterCriteria] = useState<string | null>(null);

  // Manual Dropdown triggers
  const [keywordFilterText, setKeywordFilterText] = useState<string>("");
  const [drSelectorRange, setDrSelectorRange] = useState<string>("All");
  const [trafficSelectorRange, setTrafficSelectorRange] = useState<string>("All");
  const [overlapCountSelector, setOverlapCountSelector] = useState<string>("All");
  const [spamSelectorIndex, setSpamSelectorIndex] = useState<string>("All");
  const [contactStatusFilter, setContactStatusFilter] = useState<string>("All");
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState<string>("All");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("All");

  // Sidebar detail drawer variables
  const [focusedGapDetail, setFocusedGapDetail] = useState<CompetitorGapItem | null>(null);
  const [isSidebarFlyoutOpen, setIsSidebarFlyoutOpen] = useState<boolean>(false);
  const [interactiveReviewNote, setInteractiveReviewNote] = useState<string>("");

  // Helper trigger
  const triggerToast = (msg: string) => {
    setToast(null);
    setTimeout(() => setToast(msg), 40);
  };

  // Stepper dynamic captions
  const stepsDescriptor = {
    select: "Step 1: Select Active Projects — Check target projects to aggregate competitor backlink gaps. 'Uprankly' provides 87 gaps across 4 targets.",
    view: "Step 2: Aggregate Gap Metrics — Overview overlap parameters, prioritizations, and domain rating stats.",
    filter: "Step 3: Refine & Core Review — Query via plain English prompts or precise relational metric selectors.",
    enroll: "Step 4: Bulk Prospect Pipeline — Mark corresponding domains and migrate into active outreach campaigns.",
    outreach: "Step 5: High-DR Outreach Launch — Start sequencers, pre-generate copy via personalized templates, and launch sequence mailings."
  };

  // Project selector handlers
  const handleToggleProjectCheckbox = (projectType: string) => {
    setSelectedRowIds([]);
    setSelectedProjects((prev) => {
      if (prev.includes(projectType)) {
        // preserve at least one
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== projectType);
      } else {
        return [...prev, projectType];
      }
    });
    triggerToast(`Refined aggregator index. Reloading competitor domains list.`);
  };

  const handleSelectAllProjectsOption = () => {
    setSelectedRowIds([]);
    setSelectedProjects(["uprankly", "cyberguard", "techflow"]);
    triggerToast("Aggregated all checked project workspaces. Found 173 total gaps.");
  };

  const handleClearAllProjectsOption = () => {
    setSelectedRowIds([]);
    setSelectedProjects(["uprankly"]); // reset back to default
    triggerToast("Reset aggregator to default 'Uprankly' project workspace.");
  };

  // AI query natural language translator parsing mechanics
  const handleAiPromptTranslateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTextFilter.trim()) return;

    setIsAiTranslating(true);
    setActiveNlFilterCriteria(null);

    const workflows = [
      "Tokenizing plain text search operators...",
      "Resolving competitor link intersections with DR nodes...",
      "Configuring domain metrics rule engines..."
    ];

    let count = 0;
    const taskObj = setInterval(() => {
      if (count < workflows.length) {
        setTranslationActivity(workflows[count]);
        count++;
      } else {
        clearInterval(taskObj);
        setIsAiTranslating(false);

        const textLower = aiTextFilter.toLowerCase();
        let criteriaTerms: string[] = [];

        // Parse DR Range
        const drMatch = textLower.match(/dr\s*(\d+)\+?/);
        if (drMatch) {
          const val = parseInt(drMatch[1]);
          if (val >= 80) setDrSelectorRange("DR 80+");
          else if (val >= 70) setDrSelectorRange("DR 70+");
          else if (val >= 60) setDrSelectorRange("DR 60+");
          criteriaTerms.push(`Domain Rating >= ${val}`);
        } else if (textLower.includes("high dr") || textLower.includes("authority")) {
          setDrSelectorRange("DR 80+");
          criteriaTerms.push("High DR Rating Filter (DR 80+)");
        }

        // Parse Traffic Tier
        if (textLower.includes("1m") || textLower.includes("million")) {
          setTrafficSelectorRange("> 1M");
          criteriaTerms.push("Monthly Traffic > 1,000,000");
        } else if (textLower.includes("500k") || textLower.includes("half million")) {
          setTrafficSelectorRange("> 500K");
          criteriaTerms.push("Monthly Traffic > 500,000");
        } else if (textLower.includes("100k")) {
          setTrafficSelectorRange("> 100K");
          criteriaTerms.push("Monthly Traffic > 100,000");
        }

        // Parse Overlap targets number
        const overlapMatch = textLower.match(/(\d+)\+?\s*competitors?/);
        if (overlapMatch) {
          const countVal = parseInt(overlapMatch[1]);
          if (countVal >= 3) setOverlapCountSelector("3+ overlapping competitors");
          else if (countVal >= 2) setOverlapCountSelector("2+ overlapping competitors");
          criteriaTerms.push(`Competitor Overlap Over >= ${countVal}`);
        } else if (textLower.includes("multi rival") || textLower.includes("overlap")) {
          setOverlapCountSelector("3+ overlapping competitors");
          criteriaTerms.push("Multiple Rival Intersections (3+)");
        }

        // Parse Contact email status
        if (textLower.includes("contact") || textLower.includes("email") || textLower.includes("unlocked")) {
          setContactStatusFilter("Yes (Contact Available)");
          criteriaTerms.push("With direct verified webmaster contact");
        }

        // Parse Type of links
        if (textLower.includes("resource")) {
          setOpportunityTypeFilter("Resource Page");
          criteriaTerms.push("Type match: Resource Page Link");
        } else if (textLower.includes("guest")) {
          setOpportunityTypeFilter("Guest Post");
          criteriaTerms.push("Type match: Guest Blogging Placement");
        } else if (textLower.includes("editorial")) {
          setOpportunityTypeFilter("Editorial");
          criteriaTerms.push("Type match: Editorial Mentioned");
        }

        setActiveNlFilterCriteria(criteriaTerms.length > 0 ? criteriaTerms.join(" ➔ ") : "General Text Search Filter Applied");
        triggerToast(`Smart AI Search: Translated natural query into ${criteriaTerms.length} filter nodes.`);
      }
    }, 450);
  };

  // Manual reset of filters
  const handleResetProspectFilters = () => {
    setAiTextFilter("");
    setKeywordFilterText("");
    setDrSelectorRange("All");
    setTrafficSelectorRange("All");
    setOverlapCountSelector("All");
    setSpamSelectorIndex("All");
    setContactStatusFilter("All");
    setOpportunityTypeFilter("All");
    setLeadStatusFilter("All");
    setActiveNlFilterCriteria(null);
    setSelectedRowIds([]);
    triggerToast("Reset all search parameters to default filtered list view.");
  };

  // Core logic to filter list dynamically
  const computedListGaps = gaps.filter((item) => {
    // 1. Filter by Project Type selections
    if (!selectedProjects.includes(item.projectType)) {
      return false;
    }

    // 2. Keyword Filter Text
    if (keywordFilterText) {
      const q = keywordFilterText.toLowerCase();
      const matchText = item.domain.toLowerCase().includes(q) ||
                        item.type.toLowerCase().includes(q) ||
                        item.contactName.toLowerCase().includes(q) ||
                        item.competitors.some(c => c.name.toLowerCase().includes(q) || c.anchor.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    // 3. Domain Rating Bounds
    if (drSelectorRange !== "All") {
      if (drSelectorRange === "DR 80+" && item.dr < 80) return false;
      if (drSelectorRange === "DR 70+" && item.dr < 70) return false;
      if (drSelectorRange === "DR 60+" && item.dr < 60) return false;
    }

    // 4. Traffic values
    if (trafficSelectorRange !== "All") {
      if (trafficSelectorRange === "> 1M" && item.trafficNum < 1000000) return false;
      if (trafficSelectorRange === "> 500K" && item.trafficNum < 500000) return false;
      if (trafficSelectorRange === "> 100K" && item.trafficNum < 100000) return false;
    }

    // 5. Overlap counts
    if (overlapCountSelector !== "All") {
      if (overlapCountSelector === "3+ overlapping competitors" && item.overlap < 3) return false;
      if (overlapCountSelector === "2+ overlapping competitors" && item.overlap < 2) return false;
    }

    // 6. Spam indexes
    if (spamSelectorIndex !== "All") {
      if (spamSelectorIndex === "Low (< 2%)" && item.spamScore >= 2) return false;
      if (spamSelectorIndex === "Medium (< 5%)" && item.spamScore >= 5) return false;
    }

    // 7. Contact Status
    if (contactStatusFilter !== "All") {
      if (contactStatusFilter === "Yes (Contact Available)" && !item.hasContact) return false;
      if (contactStatusFilter === "No Contact Recs" && item.hasContact) return false;
    }

    // 8. Opportunity Layout Type
    if (opportunityTypeFilter !== "All") {
      if (item.type !== opportunityTypeFilter) return false;
    }

    // 9. Status Workflow level
    if (leadStatusFilter !== "All") {
      if (item.status !== leadStatusFilter) return false;
    }

    return true;
  });

  // Gaps state summary headers calculator
  const statisticResults = {
    total: computedListGaps.length,
    news: computedListGaps.filter(g => g.status === "New").length,
    contacts: computedListGaps.filter(g => g.hasContact).length,
    highs: computedListGaps.filter(g => g.score === "High").length
  };

  // Row selectors
  const handleToggleRowIdChecked = (id: string) => {
    setSelectedRowIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleToggleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(computedListGaps.map(g => g.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // Unlocking direct verified contact email
  const handleUnlockContactAction = (id: string, domain: string) => {
    if (researchCredits <= 0) {
      triggerToast("Error: No available search validation credits remaining.");
      return;
    }

    setGaps(prev => prev.map((g) => {
      if (g.id === id) {
        return { ...g, hasContact: true };
      }
      return g;
    }));

    setResearchCredits(prev => Math.max(0, prev - 1));
    triggerToast(`Unlocked verified target contact details for ${domain}! Direct email is resolved.`);
  };

  const handleRefillResearchCredits = () => {
    setResearchCredits(prev => prev + 100);
    triggerToast("Injected +100 expert research lookup credits into profile account.");
  };

  // Side bar drawer trigger
  const handleOpenInteractiveSidebar = (item: CompetitorGapItem) => {
    setFocusedGapDetail(item);
    setInteractiveReviewNote(localStorage.getItem(`note_linkpro_gap_${item.id}`) || "");
    setIsSidebarFlyoutOpen(true);
  };

  const handleSaveSidebarReviewNote = () => {
    if (!focusedGapDetail) return;
    localStorage.setItem(`note_linkpro_gap_${focusedGapDetail.id}`, interactiveReviewNote);
    triggerToast(`Preserved local research note for domain '${focusedGapDetail.domain}' successfully.`);
  };

  // CRM Bulk addition mechanism
  const handleBulkMigrateToCampaign = (campaignLabel: string) => {
    if (selectedRowIds.length === 0) {
      triggerToast("Please checked at least one domain gap row below.");
      setShowCampaignDropdown(false);
      return;
    }

    const targetsToEnroll = gaps.filter(g => selectedRowIds.includes(g.id));
    const savedCRM = localStorage.getItem("uprankly_crm_prospects") || "[]";
    try {
      const parsedCRM = JSON.parse(savedCRM);
      targetsToEnroll.forEach(item => {
        const alreadyExists = parsedCRM.some((c: any) => c.email === item.contactEmail);
        if (!alreadyExists) {
          parsedCRM.push({
            id: `gap-crm-${Date.now()}-${Math.random()}`,
            siteName: item.domain,
            person: item.contactName || "Webmaster Link Editorial",
            email: item.contactEmail || `editor@${item.domain}`,
            stage: "Planned",
            lastContact: "Just now",
            notes: `Added through Competitor Link Gaps list under campaign '${campaignLabel}'. Overlap competitors: ${item.overlap} rivals. DA: ${item.dr}.`
          });
        }
      });
      localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsedCRM));
    } catch (e) {
      // ignore
    }

    triggerToast(`Enrolled ${selectedRowIds.length} high priority domain references into campaign '${campaignLabel}'!`);
    setSelectedRowIds([]);
    setShowCampaignDropdown(false);
  };

  return (
    <div className="space-y-6" id="competitor-gaps-dashboard-v3">
      
      {/* 4.1 BREADCRUMBS & COMPREHENSIVE HEADER CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        
        {/* Breadcrumb row */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
          <span>Link Pro</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#0d9488] font-bold">Competitor Opportunities</span>
        </div>

        {/* Title and Credits Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-sans font-bold text-slate-800 tracking-tight">Competitor Opportunities</h2>
            <p className="text-xs text-[#6d7a77] font-medium mt-1">
              Discover high-value domains linking directly to competing pages, reverse-engineer their backlink strategy, and intercept placements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-rose-705 uppercase tracking-wider">Research credits:</span>
              <span className="text-xs font-mono font-black text-rose-900">{researchCredits}</span>
            </div>
            
            <button 
              onClick={handleRefillResearchCredits}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold"
              title="Add validation seeds"
            >
              <RefreshCw className="w-3 h-3 text-slate-400 animate-spin-hover" />
              <span>Refill</span>
            </button>
          </div>
        </div>

        {/* 4.2 Interactive Horizontal Phase Navigation (Stepper Tabs) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            {[
              { key: "select", label: "Select project" },
              { key: "view", label: "View gaps" },
              { key: "filter", label: "Filter & review" },
              { key: "enroll", label: "Add to prospect list" },
              { key: "outreach", label: "Outreach" }
            ].map((step, idx, arr) => {
              const isActive = currentStepperPhase === step.key;
              return (
                <React.Fragment key={step.key}>
                  <button
                    onClick={() => setCurrentStepperPhase(step.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                      isActive 
                        ? "bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20 shadow-2xs" 
                        : "bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300"
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
          
          {/* Stepper dynamic directions */}
          <div className="mt-3.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/50 flex items-center gap-2 text-xs text-slate-600 font-sans">
            <Info className="w-4 h-4 text-[#0d9488] shrink-0" />
            <span className="font-medium">{(stepsDescriptor as any)[currentStepperPhase]}</span>
          </div>
        </div>
      </div>

      {/* 4.3 SELECTED ACTIVE PROJECTS CONFIG PANEL */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-mono text-[10px] font-bold">1</span>
          <h3 className="text-xs font-sans font-bold uppercase text-slate-400 tracking-wider">Select targeting projects</h3>
          
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleSelectAllProjectsOption}
              className="text-[10px] font-bold text-[#0d9488] hover:underline"
            >
              Select All
            </button>
            <span className="text-slate-300 text-xs">|</span>
            <button
              onClick={handleClearAllProjectsOption}
              className="text-[10px] font-bold text-slate-400 hover:underline"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Select corresponding workspaces to aggregate competitive gap intersections of targeted rivals:
        </p>

        {/* Project Choice Cards Grid matches first screenshot perfectly */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* UPRANKLY WORKSPACE */}
          <div 
            onClick={() => handleToggleProjectCheckbox("uprankly")}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 select-none ${
              selectedProjects.includes("uprankly")
                ? "bg-teal-50/40 border-[#0d9488] shadow-2xs"
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <input 
              type="checkbox"
              checked={selectedProjects.includes("uprankly")}
              onChange={() => {}} // toggled via wrapper div
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 pointer-events-none"
            />
            
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
              U
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 block truncate">Uprankly</span>
              <span className="text-[10px] font-mono text-slate-400 block truncate">uprankly.com</span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-slate-700 block">87 Gaps</span>
              <span className="text-[9px] font-mono text-slate-400 block">4 competitors</span>
            </div>
          </div>

          {/* CYBERGUARD WORKSPACE */}
          <div 
            onClick={() => handleToggleProjectCheckbox("cyberguard")}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 select-none ${
              selectedProjects.includes("cyberguard")
                ? "bg-indigo-50/40 border-indigo-500 shadow-2xs"
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <input 
              type="checkbox"
              checked={selectedProjects.includes("cyberguard")}
              onChange={() => {}} 
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
            />
            
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
              C
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 block truncate">CyberGuard</span>
              <span className="text-[10px] font-mono text-slate-400 block truncate">cyberguard.io</span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-slate-700 block">52 Gaps</span>
              <span className="text-[9px] font-mono text-slate-400 block">3 competitors</span>
            </div>
          </div>

          {/* TECHFLOW WORKSPACE */}
          <div 
            onClick={() => handleToggleProjectCheckbox("techflow")}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 select-none ${
              selectedProjects.includes("techflow")
                ? "bg-purple-50/40 border-purple-500 shadow-2xs"
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <input 
              type="checkbox"
              checked={selectedProjects.includes("techflow")}
              onChange={() => {}} 
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 pointer-events-none"
            />
            
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
              T
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 block truncate">TechFlow</span>
              <span className="text-[10px] font-mono text-slate-400 block truncate">techflow.dev</span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-slate-700 block">34 Gaps</span>
              <span className="text-[9px] font-mono text-slate-400 block">2 competitors</span>
            </div>
          </div>

        </div>

        {/* Selected Project filter bar tag indicator */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active filters:</span>
          {selectedProjects.map((p) => {
            const label = p === "uprankly" ? "Uprankly (87 Gaps)" :
                          p === "cyberguard" ? "CyberGuard (52 Gaps)" : "TechFlow (34 Gaps)";
            return (
              <span 
                key={p} 
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                <span>{label}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleProjectCheckbox(p);
                  }}
                  className="hover:text-red-500 font-black"
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* 4.4 NATURAL LANGUAGE SEARCH TRANS-ENGINE vs DETAILED FILTERS GRID */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        
        {/* Switch selectors */}
        <div className="flex items-center gap-1 bg-slate-150 p-1 rounded-xl w-fit border border-slate-200">
          <button 
            type="button"
            onClick={() => setLensMode("ai")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              lensMode === "ai" 
                ? "bg-white text-[#0d9488] shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>AI Search</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setLensMode("filters")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              lensMode === "filters" 
                ? "bg-white text-[#0d9488] shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Filters</span>
          </button>
        </div>

        {/* AI Prompt search mode */}
        {lensMode === "ai" ? (
          <form onSubmit={handleAiPromptTranslateSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder='e.g. "DR 80+ gaps with contact info that overlap 3+ competitors"'
                  value={aiTextFilter}
                  onChange={(e) => setAiTextFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-205 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-500/5 hover:bg-slate-50/40 outline-none font-medium"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isAiTranslating}
                className="px-6 py-3 bg-[#0d9488] hover:bg-[#0b8e81] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none border-t border-[#12c4b5]"
              >
                {isAiTranslating ? (
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
            
            <p className="text-[11px] text-slate-400">
              Describe what you're looking for in plain English. Link Pro will parse metrics, overlapping counts, and types automatically.
            </p>

            {/* Simulated Live CLI compiler console printout */}
            {isAiTranslating && (
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl text-xs font-mono text-emerald-400 animate-pulse flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#0d9488]" />
                <span>{translationActivity}</span>
              </div>
            )}

            {/* Filter Node confirmation */}
            {activeNlFilterCriteria && !isAiTranslating && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-150 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-emerald-600 text-white font-mono font-bold px-1.5 py-0.5 rounded uppercase">NL TRANS</span>
                  <span className="font-mono text-[11px] font-medium">{activeNlFilterCriteria}</span>
                </div>
                
                <button 
                  type="button"
                  onClick={handleResetProspectFilters}
                  className="text-[10px] underline font-bold hover:text-[#0d9488]"
                >
                  Clear Translation
                </button>
              </div>
            )}
          </form>
        ) : (
          /* MANUAL FILTERS DROPDOWN CONTROLS (Covers complete standard screens parameters) */
          <div className="space-y-4 animate-fade-in font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Keyword Text Search */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Search Domain</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. backlinko or yoast..."
                    value={keywordFilterText}
                    onChange={(e) => setKeywordFilterText(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              {/* DR Range selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Domain Rating (DR)</label>
                <select
                  value={drSelectorRange}
                  onChange={(e) => setDrSelectorRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold"
                >
                  <option value="All">All DR Scores</option>
                  <option value="DR 80+">DR 80+ (High Authority)</option>
                  <option value="DR 70+">DR 70+ (Moderate High)</option>
                  <option value="DR 60+">DR 60+ (Medium)</option>
                </select>
              </div>

              {/* Traffic range */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Search Traffic</label>
                <select
                  value={trafficSelectorRange}
                  onChange={(e) => setTrafficSelectorRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold"
                >
                  <option value="All">All Traffic Volumes</option>
                  <option value="> 1M">&gt; 1M /mo views</option>
                  <option value="> 500K">&gt; 500K /mo views</option>
                  <option value="> 100K">&gt; 100K /mo views</option>
                </select>
              </div>

              {/* Competitor count overlap thresholds */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Competitor Overlaps</label>
                <select
                  value={overlapCountSelector}
                  onChange={(e) => setOverlapCountSelector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold"
                >
                  <option value="All">All Overlaps</option>
                  <option value="3+ overlapping competitors">3+ Competitors Linked</option>
                  <option value="2+ overlapping competitors">2+ Competitors Linked</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              
              {/* Max Spam score limit */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Max Spam Indicator</label>
                <select
                  value={spamSelectorIndex}
                  onChange={(e) => setSpamSelectorIndex(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold"
                >
                  <option value="All">All Spam scores</option>
                  <option value="Low (< 2%)">Very Safe (&lt; 2%)</option>
                  <option value="Medium (< 5%)">Moderate Max (&lt; 5%)</option>
                </select>
              </div>

              {/* Contact available Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Info Resolving</label>
                <select
                  value={contactStatusFilter}
                  onChange={(e) => setContactStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold"
                >
                  <option value="All">All Sites</option>
                  <option value="Yes (Contact Available)">Verified Contact Person</option>
                  <option value="No Contact Recs">No direct email mapped</option>
                </select>
              </div>

              {/* Opportunity Layout Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Opportunity Type</label>
                <select
                  value={opportunityTypeFilter}
                  onChange={(e) => setOpportunityTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                >
                  <option value="All">All Types</option>
                  <option value="Resource Page">Resource Page</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Guest Post">Guest Post</option>
                </select>
              </div>

              {/* Status workflow dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prospecting Status</label>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                >
                  <option value="All">All Gaps</option>
                  <option value="New">New Gaps Only</option>
                  <option value="Pitched">Pitched</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetProspectFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Reset Filter Fields
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4.5 STATISTICAL GAPS COUNTERS (Matches second screenshot exactly) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Aggregated badge lines */}
        <div className="flex items-center gap-3.5 text-xs font-sans font-medium">
          <span className="text-slate-800 font-bold">
            <span className="font-mono text-sm font-black text-slate-900 mr-1">{statisticResults.total}</span>
            gaps
          </span>
          <span className="text-blue-600 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md">
            <span className="font-mono font-black">{statisticResults.news}</span> new
          </span>
          <span className="text-slate-700 font-bold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
            <span className="font-mono font-black">{statisticResults.contacts}</span> with contact
          </span>
          <span className="text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md">
            <span className="font-mono font-black">{statisticResults.highs}</span> high priority
          </span>
        </div>

        {/* Bulk tools bar (Add Selected targets, Columns toggles) */}
        <div className="flex items-center gap-3">
          
          {/* Add to campaign Selection dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCampaignDropdown(!showCampaignDropdown)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Add to List</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            
            {showCampaignDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden font-sans">
                <div className="p-2 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target sequencing lists
                </div>
                <div className="py-1">
                  {coreCampaigns.map((camp) => (
                    <button
                      key={camp.id}
                      onClick={() => handleBulkMigrateToCampaign(camp.name)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer flex items-center gap-2 font-medium"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#0d9488]" />
                      <span>{camp.name}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-slate-100 my-1" />
                  
                  <button
                    onClick={() => {
                      triggerToast("Launching target campaign architect draft editor...");
                      setShowCampaignDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#0d9488] font-bold hover:bg-slate-50 transition-colors block"
                  >
                    + Create New Custom Campaign
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Column View Toggle popover */}
          <div className="relative">
            <button 
              onClick={() => setShowColumnsMenu(!showColumnsMenu)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-2 select-none"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Columns</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showColumnsMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-205 rounded-xl shadow-xl z-20 overflow-hidden text-xs font-sans">
                <div className="p-3 border-b border-slate-100 bg-slate-50 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                  Set Column Visibility
                </div>
                
                <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto font-medium">
                  {Object.keys(displayedColumns).map((colKey) => {
                    const label = colKey === "spamScore" ? "Spam Score" :
                                  colKey === "dr" ? "Domain Authority (DR)" :
                                  colKey.charAt(0).toUpperCase() + colKey.slice(1);
                    return (
                      <label key={colKey} className="flex items-center justify-between cursor-pointer select-none">
                        <span className="text-slate-600 font-bold">{label}</span>
                        <input 
                          type="checkbox"
                          checked={(displayedColumns as any)[colKey]}
                          onChange={() => {
                            setDisplayedColumns(prev => ({
                              ...prev,
                              [colKey]: !(prev as any)[colKey]
                            }));
                          }}
                          className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                        />
                      </label>
                    );
                  })}
                </div>
                
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-right">
                  <button
                    onClick={() => setDisplayedColumns({
                      domain: true,
                      dr: true,
                      traffic: true,
                      overlap: true,
                      score: true,
                      type: true,
                      contact: true,
                      status: true
                    })}
                    className="text-[10px] text-[#0d9488] font-bold hover:underline"
                  >
                    Reset standard display
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {selectedRowIds.length} flagged
          </div>

        </div>
      </div>

      {/* 4.6 DATA GRID TABLE matches second screenshot style and contents exactly */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="interactive-gaps-table">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[#4a5553] font-bold uppercase tracking-wider text-[10px]">
              
              <th className="p-4 pl-6 w-10">
                <input 
                  type="checkbox"
                  checked={computedListGaps.length > 0 && selectedRowIds.length === computedListGaps.length}
                  onChange={handleToggleSelectAllRows}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </th>

              {displayedColumns.domain && <th className="p-4">Domain</th>}
              {displayedColumns.dr && <th className="p-4">DR &darr;&uarr;</th>}
              {displayedColumns.traffic && <th className="p-4">Traffic &darr;&uarr;</th>}
              {displayedColumns.overlap && <th className="p-4">Overlap &darr;&uarr;</th>}
              {displayedColumns.score && <th className="p-4">Score</th>}
              {displayedColumns.type && <th className="p-4">Type</th>}
              {displayedColumns.contact && <th className="p-4">Contact</th>}
              {displayedColumns.status && <th className="p-4">Status</th>}
              
              <th className="p-4 pr-6 text-right">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 font-medium">
            {computedListGaps.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-12 text-center text-slate-400">
                  <div className="max-w-sm mx-auto space-y-3">
                    <Target className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-sans font-bold text-slate-705">No competitive gaps found matching requirements</p>
                    <p className="text-xs text-slate-405">
                      Adjust project filters, plain text modifiers, or authority bounds to load additional citation sources.
                    </p>
                    <button
                      onClick={handleResetProspectFilters}
                      className="px-4 py-2 bg-[#0d9488] hover:bg-[#0b8e81] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Clear Search Parameters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              computedListGaps.map((item) => {
                const isRowChecked = selectedRowIds.includes(item.id);
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-[#0d9488]/5 transition-colors text-slate-755 ${
                      isRowChecked ? "bg-teal-50/10" : ""
                    }`}
                  >
                    
                    {/* Row Selector Checkbox */}
                    <td className="p-4 pl-6">
                      <input 
                        type="checkbox"
                        checked={isRowChecked}
                        onChange={() => handleToggleRowIdChecked(item.id)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Domain name */}
                    {displayedColumns.domain && (
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleOpenInteractiveSidebar(item)}
                          className="font-bold text-slate-800 hover:text-[#0d9488] hover:underline flex items-center gap-2 cursor-pointer text-left transition-colors"
                        >
                          <Target className="w-3.5 h-3.5 text-rose-450 shrink-0" />
                          <span>{item.domain}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          Project workspace: <span className="capitalize text-slate-500 font-bold">{item.projectType}</span>
                        </span>
                      </td>
                    )}

                    {/* Domain Rating */}
                    {displayedColumns.dr && (
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono font-bold px-2.5 py-1 rounded text-xs">
                          {item.dr}
                        </span>
                      </td>
                    )}

                    {/* Monthly SEO Traffic */}
                    {displayedColumns.traffic && (
                      <td className="p-4 font-mono font-bold text-slate-700">
                        {item.traffic}
                      </td>
                    )}

                    {/* Overlaps count matches screenshot badge perfectly */}
                    {displayedColumns.overlap && (
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 text-slate-600 font-mono font-bold">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.overlap}</span>
                        </span>
                      </td>
                    )}

                    {/* Priority Score */}
                    {displayedColumns.score && (
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.score === "High" ? "bg-red-50 text-red-700 border border-red-100" :
                          item.score === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}>
                          {item.score}
                        </span>
                      </td>
                    )}

                    {/* Placement Type tag */}
                    {displayedColumns.type && (
                      <td className="p-4">
                        <span className="bg-slate-100/80 text-slate-700 border border-slate-200/50 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.type}
                        </span>
                      </td>
                    )}

                    {/* Contact indicator */}
                    {displayedColumns.contact && (
                      <td className="p-4">
                        {item.hasContact ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full inline-block" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                    )}

                    {/* Pitch Status indicator */}
                    {displayedColumns.status && (
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === "New" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          item.status === "Pitched" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                          "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    )}

                    {/* Quick Row action */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenInteractiveSidebar(item)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0d9488] hover:border-[#0d9488] hover:bg-slate-50 rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>+ Add to List</span>
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      {/* 4.7 HIGH-FIDELITY SIDEBAR SLIDEdrawer FLYOUT panel matches full tech directory portals */}
      {isSidebarFlyoutOpen && focusedGapDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-all flex justify-end font-sans">
          
          {/* Backer closer */}
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setIsSidebarFlyoutOpen(false)} 
          />

          {/* Core Panel Content */}
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
            
            {/* Drawer Header block */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-rose-600 text-white font-mono font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                    Competitor Intersection
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {focusedGapDetail.id}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Globe className="w-5 h-5 text-[#0d9488]" />
                  <span>{focusedGapDetail.domain}</span>
                </h3>
              </div>

              <button 
                onClick={() => setIsSidebarFlyoutOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Drawer Body scrollable */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* Domain metrics row box */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Authority</span>
                  <span className="text-sm font-mono font-black text-[#0d9488] mt-0.5 block">DR {focusedGapDetail.dr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Traffic /mo</span>
                  <span className="text-sm font-mono font-black text-slate-800 mt-0.5 block">{focusedGapDetail.traffic}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Spam score</span>
                  <span className="text-sm font-mono font-black text-amber-600 mt-0.5 block">{focusedGapDetail.spamScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Linked Rivals</span>
                  <span className="text-sm font-mono font-black text-rose-500 mt-0.5 block">{focusedGapDetail.overlap}</span>
                </div>
              </div>

              {/* RIVAL INTERSECTION LANDING PAGES (Extremely high-grade realistic mock data) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Rivals backlink intersections on this domain:
                </h4>

                <div className="space-y-2.5">
                  {focusedGapDetail.competitors.map((comp, rIdx) => (
                    <div key={rIdx} className="bg-white p-3 rounded-xl border border-slate-204 space-y-1.5 text-xs">
                      
                      <div className="flex items-center justify-between">
                        <span className="text-amber-800 bg-amber-50 font-bold px-2 py-0.5 rounded border border-amber-100">
                          {comp.name}
                        </span>
                        
                        <a 
                          href={`https://${focusedGapDetail.domain}${comp.targetUrl}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-slate-405 hover:text-[#0d9488] transition-colors inline-flex items-center gap-0.5"
                        >
                          <span>Review target page</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="space-y-1 font-sans">
                        <div className="text-slate-400 text-[11px]">
                          Competitor landing page path:
                          <span className="font-mono text-slate-600 font-bold block bg-slate-50 p-1 rounded mt-0.5 overflow-x-auto">
                            {comp.targetUrl}
                          </span>
                        </div>

                        <div className="text-slate-600 text-[11px] pt-1">
                          Anchor Text used: &ldquo;<span className="text-slate-800 italic font-bold">{comp.anchor}</span>&rdquo;
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* BACKLINK AND ESTIMATED VALUE BOX */}
              <div className="space-y-2 text-xs">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">SEO Attributes</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Backlinks Index count:</span>
                    <span className="font-mono font-bold text-slate-850">{focusedGapDetail.backlinks.toLocaleString()} refs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Referring IP Domains list:</span>
                    <span className="font-mono font-bold text-slate-850">{focusedGapDetail.refDomains.toLocaleString()} subnets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Acquisition pricing format:</span>
                    <span className="font-sans font-black text-teal-700">{focusedGapDetail.estimatedCost}</span>
                  </div>
                </div>
              </div>

              {/* DIRECT CONTACT EMAIL RESOLVING PORTAL DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Target Webmaster Contacts</h4>
                
                <div className="bg-[#0d9488]/5 p-4 rounded-xl border border-[#0d9488]/10 space-y-3 font-sans">
                  {focusedGapDetail.hasContact ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-slate-400 text-[10px] block font-sans">VERIFIED PROFESSIONAL:</span>
                          <span className="font-bold text-slate-800 text-xs">{focusedGapDetail.contactName}</span>
                        </div>
                        <span className="font-mono text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">
                          RESOLVED
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 mt-1.5">
                        <div>
                          <span className="text-slate-400 text-[10px] block font-sans">DIRECT DIRECT MAIL:</span>
                          <span className="font-mono text-slate-800 font-bold block overflow-x-auto">{focusedGapDetail.contactEmail}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(focusedGapDetail.contactEmail);
                            triggerToast("Webmaster mail copied to clipboard!");
                          }}
                          className="text-[#0d9488] hover:underline font-bold text-[10px] shrink-0"
                        >
                          Copy
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 italic">
                        Contact resolved instantly using standard lookup keys validation pipeline. Direct outreach deliverability score: 98%.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        The core direct publisher and editorial manager emails on <span className="font-bold text-slate-800">{focusedGapDetail.domain}</span> are currently locked. Validate using research points?
                      </p>
                      
                      <button
                        onClick={() => {
                          handleUnlockContactAction(focusedGapDetail.id, focusedGapDetail.domain);
                          // Update active drawer instance
                          setFocusedGapDetail(prev => prev ? { ...prev, hasContact: true } : null);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-95 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 border-t border-red-400"
                      >
                        <span>Unlock Direct Email Contact</span>
                        <span className="bg-rose-955 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-black">1 Credit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* DYNAMIC CAMPAIGN CREATION/Shortlist ENROLL FORM */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Enroll Prospect into outreach sequence</h4>
                <div className="flex gap-2">
                  <select 
                    id="sidebar-campaign-select"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none font-bold"
                  >
                    {coreCampaigns.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const sel = (document.getElementById("sidebar-campaign-select") as HTMLSelectElement)?.value || "Uprankly Guest Posting";
                      const savedCRM = localStorage.getItem("uprankly_crm_prospects") || "[]";
                      try {
                        const parsedCRM = JSON.parse(savedCRM);
                        const alreadyExists = parsedCRM.some((c: any) => c.email === focusedGapDetail.contactEmail);
                        if (!alreadyExists) {
                          parsedCRM.push({
                            id: `gap-crm-${Date.now()}`,
                            siteName: focusedGapDetail.domain,
                            person: focusedGapDetail.contactName,
                            email: focusedGapDetail.contactEmail,
                            stage: "Planned",
                            lastContact: "Just now",
                            notes: `Enrolled via interactive details drawer panel on competitor site. DA: ${focusedGapDetail.dr} | Type: ${focusedGapDetail.type}.`
                          });
                        }
                        localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsedCRM));
                      } catch (e) {
                        // ignore
                      }
                      triggerToast(`Successfully enrolled '${focusedGapDetail.domain}' in campaign '${sel}'!`);
                      setIsSidebarFlyoutOpen(false);
                    }}
                    className="px-4 py-2 bg-[#0d9488] hover:bg-[#0b8e81] text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Enroll Site
                  </button>
                </div>
              </div>

              {/* INTERACTIVE COMPILATION NOTES TAB */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                  Interactive Research Notes:
                </label>
                <textarea
                  placeholder="Type outreach pitch customization ideas or content angles to suggest during sequence generation..."
                  value={interactiveReviewNote}
                  onChange={(e) => setInteractiveReviewNote(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-205 rounded-xl outline-none focus:ring-1 focus:ring-teal-500 h-24 font-medium"
                />
                
                <button
                  onClick={handleSaveSidebarReviewNote}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold block ml-auto transition-colors"
                >
                  Save Research Note
                </button>
              </div>

            </div>

            {/* Drawer Footer controls */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              
              <button
                onClick={() => {
                  const saved = localStorage.getItem("uprankly_saved_words") || "[]";
                  try {
                    const parsed = JSON.parse(saved);
                    if (!parsed.includes(focusedGapDetail.domain)) {
                      parsed.push(focusedGapDetail.domain);
                      localStorage.setItem("uprankly_saved_words", JSON.stringify(parsed));
                    }
                  } catch (e) {
                    // ignore
                  }
                  triggerToast(`Shortlisted '${focusedGapDetail.domain}' in personal workspace bookmarks!`);
                  setIsSidebarFlyoutOpen(false);
                }}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Save to Shortlist</span>
              </button>

              <button
                onClick={() => {
                  triggerToast(`Designating domain '${focusedGapDetail.domain}' for immediate priority pitching sequences.`);
                  setIsSidebarFlyoutOpen(false);
                }}
                className="px-4 py-2 bg-[#0d9488] hover:bg-[#0c8276] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Pitch Competitor Gap
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Local system toast notification matching platform */}
      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}

    </div>
  );
}
