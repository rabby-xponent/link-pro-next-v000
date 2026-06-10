"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy, Search, Key, Globe, Target, Database, ClipboardList, Megaphone, Plus, FileText, Mail,
  Sparkles, PlusCircle, CheckCircle, ArrowRight, BarChart, Trash2, RefreshCw, TrendingUp, Eye,
  ExternalLink, ChevronDown, Check, X, ChevronRight, Info, Users, Loader2, SlidersHorizontal,
  ArrowUpDown, Upload, Download, Square, CheckSquare, MoreHorizontal, AlertCircle, Rocket,
  RotateCcw, ChevronLeft
} from "lucide-react";
import { LocalToast, getProjectsList, type ProspectCRMItem } from "@/components/app/link-pro/shared/prospect-shared";

export interface MyListInventoryItem {
  id: string;
  domain: string;
  dr: number;
  traffic: number;
  backlinks: number;
  refDomains: number;
}

export function MyListView() {
  const [inventory, setInventory] = useState<MyListInventoryItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  // Navigation & interaction states
  const [activeStep, setActiveStep] = useState<number>(1);
  const [searchMode, setSearchMode] = useState<"ai" | "filters">("ai");
  const [aiQuery, setAiQuery] = useState("");
  const [aiFilterQuery, setAiFilterQuery] = useState("");
  
  // Standard manual filters
  const [domainFilter, setDomainFilter] = useState("");
  const [minDr, setMinDr] = useState<number>(0);
  const [minTraffic, setMinTraffic] = useState<number>(0);
  
  // Table sorting & limits
  const [showLimit, setShowLimit] = useState<string>("all");
  const [sortField, setSortField] = useState<"domain" | "dr" | "traffic" | "backlinks" | "refDomains" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [crmProspects, setCrmProspects] = useState<ProspectCRMItem[]>([]);

  const defaultInventory: MyListInventoryItem[] = [
    { id: "inv-1", domain: "nytimes.com", dr: 94, traffic: 84500000, backlinks: 320000000, refDomains: 1200000 },
    { id: "inv-2", domain: "github.com", dr: 97, traffic: 120000000, backlinks: 980000000, refDomains: 4800000 },
    { id: "inv-3", domain: "forbes.com", dr: 93, traffic: 45000000, backlinks: 190000000, refDomains: 980000 },
    { id: "inv-4", domain: "wikipedia.org", dr: 98, traffic: 2400000000, backlinks: 4100000000, refDomains: 12000000 },
    { id: "inv-5", domain: "smashingmagazine.com", dr: 88, traffic: 2100000, backlinks: 12000000, refDomains: 11000 },
    { id: "inv-6", domain: "webflow.com", dr: 91, traffic: 8400000, backlinks: 25000000, refDomains: 180000 },
    { id: "inv-7", domain: "canva.com", dr: 92, traffic: 54000000, backlinks: 87000000, refDomains: 340000 },
    { id: "inv-8", domain: "medium.com", dr: 94, traffic: 140000000, backlinks: 640000000, refDomains: 2300000 },
    { id: "inv-9", domain: "techcrunch.com", dr: 92, traffic: 15500000, backlinks: 84000000, refDomains: 540000 },
    { id: "inv-10", domain: "dev.to", dr: 86, traffic: 28200000, backlinks: 18000000, refDomains: 94000 }
  ];

  // Load My List inventory & CRM Prospects from local storage
  useEffect(() => {
    const list = localStorage.getItem("uprankly_my_list_inventory");
    if (list) {
      try {
        setInventory(JSON.parse(list));
      } catch (e) {
        setInventory(defaultInventory);
      }
    } else {
      setInventory(defaultInventory);
      localStorage.setItem("uprankly_my_list_inventory", JSON.stringify(defaultInventory));
    }
    refreshCRM();
  }, []);

  const refreshCRM = () => {
    const crmList = localStorage.getItem("uprankly_crm_prospects");
    if (crmList) {
      try {
        setCrmProspects(JSON.parse(crmList));
      } catch (e) {}
    }
  };

  const isAlreadyInCRM = (domain: string) => {
    return crmProspects.some(p => p.siteName.toLowerCase().includes(domain.toLowerCase()) || p.email.toLowerCase().includes(domain.toLowerCase()));
  };

  // Helper formatting numbers compactly (e.g. 1.2M, 400K)
  const formatCompactValue = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 1) + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    }
    return num.toString();
  };

  // CSV importer
  const parseCSV = (text: string): MyListInventoryItem[] => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    
    const domainIdx = headers.findIndex(h => h.includes("domain") && !h.includes("ref"));
    const drIdx = headers.findIndex(h => h === "dr" || h.includes("rating") || h.includes("authority"));
    const trafficIdx = headers.findIndex(h => h.includes("traffic") || h.includes("visitor") || h.includes("volume"));
    const backlinksIdx = headers.findIndex(h => h.includes("backlink"));
    const refDomainsIdx = headers.findIndex(h => h.includes("ref") || h.includes("referring"));

    const parsedItems: MyListInventoryItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
      if (cols.length === 0 || !cols[0]) continue;

      const parseNum = (val: string): number => {
        if (!val) return 0;
        const clean = val.toLowerCase().replace(/[^0-9.kmb]/g, "");
        if (clean.endsWith("m")) {
          return parseFloat(clean) * 1000 * 1000;
        }
        if (clean.endsWith("b")) {
          return parseFloat(clean) * 1000 * 1000 * 1000;
        }
        if (clean.endsWith("k")) {
          return parseFloat(clean) * 1000;
        }
        const parsed = parseInt(clean, 10);
        return isNaN(parsed) ? 0 : parsed;
      };

      const domain = domainIdx !== -1 && cols[domainIdx] ? cols[domainIdx] : cols[0] || "";
      if (!domain || !domain.includes(".")) continue;

      const dr = drIdx !== -1 && cols[drIdx] ? parseInt(cols[drIdx], 10) || 40 : 40;
      const traffic = trafficIdx !== -1 && cols[trafficIdx] ? parseNum(cols[trafficIdx]) : Math.floor(Math.random() * 50000) + 1000;
      const backlinks = backlinksIdx !== -1 && cols[backlinksIdx] ? parseNum(cols[backlinksIdx]) : Math.floor(Math.random() * 10000) + 10;
      const refDomains = refDomainsIdx !== -1 && cols[refDomainsIdx] ? parseNum(cols[refDomainsIdx]) : Math.floor(Math.random() * 1000) + 5;

      parsedItems.push({
        id: `csv-${Date.now()}-${i}-${Math.floor(Math.random() * 100)}`,
        domain,
        dr,
        traffic,
        backlinks,
        refDomains
      });
    }

    return parsedItems;
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const parsed = parseCSV(text);
          if (parsed.length === 0) {
            setToast("No valid rows discovered in CSV file. Check formatting model.");
            return;
          }
          const updatedList = [...parsed, ...inventory];
          setInventory(updatedList);
          localStorage.setItem("uprankly_my_list_inventory", JSON.stringify(updatedList));
          setToast(`Successfully imported ${parsed.length} sites from CSV!`);
        } catch (err) {
          setToast("Error compiling uploaded database file.");
        }
      }
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const content = "domain,dr,traffic,backlinks,refDomains\ntechcrunch.com,92,15.5M,84M,540K\nsmashingmagazine.com,88,2.1M,12M,11K\ngithub.com,97,120M,980M,4.8M\nnytimes.com,94,84.5M,320M,1.2M\n";
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "linkpro_inventory_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast("Downloaded CSV template pattern file!");
  };

  // Add individual domain to CRM
  const handleAddToCRM = (site: MyListInventoryItem) => {
    const list = localStorage.getItem("uprankly_crm_prospects");
    let currentCRM: any[] = [];
    if (list) {
      try {
        currentCRM = JSON.parse(list);
      } catch (e) {}
    }

    if (currentCRM.some(p => p.siteName.toLowerCase().includes(site.domain.toLowerCase()))) {
      setToast(`'${site.domain}' is already in your CRM pipeline.`);
      return;
    }

    const newProspect: ProspectCRMItem = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      siteName: site.domain.charAt(0).toUpperCase() + site.domain.slice(1),
      person: "Webmaster Admin",
      email: `editor@${site.domain}`,
      stage: "Planned",
      lastContact: "Never",
      notes: `Curated backlink opportunity from saved shortlist. DR: ${site.dr}. Traffic: ${formatCompactValue(site.traffic)}`
    };

    const updatedCRM = [...currentCRM, newProspect];
    localStorage.setItem("uprankly_crm_prospects", JSON.stringify(updatedCRM));
    refreshCRM();
    setToast(`Added '${site.domain}' to your active CRM Prospect list!`);
  };

  // Delete individual domain from My Inventory List
  const handleDeleteItem = (id: string, domain: string) => {
    const updated = inventory.filter(p => p.id !== id);
    setInventory(updated);
    setSelectedItemIds(prev => prev.filter(selectedId => selectedId !== id));
    localStorage.setItem("uprankly_my_list_inventory", JSON.stringify(updated));
    setToast(`Removed '${domain}' from your saved inventory list.`);
  };

  // Bulk add to CRM handler
  const handleBulkAddToProspects = () => {
    if (selectedItemIds.length === 0) return;

    const list = localStorage.getItem("uprankly_crm_prospects");
    let currentCRM: any[] = [];
    if (list) {
      try {
        currentCRM = JSON.parse(list);
      } catch (e) {}
    }

    const selectedSites = inventory.filter(item => selectedItemIds.includes(item.id));
    let addedCount = 0;
    const newArrivals: any[] = [];

    selectedSites.forEach(site => {
      const isDuplicate = currentCRM.some(p => p.siteName.toLowerCase().includes(site.domain.toLowerCase()));
      if (!isDuplicate) {
        newArrivals.push({
          id: `p-${Date.now()}-${Math.floor(Math.random() * 10000)}-${addedCount}`,
          siteName: site.domain.charAt(0).toUpperCase() + site.domain.slice(1),
          person: "Webmaster Admin",
          email: `contact@${site.domain}`,
          stage: "Planned",
          lastContact: "Never",
          notes: `Imported via bulk checklist. DR: ${site.dr}. Traffic: ${formatCompactValue(site.traffic)}`
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      const updatedCRM = [...currentCRM, ...newArrivals];
      localStorage.setItem("uprankly_crm_prospects", JSON.stringify(updatedCRM));
      refreshCRM();
      setToast(`Successfully added ${addedCount} brand new targets into outreach pipeline!`);
    } else {
      setToast("Selected items already active in CRM list.");
    }
    setSelectedItemIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedItemIds.length === 0) return;
    const remaining = inventory.filter(item => !selectedItemIds.includes(item.id));
    setInventory(remaining);
    localStorage.setItem("uprankly_my_list_inventory", JSON.stringify(remaining));
    setToast(`Discarded ${selectedItemIds.length} records safely.`);
    setSelectedItemIds([]);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (visibleItems: MyListInventoryItem[]) => {
    const visibleIds = visibleItems.map(item => item.id);
    const allAreSelected = visibleIds.every(id => selectedItemIds.includes(id));
    
    if (allAreSelected) {
      // Unselect visible items
      setSelectedItemIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Add all missing visible items
      setSelectedItemIds(prev => {
        const unique = new Set([...prev, ...visibleIds]);
        return Array.from(unique);
      });
    }
  };

  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAiFilterQuery(aiQuery);
    setToast(`Aetheric parser applied filter constraints: "${aiQuery}"`);
  };

  const handleSort = (field: "domain" | "dr" | "traffic" | "backlinks" | "refDomains") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // 1. First parse with search and manual criteria
  const filteredInventory = useMemo(() => {
    let items = [...inventory];

    // Search logic based on state tabs
    if (searchMode === "ai" && aiFilterQuery) {
      // Smart Natural Language Query parser
      const q = aiFilterQuery.toLowerCase().trim();

      // Parse Domain Rating constraints, e.g., "dr 40+", "dr > 80", "dr 50"
      const drRegex = /dr\s*(?:(?:above|>)\s*|>=?\s*|\+\s*|)?([0-9]+)/i;
      const drMatch = q.match(drRegex);
      if (drMatch) {
        const limit = parseInt(drMatch[1], 10);
        if (!isNaN(limit)) {
          if (q.includes("<") || q.includes("below") || q.includes("under")) {
            items = items.filter(item => item.dr < limit);
          } else {
            items = items.filter(item => item.dr >= limit);
          }
        }
      }

      // Parse traffic constraints, e.g., "1000+ traffic", "traffic > 10k", "traffic above 1m"
      const trafficRegex = /(?:traffic|visitors)\s*(?:(?:above|>)\s*|>=?\s*|\+\s*|)?([0-9.]+)\s*(k|m|b)?/i;
      const trafficRegex2 = /([0-9.]+)\s*(k|m|b)?\+?\s*traffic/i;
      let trafficMatch = q.match(trafficRegex) || q.match(trafficRegex2);
      if (trafficMatch) {
        let limit = parseFloat(trafficMatch[1]);
        const unit = trafficMatch[2];
        if (unit === "k") limit *= 1000;
        else if (unit === "m") limit *= 1000000;
        else if (unit === "b") limit *= 1000000000;
        
        if (!isNaN(limit)) {
          if (q.includes("<") || q.includes("below") || q.includes("under")) {
            items = items.filter(item => item.traffic < limit);
          } else {
            items = items.filter(item => item.traffic >= limit);
          }
        }
      }

      // Filter other non-metric terms
      const words = q.split(/\s+/).filter(w => {
        return !w.includes("dr") && !w.includes("traffic") && !w.includes("+") && !w.includes(">") && !w.includes("<") && isNaN(parseInt(w, 10));
      });

      if (words.length > 0) {
        items = items.filter(item => 
          words.some(w => item.domain.toLowerCase().includes(w))
        );
      }
    } else if (searchMode === "filters") {
      // Manual Filters
      if (domainFilter) {
        items = items.filter(i => i.domain.toLowerCase().includes(domainFilter.toLowerCase()));
      }
      if (minDr > 0) {
        items = items.filter(i => i.dr >= minDr);
      }
      if (minTraffic > 0) {
        items = items.filter(i => i.traffic >= minTraffic);
      }
    }

    return items;
  }, [inventory, searchMode, aiFilterQuery, domainFilter, minDr, minTraffic]);

  // 2. Second apply upper limit buttons or configurations
  const displayItems = useMemo(() => {
    let items = [...filteredInventory];

    if (showLimit === "selected") {
      items = items.filter(item => selectedItemIds.includes(item.id));
    } else if (showLimit === "high-dr") {
      items = items.filter(item => item.dr >= 90);
    }

    // Sort matching field
    if (sortField) {
      items.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortDirection === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
        }
      });
    }

    return items;
  }, [filteredInventory, showLimit, selectedItemIds, sortField, sortDirection]);

  return (
    <div className="space-y-6 animate-fade-in" id="my-list-custom-workspace">
      
      {/* Breadcrumb line mapping the visual blueprint */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1" id="breadcrumb-links">
        <span>Link Pro</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#0d9488] font-bold">My List</span>
      </div>

      {/* Main title page bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" id="header-bar-custom">
        <div>
          <h1 className="text-2xl font-sans font-extrabold text-[#0b1c30] tracking-tight">My Inventory</h1>
          <p className="text-xs text-[#6d7a77] font-medium mt-1">
            Your curated collection of sites for outreach. Search, filter, and add to prospect lists.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto" id="uploader-actions">
          <button
            onClick={downloadCSVTemplate}
            className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-bold hover:text-slate-800 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-white"
            title="Download CSV format template"
            id="format-file-button"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Format File</span>
          </button>
          
          <label className="px-5 py-2 bg-[#0d9488] hover:bg-[#0b8377] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm animate-pulse-subtle" id="csv-upload-label">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />
          </label>
        </div>
      </div>

      {/* Workflow Navigation pills matching mockup exactly */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 bg-slate-100/60 p-1.5 rounded-xl text-xs w-fit border border-slate-200/40" id="step-navigation-flow">
        <button
          type="button"
          onClick={() => { setActiveStep(1); setToast("Searching inventory active"); }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeStep === 1 ? "bg-[#0d9488] text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-600"
          }`}
          id="step-tab-1"
        >
          Search inventory
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <button
          type="button"
          onClick={() => { setActiveStep(2); setToast("Filters are ready to apply manually"); }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeStep === 2 ? "bg-[#0d9488] text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-600"
          }`}
          id="step-tab-2"
        >
          Filter &amp; compare
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <button
          type="button"
          onClick={() => { setActiveStep(3); setToast("Check a site row box to bulk action!"); }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeStep === 3 ? "bg-[#0d9488] text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-600"
          }`}
          id="step-tab-3"
        >
          Add to prospect list
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <button
          type="button"
          onClick={() => { setToast("Deploy campaigns targeting acquired publishers!"); }}
          className="px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200/50 text-slate-600 transition-all"
          id="step-tab-4"
        >
          Create campaign
        </button>
      </div>

      {/* Advanced search selector component */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4" id="nlp-search-container">
        <div className="flex border-b border-slate-100 pb-2.5 gap-2" id="filter-tab-bar">
          <button
            onClick={() => setSearchMode("ai")}
            className={`pb-2 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              searchMode === "ai"
                ? "border-[#0d9488] text-[#0d9488]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
            id="ai-search-toggle"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>AI Search</span>
          </button>
          <button
            onClick={() => setSearchMode("filters")}
            className={`pb-2 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              searchMode === "filters"
                ? "border-[#0d9488] text-[#0d9488]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
            id="manual-filters-toggle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Manual Filters</span>
          </button>
        </div>

        {searchMode === "ai" ? (
          <div className="space-y-2" id="ai-nlp-wrapper">
            <form onSubmit={handleAISearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="w-4 h-4 text-[#0d9488] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder='e.g. "DR 80+ sites with 1M+ traffic" or "forbes"'
                  className="w-full bg-[#f8f9ff] pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-[#0d9488] transition-all font-medium"
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
              Describe what you're looking for in plain English. Powered by local Aetheric metric parser algorithms.
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
              <label className="block text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Min Dynamic Rating ({minDr}+)</label>
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
              <label className="block text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-1">Min Traffic</label>
              <select
                value={minTraffic}
                onChange={(e) => setMinTraffic(Number(e.target.value))}
                className="w-full bg-[#f8f9ff] text-slate-700 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#0d9488]"
              >
                <option value={0}>Any Traffic Level</option>
                <option value={100000}>100K+ visitors</option>
                <option value={1000000}>1M+ visitors</option>
                <option value={10000000}>10M+ visitors</option>
                <option value={50000000}>50M+ visitors</option>
              </select>
            </div>
            <div className="flex items-end select-none">
              <button
                onClick={() => {
                  setDomainFilter("");
                  setMinDr(0);
                  setMinTraffic(0);
                  setToast("Reset current filtration indices!");
                }}
                className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-lg w-full cursor-pointer transition-colors"
              >
                Reset Conditions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control panel above data grid */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white border border-slate-100 p-4 rounded-xl shadow-sm" id="table-above-actions">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#0d9488]" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
            Curated Collectives ({displayItems.length} listed)
          </span>
          {selectedItemIds.length > 0 && (
            <span className="text-[10px] bg-teal-50 text-[#0d9488] font-bold px-2 py-0.5 rounded-full border border-teal-200 font-mono">
              {selectedItemIds.length} Checked
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 justify-end">
          {selectedItemIds.length > 0 && (
            <>
              <button
                onClick={handleBulkAddToProspects}
                className="px-3 py-1.5 bg-[#0d9488] hover:bg-[#0b8377] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                id="bulk-add-crm-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Selected to CRM</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50/50 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                id="bulk-delete-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}

          <div className="flex items-center gap-1 text-xs font-sans">
            <span className="text-slate-400 font-medium">Show:</span>
            <select
              value={showLimit}
              onChange={(e) => setShowLimit(e.target.value)}
              className="border border-slate-200 bg-[#f8f9ff] text-xs py-1 px-2.5 rounded-lg font-bold focus:outline-none"
              id="show-limit-dropdown"
            >
              <option value="all">All Inventory</option>
              <option value="selected">Selected Only</option>
              <option value="high-dr">High DR (DR &ge; 90)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="inventory-table-container">
        <div className="overflow-x-auto">
          {displayItems.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse" id="curated-inventory-table">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[#6d7a77] font-semibold font-mono uppercase text-[10px]">
                  <th className="p-4 pl-6 w-12 text-center select-none">
                    <button
                      type="button"
                      onClick={() => toggleSelectAll(displayItems)}
                      className="p-1 hover:bg-slate-100/80 rounded transition-all inline-block cursor-pointer"
                      title="Select all listed"
                    >
                      {displayItems.every(i => selectedItemIds.includes(i.id)) ? (
                        <CheckSquare className="w-4 h-4 text-[#0d9488]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-700">Domain</th>
                  
                  <th className="p-4 text-center cursor-pointer hover:bg-slate-100/50 text-slate-700 transition font-sans" onClick={() => handleSort("dr")}>
                    <div className="flex items-center justify-center gap-1">
                      <span>DR</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  <th className="p-4 text-center cursor-pointer hover:bg-slate-100/50 text-slate-700 transition font-sans" onClick={() => handleSort("traffic")}>
                    <div className="flex items-center justify-center gap-1">
                      <span>Traffic</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  <th className="p-4 text-center cursor-pointer hover:bg-slate-100/50 text-slate-700 transition font-sans" onClick={() => handleSort("backlinks")}>
                    <div className="flex items-center justify-center gap-1">
                      <span>Backlinks</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  <th className="p-4 text-center cursor-pointer hover:bg-slate-100/50 text-slate-700 transition font-sans" onClick={() => handleSort("refDomains")}>
                    <div className="flex items-center justify-center gap-1">
                      <span>Ref Domains</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>

                  <th className="p-4 pr-6 text-center text-slate-700 font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {displayItems.map((site) => {
                  const isChecked = selectedItemIds.includes(site.id);
                  const exists = isAlreadyInCRM(site.domain);
                  return (
                    <tr key={site.id} className={`hover:bg-slate-50/40 transition-colors ${isChecked ? "bg-slate-50/20" : ""}`}>
                      <td className="p-4 pl-6 text-center select-none">
                        <button
                          type="button"
                          onClick={() => toggleSelectItem(site.id)}
                          className="p-1 hover:bg-slate-100 rounded transition-all inline-block cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#0d9488]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 font-bold text-slate-800 text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-900 font-sans">{site.domain}</span>
                          <a
                            href={`https://${site.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#0d9488] transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[11px]">
                          {site.dr}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-slate-600 font-semibold">
                        {formatCompactValue(site.traffic)}
                      </td>
                      <td className="p-4 text-center font-mono text-slate-500">
                        {formatCompactValue(site.backlinks)}
                      </td>
                      <td className="p-4 text-center font-mono text-slate-500">
                        {formatCompactValue(site.refDomains)}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {exists ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#006a61] border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded-lg">
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddToCRM(site)}
                              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-[#0d9488] hover:text-[#0b7369] text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-teal-100"
                              title="Engage site and add to prospect crm"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add to CRM</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteItem(site.id, site.domain)}
                            className="p-1.5 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-slate-400" id="no-data-card">
              <Database className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-80" />
              <p className="text-sm font-bold text-slate-600">No inventory domains matched current parameters</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Relax your AI lookup filters, reset min metrics, or upload a custom CSV file to seed the database shortlist!
              </p>
            </div>
          )}
        </div>
      </div>

      {toast && <LocalToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

