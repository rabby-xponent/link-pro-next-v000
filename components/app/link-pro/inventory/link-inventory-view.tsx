"use client";

import React, { useState, useMemo } from "react";
import { 
  Link2, 
  Plus, 
  Search, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  Filter, 
  CheckCircle2, 
  RefreshCw,
  HelpCircle,
  FolderOpen
} from "lucide-react";
import { BacklinkItem } from "@/types/index";

export function LinkInventoryView() {
  // Hardcoded high-quality initial mock backup links that prove the dashboard capacity
  const [links, setLinks] = useState<BacklinkItem[]>([
    { id: "lnk-1", targetUrl: "https://wikipedia.org/wiki/SEO", anchorText: "search optimization wiki", category: "Reference", dr: 92, status: "Indexed", dateAdded: "2026-05-12" },
    { id: "lnk-2", targetUrl: "https://github.com/trending", anchorText: "open source directory", category: "Productivity", dr: 87, status: "Indexed", dateAdded: "2026-05-18" },
    { id: "lnk-3", targetUrl: "https://techcrunch.com/funding", anchorText: "startup financial index", category: "Guest Post", dr: 89, status: "Pending", dateAdded: "2026-05-24" },
    { id: "lnk-4", targetUrl: "https://medium.com/ai-trends", anchorText: "generative machine research", category: "Editorial", dr: 84, status: "Indexed", dateAdded: "2026-05-29" },
    { id: "lnk-5", targetUrl: "https://producthunt.com/launches", anchorText: "product marketing guide", category: "Directory", dr: 78, status: "Deindexed", dateAdded: "2026-06-01" },
    { id: "lnk-6", targetUrl: "https://dev.to/seo-hacks", anchorText: "web vitals metrics checklist", category: "Editorial", dr: 75, status: "Pending", dateAdded: "2026-06-03" }
  ]);

  // Form states
  const [targetUrl, setTargetUrl] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const [category, setCategory] = useState("Editorial");
  const [dr, setDr] = useState(65);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [drMinFilter, setDrMinFilter] = useState<number>(0);

  // Stats calculation
  const stats = useMemo(() => {
    const total = links.length;
    const indexed = links.filter(l => l.status === "Indexed").length;
    const pending = links.filter(l => l.status === "Pending").length;
    const deindexed = links.filter(l => l.status === "Deindexed").length;
    const avgDr = Math.round(links.reduce((acc, curr) => acc + curr.dr, 0) / (total || 1));
    return { total, indexed, pending, deindexed, avgDr };
  }, [links]);

  // Filter logic
  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesSearch = 
        link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.anchorText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" ? true : link.status === statusFilter;
      const matchesDr = link.dr >= drMinFilter;
      return matchesSearch && matchesStatus && matchesDr;
    });
  }, [links, searchTerm, statusFilter, drMinFilter]);

  // Handle add link
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl || !anchorText) {
      alert("Please fill in the target URL and anchor text.");
      return;
    }
    const newLink: BacklinkItem = {
      id: `lnk-${Date.now()}`,
      targetUrl,
      anchorText,
      category,
      dr: Number(dr),
      status: "Pending",
      dateAdded: new Date().toISOString().split("T")[0]
    };
    setLinks([newLink, ...links]);
    setTargetUrl("");
    setAnchorText("");
    setDr(65);
  };

  // Handle delete link
  const handleDeleteLink = (id: string) => {
    if (confirm("Are you sure you want to delete this backlink entry?")) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  // Toggle index state directly in the table
  const toggleStatus = (id: string) => {
    setLinks(links.map(l => {
      if (l.id === id) {
        const nextStatus: "Indexed" | "Pending" | "Deindexed" = 
          l.status === "Indexed" ? "Pending" : l.status === "Pending" ? "Deindexed" : "Indexed";
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  return (
    <div className="space-y-8" id="link-inventory-root">
      
      {/* 4 Large high-density visual stats tags at the top with up-trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="inventory-stats-grid">
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex flex-col justify-between" id="stat-card-total">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-slate-400 font-bold uppercase block">Total Monitored</span>
            <span className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-4.5 h-4.5" />
            <span>Growth tracker active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg flex flex-col justify-between" id="stat-card-indexed">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-teal-600 font-bold uppercase block">Google Indexed</span>
            <span className="text-3xl font-extrabold text-[#006a61] tracking-tight">
              {stats.indexed} <span className="text-sm font-medium text-slate-400">/ {stats.total}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-mono">
            <span>Ratio: {Math.round((stats.indexed / (stats.total || 1)) * 100)}%</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg flex flex-col justify-between" id="stat-card-pending">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-amber-600 font-bold uppercase block">Pending Google Core Index</span>
            <span className="text-3xl font-extrabold text-[#c05e1a] tracking-tight">{stats.pending}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-mono">
            <span>Awaiting crawl cycles</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg flex flex-col justify-between" id="stat-card-dr">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-slate-400 font-bold uppercase block">Average Domain Rating (DR)</span>
            <span className="text-3xl font-extrabold text-blue-900 tracking-tight">DR {stats.avgDr}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span>Elite SaaS standard</span>
          </div>
        </div>
      </div>

      {/* Two interactive columns: Add backlink and Link Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8" id="inventory-col-setup">
        
        {/* Form panel to register new backlink */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl h-fit space-y-5" id="form-panel">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#006a61]" />
              <span>Register New Backlink</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add URLs acquired from content syndication or guest blogs to track authority signals.
            </p>
          </div>

          <form onSubmit={handleAddLink} className="space-y-4" id="add-link-form">
            <div>
              <label className="text-[11px] font-mono tracking-wider text-slate-500 font-bold uppercase block mb-1">Target URL</label>
              <input 
                type="url" 
                placeholder="https://example.com/blog..."
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-[#f8f9ff] text-[#0b1c30] px-3.5 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-[#006a61] focus:ring-2 focus:ring-teal-100 transition-all font-sans"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono tracking-wider text-slate-500 font-bold uppercase block mb-1">Anchor Text</label>
              <input 
                type="text" 
                placeholder="e.g. cloud platform rankings"
                required
                value={anchorText}
                onChange={(e) => setAnchorText(e.target.value)}
                className="w-full bg-[#f8f9ff] text-[#0b1c30] px-3.5 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-[#006a61] focus:ring-2 focus:ring-teal-100 transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono tracking-wider text-slate-500 font-bold uppercase block mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#f8f9ff] text-[#0b1c30] px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-[#006a61]"
                >
                  <option>Editorial</option>
                  <option>Guest Post</option>
                  <option>Reference</option>
                  <option>Directory</option>
                  <option>Productivity</option>
                  <option>Forum Link</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono tracking-wider text-slate-500 font-bold uppercase block mb-1">Domain Rating: {dr}</label>
                <input 
                  type="range" 
                  min={1} 
                  max={100}
                  value={dr}
                  onChange={(e) => setDr(Number(e.target.value))}
                  className="w-full mt-2.5 accent-[#006a61] cursor-pointer"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#006a61] hover:bg-[#005049] text-white rounded-md py-2.5 font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              id="submit-link-btn"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Register Target entry</span>
            </button>
          </form>

          {/* Quick instructions badge */}
          <div className="p-3 bg-[#eff4ff] border border-slate-100 rounded-lg flex items-start gap-2.5" id="form-help-tip">
            <AlertCircle className="w-5 h-5 text-[#006a61] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-normal">
              <strong>Optimization rule:</strong> Always pair high-DR entities with contextually relevant anchor tokens. Avoid repetitious keyphrases to avoid penalty algorithms.
            </div>
          </div>
        </div>

        {/* Big data table list */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 xl:col-span-2 space-y-4" id="table-panel">
          
          {/* Header controls inside list */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4" id="table-controls">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#006a61]" />
              <span>Inventory Registers ({filteredLinks.length} items)</span>
            </h3>

            {/* In-table filters */}
            <div className="flex flex-wrap items-center gap-2" id="filter-block">
              <div className="flex items-center gap-1.5 relative" id="table-search-box">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5" />
                <input 
                  type="text" 
                  placeholder="Filter records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 text-xs rounded-md focus:outline-none focus:border-[#006a61]"
                />
              </div>

              {/* Status filter selection */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 bg-slate-50 text-xs py-1 px-2.5 rounded-md focus:outline-none"
                id="status-filter-select"
              >
                <option value="All">All Statuses</option>
                <option value="Indexed">Indexed</option>
                <option value="Pending">Pending</option>
                <option value="Deindexed">Deindexed</option>
              </select>

              {/* Min DR slider filtering popup input */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md py-0.5 px-2.5 text-xs text-slate-500">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Min DR:</span>
                <input 
                  type="number" 
                  min={0}
                  max={99}
                  style={{ width: "38px" }}
                  value={drMinFilter}
                  onChange={(e) => setDrMinFilter(Number(e.target.value))}
                  className="border-none bg-transparent font-semibold text-[#006a61] text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto" id="inventory-table-wrapper">
            {filteredLinks.length > 0 ? (
              <table className="w-full text-left border-collapse" id="inventory-table">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-400" id="table-head-row">
                    <th className="py-3 px-4 font-bold">Target &amp; Anchor</th>
                    <th className="py-3 px-3 font-bold text-center">DR</th>
                    <th className="py-3 px-3 font-bold">Category</th>
                    <th className="py-3 px-3 font-bold">Google Index Status</th>
                    <th className="py-3 px-3 font-bold text-right">Registered</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100" id="table-body">
                  {filteredLinks.map((link) => (
                    <tr 
                      key={link.id}
                      className="hover:bg-slate-50/70 transition-colors group text-sm"
                      id={`row-${link.id}`}
                    >
                      {/* URL and Anchor */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0b1c30] truncate">{link.anchorText}</span>
                          <a 
                            href={link.targetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-[#006a61] inline-flex items-center gap-1 mt-0.5"
                          >
                            <span className="truncate max-w-[200px] sm:max-w-[320px]">{link.targetUrl}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Domain Rating Badge in proper tag style */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {link.dr}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-600">
                          {link.category}
                        </span>
                      </td>

                      {/* Pill index statuses matching schema */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => toggleStatus(link.id)}
                          className={`text-[10px] inline-flex items-center font-bold font-mono py-1 px-2.5 rounded-full border cursor-pointer hover:opacity-90 active:scale-95 transition-all`}
                          title="Click to toggle status cycle"
                          id={`toggle-status-btn-${link.id}`}
                        >
                          {link.status === "Indexed" && (
                            <span className="bg-emerald-50 text-emerald-700 border-emerald-200">● Indexed</span>
                          )}
                          {link.status === "Pending" && (
                            <span className="bg-amber-50 text-amber-700 border-amber-200">● Pending</span>
                          )}
                          {link.status === "Deindexed" && (
                            <span className="bg-rose-50 text-rose-700 border-rose-200">● Deindexed</span>
                          )}
                        </button>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-3 uppercase text-xs font-mono text-slate-400 text-right">
                        {link.dateAdded}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <button 
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                          title="Delete link log"
                          id={`delete-btn-${link.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-slate-400" id="table-empty-state">
                <Link2 className="w-10 h-10 mx-auto text-slate-300 stroke-1 block mb-2" />
                <p className="text-sm font-medium">No matching backlinks found</p>
                <p className="text-xs text-slate-400 mt-1">Refine your filtration parameters above or create a new entry.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
