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

export function KeywordProspectingView() {
  // Stepper state
  const [activeStep, setActiveStep] = useState<"add-keywords" | "serp-scan" | "review-sites" | "enrich-contacts" | "outreach">("add-keywords");
  
  // General alerts
  const [toast, setToast] = useState<string | null>(null);

  // Step 1: Project Picker
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Base list of projects
  const projects = [
    { id: "proj-1", name: "Uprankly", domain: "uprankly.com", letter: "U", bg: "bg-slate-100 text-slate-800" },
    { id: "proj-2", name: "CyberGuard", domain: "cyberguard.io", letter: "C", bg: "bg-slate-100 text-slate-800" },
    { id: "proj-3", name: "TechFlow", domain: "techflow.dev", letter: "T", bg: "bg-slate-100 text-slate-800" }
  ];

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) || 
    p.domain.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // Main keywords table
  interface ProspectKeyword {
    id: string;
    phrase: string;
    prospectsCount: number | null;
    status: "Searched" | "Not Searched" | "Searching";
    usedInCampaigns: string;
    selected?: boolean;
    isRecommended?: boolean;
  }

  const [keywords, setKeywords] = useState<ProspectKeyword[]>([
    { id: "kw-1", phrase: "SaaS SEO", prospectsCount: 42, status: "Searched", usedInCampaigns: "1 campaign" },
    { id: "kw-2", phrase: "Link Building", prospectsCount: 23, status: "Searched", usedInCampaigns: "—" },
    { id: "kw-3", phrase: "Guest Posting", prospectsCount: null, status: "Not Searched", usedInCampaigns: "—" },
    { id: "kw-4", phrase: "Marketing Automation", prospectsCount: null, status: "Not Searched", usedInCampaigns: "—" },
    { id: "kw-5", phrase: "Content Marketing", prospectsCount: null, status: "Not Searched", usedInCampaigns: "2 campaigns" },
    { id: "kw-6", phrase: "SEO Tools", prospectsCount: 38, status: "Searched", usedInCampaigns: "1 campaign" }
  ]);

  // Recommended keywords drawer
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([
    { phrase: "Technical SEO", source: "from competitor analysis", volume: "~8,100/mo", checked: false },
    { phrase: "SEO Audit Tools", source: "from related searches", volume: "~3,200/mo", checked: false },
    { phrase: "Backlink Analysis", source: "from competitor analysis", volume: "~5,400/mo", checked: false }
  ]);

  // Bulk add text area
  const [customAddQuery, setCustomAddQuery] = useState("");

  // Search Credits (as seen in screenshots: credit, balance: 200)
  const [credits, setCredits] = useState(200);

  // Step 2 Scan simulation parameters
  const [scannerProgress, setScannerProgress] = useState(0);
  const [scannerLogs, setScannerLogs] = useState<string[]>([]);
  const [scannedKeywordsList, setScannedKeywordsList] = useState<string[]>([]);

  // Step 3: Discovered prospects list (dynamic template)
  interface DiscoveredProspect {
    id: string;
    domain: string;
    dr: number;
    traffic: string;
    opportunityType: string;
    checked?: boolean;
    enriched?: boolean;
    email?: string;
    authorName?: string;
  }

  const [discoveredProspects, setDiscoveredProspects] = useState<DiscoveredProspect[]>([
    { id: "pr-1", domain: "searchenginejournal.com", dr: 89, traffic: "3.4M/mo", opportunityType: "Resource Page inclusion", checked: true },
    { id: "pr-2", domain: "backlinko.com", dr: 81, traffic: "1.2M/mo", opportunityType: "Content pitch guest spot", checked: true },
    { id: "pr-3", domain: "neilpatel.com", dr: 88, traffic: "4.8M/mo", opportunityType: "Anchor reference swap", checked: true },
    { id: "pr-4", domain: "moz.com/blog", dr: 91, traffic: "2.1M/mo", opportunityType: "Listicle reference insertion", checked: false },
    { id: "pr-5", domain: "hubspot.com/blog", dr: 93, traffic: "14.2M/mo", opportunityType: "Skyscraper mention claim", checked: false },
    { id: "pr-6", domain: "marketingprofs.com", dr: 77, traffic: "640K/mo", opportunityType: "Guest Post proposal", checked: false },
    { id: "pr-7", domain: "smartpassiveincome.com", dr: 74, traffic: "880K/mo", opportunityType: "Resource swap list", checked: false },
  ]);

  // Contacts enrichment state (Step 4)
  const [enrichmentRunning, setEnrichmentRunning] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);

  // Step 5: Campaign Outreach template composer state
  const [selectedCampaignId, setSelectedCampaignId] = useState("c-1");
  const [chosenTemplate, setChosenTemplate] = useState("Skyscraper Pitch");
  const [emailSubject, setEmailSubject] = useState("Quick suggestion for your resource index");
  const [emailBody, setEmailBody] = useState("Hi [Author Name],\n\nI was reviewing your page on [Domain] and noticed you highlighted some great platforms.\n\nWe recently launched an updated resource framework. Would love to know if you're open to pointing a reference code back to our service?\n\nThank you,\nPartnership Desk");

  // Local helper to display Toast notifications
  const triggerToast = (msg: string) => {
    setToast(null);
    setTimeout(() => setToast(msg), 50);
  };

  // Toggle selection on the main table
  const handleToggleKeywordSelect = (id: string) => {
    setKeywords(prev => prev.map(k => {
      if (k.id === id) {
        return { ...k, selected: !k.selected };
      }
      return k;
    }));
  };

  // Toggle selection of all items
  const handleToggleAllKeywords = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setKeywords(prev => prev.map(k => ({ ...k, selected: isChecked })));
  };

  // Toggle checkout for recommendations
  const handleToggleRecommendationSelect = (phrase: string) => {
    setRecommendations(prev => prev.map(r => {
      if (r.phrase === phrase) {
        const nextChecked = !r.checked;
        // Also ensure keyword is in keywords with checked state
        if (nextChecked) {
          setKeywords(prevKw => {
            const exists = prevKw.some(k => k.phrase.toLowerCase() === phrase.toLowerCase());
            if (!exists) {
              return [...prevKw, {
                id: `kw-rec-${Date.now()}-${Math.random()}`,
                phrase,
                prospectsCount: Math.floor(Math.random() * 30) + 15,
                status: "Searched",
                usedInCampaigns: "—",
                selected: true,
                isRecommended: true
              }];
            } else {
              return prevKw.map(k => k.phrase.toLowerCase() === phrase.toLowerCase() ? { ...k, selected: true } : k);
            }
          });
          triggerToast(`Selected recommended keyword: ${phrase}`);
        } else {
          // Deselect
          setKeywords(prevKw => prevKw.map(k => k.phrase.toLowerCase() === phrase.toLowerCase() ? { ...k, selected: false } : k));
        }
        return { ...r, checked: nextChecked };
      }
      return r;
    }));
  };

  // Quick Action: Search single keyword now
  const handleSearchSingleKeyword = (id: string, phrase: string) => {
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, status: "Searching" } : k));
    setTimeout(() => {
      const prospectsAdded = Math.floor(Math.random() * 35) + 10;
      setKeywords(prev => prev.map(k => {
        if (k.id === id) {
          return { ...k, status: "Searched", prospectsCount: prospectsAdded };
        }
        return k;
      }));
      setCredits(prev => Math.max(0, prev - 1));
      triggerToast(`Successfully completed SERP scan for '${phrase}'! Found ${prospectsAdded} prospects.`);
    }, 1000);
  };

  // Quick Action: Import historical keyword results for free
  const handleImportSingleKeyword = (phrase: string, count: number) => {
    triggerToast(`Imported ${count} legacy citation contacts for phrase '${phrase}'!`);
  };

  // Add custom keywords manually
  const handleAddCustomKeywords = () => {
    if (!customAddQuery.trim()) return;
    const splitArr = customAddQuery.split(",").map(s => s.trim()).filter(s => s.length > 0);
    if (splitArr.length === 0) return;

    setKeywords(prev => {
      const updated = [...prev];
      splitArr.forEach(term => {
        const exists = updated.some(k => k.phrase.toLowerCase() === term.toLowerCase());
        if (!exists) {
          updated.push({
            id: `kw-custom-${Date.now()}-${Math.random()}`,
            phrase: term,
            prospectsCount: null,
            status: "Not Searched",
            usedInCampaigns: "—",
            selected: true
          });
        }
      });
      return updated;
    });

    setCustomAddQuery("");
    triggerToast(`Added ${splitArr.length} custom search target words!`);
  };

  // Clear all selected keywords
  const handleClearAllSelections = () => {
    setKeywords(prev => prev.map(k => ({ ...k, selected: false })));
    setRecommendations(prev => prev.map(r => ({ ...r, checked: false })));
    triggerToast("Cleared shortlists selections.");
  };

  // Get count of checked keywords
  const selectedKeywords = keywords.filter(k => k.selected);

  // START PROSPECTING (Trigger Step 2)
  const handleStartProspecting = () => {
    if (selectedKeywords.length === 0) return;
    setActiveStep("serp-scan");
    setScannerProgress(0);
    setScannerLogs([]);
    const activePhrases = selectedKeywords.map(k => k.phrase);
    setScannedKeywordsList(activePhrases);

    const stepLogs = [
      "Initializing search pipeline query threads...",
      "Establishing secure headless proxy connections...",
      "Connecting to Google SERP API (Target Region: US-English)...",
      ...activePhrases.flatMap(pk => [
        `Searching keyword: "${pk}"`,
        `Analyzing organic positions rank 1-100...`,
        `Detected high value competitor coverage gaps on "${pk}"...`
      ]),
      "Mapping domain ratings and Moz Authority profiles...",
      "Deduplicating outbound editorial target domains...",
      "SERP scanner completed successfully!"
    ];

    let logIndex = 0;
    const logsInterval = setInterval(() => {
      if (logIndex < stepLogs.length) {
        setScannerLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${stepLogs[logIndex]}`]);
        logIndex++;
      }
    }, 250);

    const progressInterval = setInterval(() => {
      setScannerProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(logsInterval);
          setTimeout(() => {
            setActiveStep("review-sites");
            triggerToast("SERP crawler complete! Discovered 7 recommended outreach domains.");
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 380);
  };

  // Step 3 UI functions
  const handleToggleProspectSelect = (id: string) => {
    setDiscoveredProspects(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  const handleToggleAllProspects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setDiscoveredProspects(prev => prev.map(p => ({ ...p, checked: isChecked })));
  };

  // Step 4 UI functions (Enrich contacts)
  const handleStartEnrichment = () => {
    const checkedProspects = discoveredProspects.filter(p => p.checked);
    if (checkedProspects.length === 0) {
      triggerToast("Please check at least one site to enrich!");
      return;
    }
    setActiveStep("enrich-contacts");
    setEnrichmentRunning(true);
    setEnrichmentProgress(0);

    const names = ["Brian Dean", "Rand Fishkin", "Ann Handley", "Pat Flynn", "Ryan Deiss", "Kipp Bodnar", "Tim Soulo"];
    const emails = ["brian@backlinko.com", "rand@sparktoro.com", "ann@marketingprofs.com", "pat@smartpassiveincome.com", "ryan@digitalmarketer.com", "editor@hubspot.com", "tim@ahrefs.com"];

    const interval = setInterval(() => {
      setEnrichmentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setEnrichmentRunning(false);
          // Enrich checked ones
          setDiscoveredProspects(prevD => prevD.map((p, idx) => {
            if (p.checked) {
              return {
                ...p,
                enriched: true,
                email: emails[idx % emails.length],
                authorName: names[idx % names.length]
              };
            }
            return p;
          }));
          triggerToast("Successfully resolved and validated 100% deliverable webmaster emails!");
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Step 5 UI Launch Campaign
  const handleLaunchSequence = () => {
    const enrichedItems = discoveredProspects.filter(p => p.checked && p.enriched);
    if (enrichedItems.length === 0) {
      triggerToast("No enriched contacts selected. Please complete Step 4!");
      return;
    }

    // Get active CRM list
    const savedCRM = localStorage.getItem("uprankly_crm_prospects") || "[]";
    try {
      const parsedCRM = JSON.parse(savedCRM);
      enrichedItems.forEach(item => {
        const exists = parsedCRM.some((c: any) => c.email === item.email);
        if (!exists) {
          parsedCRM.push({
            id: `prospect-${Date.now()}-${Math.random()}`,
            siteName: item.domain,
            person: item.authorName || "Editorial Manager",
            email: item.email || `editor@${item.domain}`,
            stage: "Planned",
            lastContact: "Just now",
            notes: `Enrolled via Keyword Prospecting scanner inside Campaign '${chosenTemplate}'. Subject target: ${emailSubject}.`
          });
        }
      });
      localStorage.setItem("uprankly_crm_prospects", JSON.stringify(parsedCRM));
    } catch (e) {
      // ignore
    }

    setToast(null);
    setActiveStep("outreach");
    triggerToast(`Successfully launched outreach drip containing ${enrichedItems.length} active pipelines!`);
    
    // Simulate redirection state or screen success
    setTimeout(() => {
      setActiveStep("add-keywords");
      handleClearAllSelections();
    }, 2500);
  };

  // Derive calculated totals for statistics row
  const calculatedKeywordsCount = keywords.length;
  const calculatedSearchedCount = keywords.filter(k => k.status === "Searched").length;
  const calculatedProspectsCount = keywords.reduce((acc, k) => acc + (k.prospectsCount || 0), 0);

  return (
    <div className="space-y-6" id="keyword-prospecting-panel">
      
      {/* Backlink breadcrumbs & Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
          <span>Link Pro</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#0d9488] font-bold">Keyword Prospecting</span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-sans font-bold text-slate-800 tracking-tight">Keyword Prospecting</h2>
            <p className="text-xs text-[#6d7a77] font-medium mt-1">Find sites ranking for your target keywords via Google SERP analysis</p>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Search Credits:</span>
            <span className="text-xs font-mono font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100">
              {credits} Remaining
            </span>
          </div>
        </div>

        {/* Five Step Stepper Row */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            {/* Step 1 */}
            <button 
              onClick={() => setActiveStep("add-keywords")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all text-[11px] font-bold uppercase select-none ${
                activeStep === "add-keywords" 
                  ? "bg-teal-50 text-[#006a61] border border-teal-200" 
                  : "hover:bg-slate-50 text-slate-500 border border-transparent"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center font-mono font-black text-[10px]">1</span>
              <span>Add keywords</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            {/* Step 2 */}
            <button 
              disabled={selectedKeywords.length === 0}
              onClick={() => setActiveStep("serp-scan")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all text-[11px] font-bold uppercase select-none ${
                activeStep === "serp-scan" 
                  ? "bg-teal-50 text-[#006a61] border border-teal-200" 
                  : "text-slate-400 border border-transparent disabled:opacity-55"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono font-black text-[10px]">2</span>
              <span>SERP scan</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            {/* Step 3 */}
            <button 
              onClick={() => setActiveStep("review-sites")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all text-[11px] font-bold uppercase select-none ${
                activeStep === "review-sites" 
                  ? "bg-teal-50 text-[#006a61] border border-teal-200" 
                  : "hover:bg-slate-50 text-slate-500 border border-transparent"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono font-black text-[10px]">3</span>
              <span>Review sites</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            {/* Step 4 */}
            <button 
              onClick={() => setActiveStep("enrich-contacts")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all text-[11px] font-bold uppercase select-none ${
                activeStep === "enrich-contacts" 
                  ? "bg-teal-50 text-[#006a61] border border-teal-200" 
                  : "hover:bg-slate-50 text-slate-500 border border-transparent"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono font-black text-[10px]">4</span>
              <span>Enrich contacts</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            {/* Step 5 */}
            <button 
              onClick={() => setActiveStep("outreach")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all text-[11px] font-bold uppercase select-none ${
                activeStep === "outreach" 
                  ? "bg-teal-50 text-[#006a61] border border-teal-200" 
                  : "hover:bg-slate-50 text-slate-500 border border-transparent"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono font-black text-[10px]">5</span>
              <span>Outreach</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== STEP 1: ADD KEYWORDS & PROJECT SELECTION ==================== */}
      {activeStep === "add-keywords" && (
        <div className="space-y-6" id="prospecting-step-1">
          
          {/* Optional Project Picker */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-mono font-black text-xs">1</span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Select a project <span className="text-slate-400 font-medium font-sans text-xs">(optional)</span></h3>
                <p className="text-[11px] text-[#6d7a77] mt-0.5">Link keywords to a project to see existing search data, or skip to add custom keywords directly.</p>
              </div>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50/20 outline-none"
              />
            </div>

            {/* Projects list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredProjects.map((proj) => {
                const isSelected = selectedProjectId === proj.id;
                return (
                  <div 
                    key={proj.id}
                    onClick={() => setSelectedProjectId(isSelected ? null : proj.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 relative ${
                      isSelected 
                        ? "border-[#006a61] bg-teal-50/25 shadow-xs" 
                        : "border-slate-150 bg-white hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-105 border border-slate-200 flex items-center justify-center font-sans font-extrabold text-slate-700 h-9 shrink-0">
                      {proj.letter}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-800">{proj.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{proj.domain}</div>
                    </div>
                    {isSelected && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-[#006a61] text-white p-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keywords Table Container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="keyword-finder-card">
            <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/20">
              <div>
                <p className="text-xs text-slate-500 font-medium">Select keywords to find prospect sites. Already-search keywords will import existing results for free.</p>
              </div>

              {/* Aggregated statistics readouts */}
              <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{calculatedKeywordsCount} keywords</span>
                <span>•</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{calculatedSearchedCount} searched</span>
                <span>•</span>
                <span className="text-[#0d9488] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">
                  {calculatedProspectsCount} prospects found
                </span>
              </div>
            </div>

            {/* Keyword Main Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-4 pl-6 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleToggleAllKeywords}
                        checked={keywords.length > 0 && keywords.every(k => k.selected)}
                        className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Keyword</th>
                    <th className="p-4">Prospects Found</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Used In</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {keywords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-all text-slate-700">
                      <td className="p-4 pl-6 text-center">
                        <input 
                          type="checkbox"
                          checked={!!item.selected}
                          onChange={() => handleToggleKeywordSelect(item.id)}
                          className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span>{item.phrase}</span>
                          {item.isRecommended && (
                            <span className="text-[8px] bg-purple-50 text-purple-700 font-bold px-1 py-0.5 rounded border border-purple-100 font-mono uppercase">
                              Rec
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Prospects Found count */}
                      <td className="p-4 font-mono">
                        {item.prospectsCount !== null ? (
                          <span className="font-extrabold text-slate-800">{item.prospectsCount}</span>
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>

                      {/* Status indicator */}
                      <td className="p-4">
                        {item.status === "Searched" ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Searched</span>
                          </span>
                        ) : item.status === "Searching" ? (
                          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-flex items-center gap-1 font-mono">
                            <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                            <span>Searching...</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100 inline-flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Not Searched</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400 font-mono">{item.usedInCampaigns}</td>
                      
                      {/* Search Now / Import action hooks */}
                      <td className="p-4 pr-6 text-right">
                        {item.status === "Searched" ? (
                          <button 
                            onClick={() => handleImportSingleKeyword(item.phrase, item.prospectsCount || 0)}
                            className="px-2.5 py-1 text-[10px] bg-white text-slate-600 font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
                          >
                            📥 Import
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleSearchSingleKeyword(item.id, item.phrase)}
                            disabled={item.status === "Searching"}
                            className="px-2.5 py-1 text-[10px] bg-[#0d9488] text-white font-mono font-bold rounded-lg hover:bg-teal-800 transition-colors cursor-pointer select-none"
                          >
                            🔍 Search Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Toggle Recommendations Drawer Trigger */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/10">
              <button 
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="px-3.5 py-2 text-xs bg-slate-100 border border-slate-205 rounded-xl hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5 text-slate-700 font-extrabold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0d9488] animate-bounce" />
                <span>Get Recommendations</span>
              </button>
            </div>
          </div>

          {/* ================= RECOMMENDED KEYWORDS DRAWER COMPONENT ================= */}
          {showRecommendations && (
            <div className="bg-[#f0f9f6] p-6 rounded-2xl border border-teal-200 shadow-sm space-y-4 animate-slide-up" id="recommended-keywords-box">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-sans font-black text-emerald-800 uppercase tracking-widest">Recommended Keywords</h4>
              </div>

              {/* Recommended list match the second reference design exactly */}
              <div className="space-y-2.5">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.phrase}
                    onClick={() => handleToggleRecommendationSelect(rec.phrase)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      rec.checked 
                        ? "border-teal-500 bg-teal-50 shadow-xs" 
                        : "border-slate-150 bg-white hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={rec.checked}
                        onChange={() => {}} // handled by row click
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">{rec.phrase}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                      <span>{rec.source}</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">{rec.volume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD CUSTOM KEYWORDS TEXT BOX */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-3" id="prospecting-bulk-create">
            <h4 className="text-xs font-sans font-bold text-slate-700 uppercase tracking-wider">Add Custom Target Keywords</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Type keywords, comma separated, press Enter..."
                value={customAddQuery}
                onChange={(e) => setCustomAddQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomKeywords();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 bg-slate-50/50 outline-none font-medium"
              />
              <button 
                onClick={handleAddCustomKeywords}
                className="px-5 py-2.5 bg-[#0d9488] hover:bg-teal-800 text-white rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Targets</span>
              </button>
            </div>
          </div>

          {/* ================= FLOATING ACTION SHORTLIST CART (SELECTION TABS) ================= */}
          {selectedKeywords.length > 0 && (
            <div className="bg-[#122238] text-white p-5 rounded-2xl border border-slate-750 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-slide-up" id="bulk-prospecting-cart">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest font-mono">Shortlist Selected</span>
                  <span className="text-xs font-sans font-black bg-indigo-900 border border-indigo-750 text-indigo-200 px-2 py-0.5 rounded-md">
                    {selectedKeywords.length} keywords
                  </span>
                  <button 
                    onClick={handleClearAllSelections}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer select-none ml-2"
                  >
                    Clear all
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedKeywords.map((k) => (
                    <span 
                      key={k.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950 text-indigo-300 text-[10.5px] font-bold rounded-lg border border-indigo-900/60 font-mono"
                    >
                      <span>{k.phrase}</span>
                      {k.isRecommended && (
                        <span className="text-[7.5px] bg-purple-900/60 text-purple-200 px-1 py-0.5 rounded font-black uppercase tracking-tight">
                          recommended
                        </span>
                      )}
                      <button 
                        onClick={() => handleToggleKeywordSelect(k.id)}
                        className="text-indigo-400 hover:text-white transition-colors cursor-pointer text-xs"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Start search execution drawer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 font-mono w-full md:w-auto">
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl text-xs text-left max-w-xs shrink-0 self-start md:self-auto">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Est cost index</span>
                  <span className="font-extrabold text-orange-400">{selectedKeywords.length} searches · {selectedKeywords.length} credits</span>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">Your balance: {credits}</span>
                </div>

                <button 
                  onClick={handleStartProspecting}
                  className="px-6 py-4 bg-[#0d9488] hover:bg-teal-800 text-white font-sans text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Start Prospecting</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ==================== STEP 2: SERP SCAN LOADER TERMINAL ==================== */}
      {activeStep === "serp-scan" && (
        <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 space-y-6 text-white text-xs font-mono animate-fade-in" id="prospecting-step-2">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#0d9488]" />
              <div>
                <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs">CRAWLING SEARCH ENGINE INDEXES</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Gathering live organic positions rank and compiling publisher endpoints.</p>
              </div>
            </div>
            
            <div className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded">
              Keywords: {scannedKeywordsList.length} Selected
            </div>
          </div>

          {/* Loader bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-[#0d9488]">Index Scan Status: IN PROGRESS</span>
              <span className="text-emerald-400 font-black">{scannerProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${scannerProgress}%` }}
              />
            </div>
          </div>

          {/* Real time command shell output logs matching user guides */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 h-64 overflow-y-auto space-y-1 text-slate-350 select-all font-mono leading-relaxed text-[11.5px]">
            {scannerLogs.length === 0 ? (
              <span className="text-slate-500 italic block">Pipelining thread workers setup...</span>
            ) : (
              scannerLogs.map((logStr, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-emerald-500 text-[10px] shrink-0">&gt;&gt;</span>
                  <span>{logStr}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={() => setActiveStep("review-sites")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg cursor-pointer transition-colors"
            >
              Skip Scanner View
            </button>
          </div>

        </div>
      )}


      {/* ==================== STEP 3: REVIEW DISCOVERED SITES ==================== */}
      {activeStep === "review-sites" && (
        <div className="space-y-6 animate-fade-in" id="prospecting-step-3">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-mono font-black text-xs">3</span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Review Discovered Authority Targets</h3>
                <p className="text-[11px] text-[#6d7a77] mt-0.5">Identified 7 placement matches based on ranking intersection ratios. Uncheck unwanted sites.</p>
              </div>
            </div>

            {/* Sites Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9.5px]">
                    <th className="p-3.5 pl-5 w-12 text-center text-[10px]">
                      <input 
                        type="checkbox" 
                        onChange={handleToggleAllProspects}
                        checked={discoveredProspects.length > 0 && discoveredProspects.every(p => p.checked)}
                        className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5">Referring Publisher Destination</th>
                    <th className="p-3.5">MOZ DR Domain Rank</th>
                    <th className="p-3.5">Est. Monthly Search traffic</th>
                    <th className="p-3.5">Suggested Opportunity Link Type</th>
                    <th className="p-3.5 pr-5 text-right">E-mail Hunt Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {discoveredProspects.map((spot) => (
                    <tr key={spot.id} className="hover:bg-slate-50/30 transition-colors text-slate-700">
                      <td className="p-3.5 pl-5 text-center">
                        <input 
                          type="checkbox"
                          checked={spot.checked}
                          onChange={() => handleToggleProspectSelect(spot.id)}
                          className="rounded border-slate-300 text-[#0d9488] focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        <div className="flex items-center gap-1.5 uppercase font-mono tracking-tight text-[11px]">
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{spot.domain}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-[#0d9488]">DR {spot.dr}/100</td>
                      <td className="p-3.5 font-mono text-slate-500">{spot.traffic}</td>
                      <td className="p-3.5 text-slate-650">{spot.opportunityType}</td>
                      <td className="p-3.5 pr-5 text-right">
                        {spot.enriched ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100 font-mono">
                            ✓ {spot.email}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-200 italic font-mono font-medium">
                            Not enriched yet
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Setup next action footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 font-sans text-xs">
              <span className="text-slate-400 font-mono">
                {discoveredProspects.filter(p => p.checked).length} of {discoveredProspects.length} targets selected
              </span>

              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveStep("add-keywords")}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  &larr; Back
                </button>
                <button 
                  onClick={handleStartEnrichment}
                  disabled={discoveredProspects.filter(p => p.checked).length === 0}
                  className="px-5 py-2 bg-[#0d9488] hover:bg-teal-800 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Enrich Checked Contacts &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      )}


      {/* ==================== STEP 4: ENRICH CONTACTS AND VALIDATE EMAILS ==================== */}
      {activeStep === "enrich-contacts" && (
        <div className="space-y-6 animate-fade-in" id="prospecting-step-4">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-mono font-black text-xs">4</span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Hunt Verified Direct Webmaster Emails</h3>
                <p className="text-[11px] text-[#6d7a77] mt-0.5">Scraping global citation structures to determine author name profiles and direct verified emails.</p>
              </div>
            </div>

            {enrichmentRunning ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3 font-mono">
                <Loader2 className="w-8 h-8 animate-spin text-[#0d9488] mx-auto" />
                <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-widest mt-2">Querying Hunter database registries...</h4>
                <div className="max-w-xs mx-auto">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-[#0b7e74] h-full rounded-full transition-all" 
                      style={{ width: `${enrichmentProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">Connecting domain server MX records... {enrichmentProgress}%</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoveredProspects.filter(p => p.checked).map((spot) => (
                    <div 
                      key={spot.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-55/40 flex items-start gap-3 w-full shadow-xs"
                    >
                      <Globe className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-[#0d9488] uppercase block">{spot.domain}</span>
                        <div className="text-xs font-black text-slate-800">{spot.authorName || "Brian Dean"}</div>
                        <div className="text-[11px] font-mono text-slate-500 font-medium truncate select-all">{spot.email || "brian@backlinko.com"}</div>
                        <span className="text-[9.5px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100 font-mono uppercase inline-block">
                          Verified [100% deliverable]
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 font-sans mt-4 text-xs">
                  <button 
                    onClick={() => setActiveStep("review-sites")}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    &larr; Re-verify sites
                  </button>

                  <button 
                    onClick={() => setActiveStep("outreach")}
                    className="px-5 py-2.5 bg-[#006a61] hover:bg-teal-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Configure Drip Outreach Post &rarr;
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}


      {/* ==================== STEP 5: SEQUENCE OUTREACH DISPATCH ==================== */}
      {activeStep === "outreach" && (
        <div className="space-y-6 animate-fade-in" id="prospecting-step-5">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-mono font-black text-xs">5</span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Launch Sequential Pitch Sequence</h3>
                <p className="text-[11px] text-[#6d7a77] mt-0.5">Finalize your templates variables and inject prospects domains into sequential mail chains.</p>
              </div>
            </div>

            {/* Campaign Selection Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-sans font-black text-slate-400 uppercase tracking-wider mb-2">Target Outreach campaign</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 outline-none"
                >
                  <option value="c-1">High DR Technology Skyscraper Outreach</option>
                  <option value="c-2">SaaS Platform Broken Links recovery v3</option>
                  <option value="c-3">Finance Hub Guest Post Pitch deck</option>
                  <option value="c-4">Create New Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-black text-slate-400 uppercase tracking-wider mb-2">Pitch Blueprint Template</label>
                <div className="flex gap-2">
                  {["Skyscraper Pitch", "Broken Link Spot", "Collaborative swap"].map((tmp) => (
                    <button 
                      key={tmp}
                      onClick={() => {
                        setChosenTemplate(tmp);
                        if (tmp === "Skyscraper Pitch") {
                          setEmailSubject("Quick suggestion for your resource index");
                          setEmailBody("Hi [Author Name],\n\nI was reviewing your page on [Domain] and noticed you highlighted some great platforms.\n\nWe recently launched an updated resource framework. Would love to know if you're open to pointing a reference code back to our service?\n\nThank you,\nPartnership Desk");
                        } else if (tmp === "Broken Link Spot") {
                          setEmailSubject("Dead links found on your blog post");
                          setEmailBody("Hi [Author Name],\n\nI noticed some broken links pointing to old competitor domains on [Domain].\n\nWould you be open to substituting them with our updated active portal links?\n\nBest regards,\nBroken Link Scanner Team");
                        } else {
                          setEmailSubject("Editorial integration proposal");
                          setEmailBody("Hi [Author Name],\n\nI majorly admire your published works on [Domain]. Let me know if you would support a collaborative guest article sharing backlink credentials!\n\nWarmly,\nOutreach Strategy Department");
                        }
                      }}
                      className={`flex-1 text-[10.5px] font-bold py-1.5 px-2.5 rounded-lg border transition-all truncate select-none cursor-pointer text-center ${
                        chosenTemplate === tmp 
                          ? "border-[#006a61] bg-teal-50 text-[#006a61]" 
                          : "border-slate-150 bg-white text-slate-600 hover:bg-slate-50/60"
                      }`}
                    >
                      {tmp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Composer Form */}
            <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-black border-b border-slate-200/60 pb-1.5 flex justify-between items-center">
                <span>Outreach Pitch mail preview</span>
                <span className="text-indigo-600">Reclaiming matches: {discoveredProspects.filter(p => p.checked && p.enriched).length} nodes ready</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-400 font-bold block mb-1">Email Subject Line</span>
                  <input 
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-bold outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-400 font-bold block mb-1">Email Body Draft (supports variables like [Author Name], [Domain])</span>
                  <textarea
                    rows={6}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none font-mono text-[11px] leading-relaxed select-text"
                  />
                </div>
              </div>
            </div>

            {/* Launch & redial controls */}
            <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveStep("enrich-contacts")}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                &larr; Modify lists
              </button>
              
              <button 
                onClick={handleLaunchSequence}
                className="px-6 py-3.5 bg-[#0d9488] hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono disabled:opacity-50"
              >
                <Megaphone className="w-4 h-4 animate-pulse" />
                <span>Launch {discoveredProspects.filter(p => p.checked && p.enriched).length} Active Pitch Sequences!</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Local view toast notification overlay */}
      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
      
    </div>
  );
}