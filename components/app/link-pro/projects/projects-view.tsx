"use client";

import React, { useState, useMemo } from "react";

interface ProjectItem {
  id: string;
  name: string;
  domain: string;
  status: "Healthy" | "Alert" | "Setup";
  stage: "Outreach" | "Monitoring" | "Research" | "Prospecting";
  opps: number;
  campaigns: number;
  links: number;
  completed: number;
  lastActivity: string;
}

interface ActivityItem {
  id: string;
  icon: string;
  text: React.ReactNode;
  time: string;
  source: string;
  isErrorLine?: boolean;
}

interface ProjectsViewProps {
  onRequestCreate?: () => void;
}

export function ProjectsView({ onRequestCreate }: ProjectsViewProps = {}) {
  // 1. Initial State matching user dataset
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem("uprankly_projects");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "proj-1", name: "Uprankly", domain: "uprankly.com", status: "Healthy", stage: "Outreach", opps: 82, campaigns: 3, links: 147, completed: 5, lastActivity: "2h ago" },
      { id: "proj-2", name: "CyberGuard", domain: "cyberguard.io", status: "Alert", stage: "Monitoring", opps: 31, campaigns: 1, links: 52, completed: 4, lastActivity: "Yesterday" },
      { id: "proj-3", name: "Client A", domain: "clienta.com", status: "Setup", stage: "Research", opps: 12, campaigns: 2, links: 88, completed: 0, lastActivity: "Today" },
      { id: "proj-4", name: "Client B", domain: "growthstack.co", status: "Healthy", stage: "Outreach", opps: 64, campaigns: 4, links: 203, completed: 6, lastActivity: "4h ago" },
      { id: "proj-5", name: "TechFlow", domain: "techflow.dev", status: "Healthy", stage: "Prospecting", opps: 45, campaigns: 1, links: 31, completed: 2, lastActivity: "3h ago" }
    ];
  });

  // Persist project schema updates dynamically
  React.useEffect(() => {
    localStorage.setItem("uprankly_projects", JSON.stringify(projects));
  }, [projects]);

  // Selected checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");

  // Interaction for adding new project (Initialize Strategy simulated overlay/modal)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newStage, setNewStage] = useState<"Outreach" | "Monitoring" | "Research" | "Prospecting">("Outreach");
  const [newOpps, setNewOpps] = useState(15);
  const [newCampaigns, setNewCampaigns] = useState(2);
  const [newLinks, setNewLinks] = useState(10);

  // Activity list items
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "act-1", icon: "add_link", text: <>New backlink secured for <span className="text-primary font-bold">Uprankly</span> from <span className="italic text-on-surface-variant">techcrunch.com</span></>, time: "15 mins ago", source: "Automations" },
    { id: "act-2", icon: "person", text: <>Alex Chen added <span className="font-bold">Client B</span> to &quot;Tier 1 Priority&quot; category</>, time: "2 hours ago", source: "Alex Chen" },
    { id: "act-3", icon: "analytics", text: <>Monthly Report generated for <span className="text-primary font-bold">TechFlow</span></>, time: "4 hours ago", source: "System" },
    { id: "act-4", icon: "mail", text: <>54 outreach emails sent across <span className="font-bold">3 campaigns</span></>, time: "6 hours ago", source: "Campaign Manager" },
    { id: "act-5", icon: "warning", text: <>Link lost: uprankly.com/pricing from <span className="italic text-on-surface-variant">medium.com</span></>, time: "Yesterday", source: "Link Monitor", isErrorLine: true }
  ]);

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase()) ||
                            p.domain.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "All" ? true : p.status === statusFilter;
      const matchesStage = stageFilter === "All" ? true : p.stage === stageFilter;
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [projects, searchText, statusFilter, stageFilter]);

  // Bulk actions handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleCloseBulk = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} projects?`)) {
      setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkArchive = () => {
    alert(`Archived ${selectedIds.length} projects.`);
    setSelectedIds([]);
  };

  const handleBulkTag = () => {
    const label = prompt("Enter tag name to apply:");
    if (label) {
      alert(`Tag "${label}" applied to ${selectedIds.length} projects.`);
      setSelectedIds([]);
    }
  };

  // Add new project submission
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDomain) {
      alert("Please provide school name and domain suffix.");
      return;
    }
    const newlyCreated: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newName,
      domain: newDomain,
      status: "Setup",
      stage: newStage,
      opps: Number(newOpps),
      campaigns: Number(newCampaigns),
      links: Number(newLinks),
      completed: 0,
      lastActivity: "Just now"
    };
    setProjects(prev => [newlyCreated, ...prev]);

    // Push action log
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      icon: "add_circle",
      text: <>Alex Chen initialized strategy for <span className="text-primary font-bold">{newName}</span> ({newDomain})</>,
      time: "Just now",
      source: "Alex Chen"
    };
    setActivities(prev => [newAct, ...prev]);

    setShowAddModal(false);
    setNewName("");
    setNewDomain("");
  };

  return (
    <div className="space-y-8" id="projects-hub-container">
      
      {/* Breadcrumb & Header EXACTLY matching HTML */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up" id="header-section">
        <div>
          <nav className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant mb-2" id="header-breadcrumb">
            <span className="hover:text-primary cursor-pointer transition-colors duration-300">Link Pro</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Projects</span>
          </nav>
          <h2 className="font-headline-md text-[28px] font-bold text-on-surface">Projects</h2>
          <p className="text-on-surface-variant font-body-md mt-1">
            Link Pro is your strategic partner for authority growth. Monitor and scale your SEO performance with data-driven precision.
          </p>
        </div>
        <button 
          onClick={onRequestCreate || (() => setShowAddModal(prev => !prev))}
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-95 hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
          id="init-strategy-btn"
        >
          <span className="material-symbols-outlined">add_circle</span> Initialize Strategy
        </button>
      </div>

      {/* Initialize strategy dynamic input block layout */}
      {showAddModal && (
        <div className="mb-8 p-6 bg-white border border-outline-variant rounded-xl shadow-lg animate-slide-up" id="strategy-creator-box">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4">
            <h3 className="font-headline-sm text-sm text-on-surface font-bold">Configure Strategic Parameters</h3>
            <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          
          <form onSubmit={handleCreateProject} className="space-y-4" id="strategy-form">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-[11px] font-bold font-label-bold uppercase tracking-wider text-outline block mb-1">Company / Brand Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Uprankly"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold font-label-bold uppercase tracking-wider text-outline block mb-1">Target Host URL Domain</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. uprankly.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold font-label-bold uppercase tracking-wider text-outline block mb-1">Starting Campaign Stage</label>
                <select 
                  value={newStage} 
                  onChange={(e) => setNewStage(e.target.value as any)}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Outreach">Outreach</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Research">Research</option>
                  <option value="Prospecting">Prospecting</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-outline block mb-1">Opportunities Count</label>
                <input type="number" value={newOpps} onChange={(e) => setNewOpps(Number(e.target.value))} className="w-full border rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="text-[11px] text-outline block mb-1">Campaigns Count</label>
                <input type="number" value={newCampaigns} onChange={(e) => setNewCampaigns(Number(e.target.value))} className="w-full border rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="text-[11px] text-outline block mb-1">Links Target</label>
                <input type="number" value={newLinks} onChange={(e) => setNewLinks(Number(e.target.value))} className="w-full border rounded-lg p-2 text-xs" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer hover:opacity-90"
              >
                Provision Strategy Stack
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 1: Workspace Summary Deck EXACTLY matching user HTML cards metadata */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="workspace-summary-grid">
        
        {/* Card 1: Active Projects */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col justify-between h-32 animate-slide-up stagger-1 hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 cursor-default" id="summary-active-projects">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Active Projects</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">folder_open</span>
            </div>
          </div>
          <p className="font-headline-md text-[28px] text-on-surface">{projects.length}</p>
        </div>

        {/* Card 2: Opportunities */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col justify-between h-32 animate-slide-up stagger-2 hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 cursor-default" id="summary-opportunities">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Opportunities</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            </div>
          </div>
          <p className="font-headline-md text-[28px] text-on-surface">
            {projects.reduce((acc, p) => acc + p.opps, 0)}
          </p>
        </div>

        {/* Card 3: Active Campaigns */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col justify-between h-32 animate-slide-up stagger-3 hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 cursor-default" id="summary-active-campaigns">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Active Campaigns</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">send</span>
            </div>
          </div>
          <p className="font-headline-md text-[28px] text-on-surface">
            {projects.reduce((acc, p) => acc + p.campaigns, 0)}
          </p>
        </div>

        {/* Card 4: Hero Card */}
        <div className="bg-surface-container-low border border-primary/20 rounded-xl p-6 flex flex-col justify-between h-32 relative overflow-hidden animate-slide-up stagger-4 hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 cursor-default" id="summary-live-links-hero">
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform duration-700">
            <span className="material-symbols-outlined text-8xl text-primary">link</span>
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center">
              <span className="font-label-bold text-primary uppercase tracking-wider text-xs">Live Links</span>
              <span 
                className="material-symbols-outlined text-[14px] ml-1 cursor-pointer text-primary/60 hover:text-primary transition-colors"
                title="Expert Guidance: Live links represent verified backlinks currently contributing to your domain authority."
              >
                info
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 relative z-10">
            <p className="font-headline-md text-[28px] text-primary font-bold">
              {projects.reduce((acc, p) => acc + p.links, 0).toLocaleString()}
            </p>
            <span className="text-xs text-primary font-bold flex items-center">
              <span className="material-symbols-outlined text-[14px] animate-bounce">trending_up</span>
              +12%
            </span>
          </div>
        </div>

      </section>

      {/* Section 2: Projects Requiring Attention EXACTLY matching colors, errors, animations */}
      <section className="mb-8 animate-slide-up stagger-5" id="attention-required-section">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-headline-sm text-lg text-on-surface font-bold">Projects Requiring Attention</h3>
          <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse-gentle">
            Action Needed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Error Alert */}
          <div className="bg-white border-l-4 border-[#ba1a1a] border-y border-r border-outline-variant rounded-xl p-4 flex items-center justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined animate-pulse">link_off</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">3 Lost Links Detected</h4>
                <p className="text-sm text-on-surface-variant">CyberGuard • High impact loss on homepage authority link profile.</p>
              </div>
            </div>
            <button 
              onClick={() => alert("Reviewing authentic links profile analysis for CyberGuard...")}
              className="px-4 py-2 border border-[#ba1a1a] text-[#ba1a1a] rounded-lg text-sm font-bold hover:bg-[#ba1a1a] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Review
            </button>
          </div>

          {/* Warning Alert */}
          <div className="bg-white border-l-4 border-[#FFB000] border-y border-r border-outline-variant rounded-xl p-4 flex items-center justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-[#FFB000]">
                <span className="material-symbols-outlined">pause_circle</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Campaign Stalled 48h</h4>
                <p className="text-sm text-on-surface-variant">Client A • Outreach awaiting inbox connection handshake.</p>
              </div>
            </div>
            <button 
              onClick={() => alert("Investigating stalled campaigns profile logs for Client A...")}
              className="px-4 py-2 border border-[#FFB000] text-[#FFB000] rounded-lg text-sm font-bold hover:bg-[#FFB000] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Investigate
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Projects Directory EXACTLY matching the table configuration */}
      <section className="mb-8 relative animate-slide-up stagger-5" id="projects-directory-section">
        
        {/* Filter Bar */}
        <div className="bg-white border border-outline-variant rounded-t-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="table-filter-bar">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            
            {/* Search Input Filter exact styling */}
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                placeholder="Filter by project or domain..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-lg pl-9 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
            </div>

            {/* Quick selectors dropdown triggers */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-label-md font-medium text-on-surface-variant hover:bg-surface-container transition-all duration-300 focus:outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Healthy">Healthy</option>
                <option value="Alert">Alert</option>
                <option value="Setup">Setup</option>
              </select>

              <select 
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-label-md font-medium text-on-surface-variant hover:bg-surface-container transition-all duration-300 focus:outline-none"
              >
                <option value="All">Stage: All</option>
                <option value="Outreach">Outreach</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Research">Research</option>
                <option value="Prospecting">Prospecting</option>
              </select>

              <button 
                onClick={() => { setStatusFilter("All"); setStageFilter("All"); setSearchText(""); }}
                className="text-[11px] text-primary font-bold hover:underline ml-2 shrink-0"
              >
                Reset All Fields
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-label-md text-on-surface-variant">Sort by:</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-on-surface hover:text-primary transition-colors duration-300">
              Last Activity <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            </button>
          </div>
        </div>

        {/* Data Table with exactly equivalent layout metrics */}
        <div className="bg-white border-x border-b border-outline-variant rounded-b-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-y border-outline-variant">
                <th className="p-4 w-10">
                  <input 
                    type="checkbox"
                    className="rounded border-outline text-primary focus:ring-primary h-4 w-4 transition-all duration-300 cursor-pointer"
                    checked={filteredProjects.length > 0 && selectedIds.length === filteredProjects.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider">Project</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider">Stage</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider text-center">Opps</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider text-center">Campaigns</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider text-center">Links</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider text-center">Comp.</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider">Last Activity</th>
                <th className="p-4 text-xs font-label-bold font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-outline-variant">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => {
                  const isChecked = selectedIds.includes(proj.id);
                  return (
                    <tr 
                      key={proj.id}
                      onClick={() => handleSelectOne(proj.id)}
                      className={`hover:bg-surface-container transition-all duration-300 group cursor-pointer ${
                        isChecked ? "bg-surface-container-low" : ""
                      }`}
                      id={`project-record-row-${proj.id}`}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(proj.id)}
                          className="rounded border-outline text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </td>

                      {/* Name/Domain Identity */}
                      <td className="p-4">
                        <div className="flex flex-col group-hover:translate-x-1 transition-transform duration-300">
                          <span className="font-bold text-on-surface">{proj.name}</span>
                          <span className="text-xs text-on-surface-variant font-mono">{proj.domain}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="p-4">
                        {proj.status === "Healthy" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Healthy
                          </span>
                        )}
                        {proj.status === "Alert" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 animate-pulse-gentle">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Alert
                          </span>
                        )}
                        {proj.status === "Setup" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Setup
                          </span>
                        )}
                      </td>

                      {/* Stage */}
                      <td className="p-4">
                        <span className="inline-flex px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase font-mono">
                          {proj.stage}
                        </span>
                      </td>

                      {/* Columns with exact numeric labels */}
                      <td className="p-4 text-center text-sm font-medium">{proj.opps}</td>
                      <td className="p-4 text-center text-sm font-medium">{proj.campaigns}</td>
                      <td className="p-4 text-center text-sm font-bold text-primary">{proj.links}</td>
                      <td className="p-4 text-center text-sm font-medium">{proj.completed}</td>
                      
                      <td className="p-4 text-xs text-on-surface-variant font-mono">{proj.lastActivity}</td>
                      
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 text-on-surface-variant">
                          <button 
                            onClick={() => alert(`Reviewing operational sandbox details for ${proj.domain}...`)}
                            className="p-1 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                          </button>
                          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-300">chevron_right</span>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl text-outline-variant animate-pulse block mb-2">folder_off</span>
                    <p className="font-bold">No projects discovered matching active filters</p>
                    <p className="text-xs text-outline">Reset search suffix terms above to re-sync lists.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white border-x border-b border-outline-variant rounded-b-xl p-4 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-mono">
            Showing 1-{filteredProjects.length} of {projects.length} projects
          </span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-50 transition-all duration-300" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded text-xs font-bold transition-all duration-300 font-mono">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded text-xs font-bold hover:bg-surface-container transition-all duration-300 font-mono">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded text-xs font-bold hover:bg-surface-container transition-all duration-300 font-mono">
              3
            </button>
            <button onClick={() => alert("Navigating registers...")} className="p-1.5 border border-outline-variant rounded hover:bg-surface-container transition-all duration-300">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Sticky Bulk Actions Bar EXACTLY as defined in HTML spec bottom position */}
        {selectedIds.length > 0 && (
          <div 
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white py-3 px-6 rounded-full shadow-2xl z-50 flex items-center gap-6 animate-slide-up"
            id="bulk-actions-panel"
          >
            <div className="flex items-center gap-2 border-r border-white/20 pr-6">
              <span className="text-sm font-bold">
                <span className="text-primary-fixed font-black text-base mr-1" id="selection-count">{selectedIds.length}</span> 
                items selected
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleBulkArchive}
                className="flex items-center gap-1.5 text-xs font-bold hover:text-[#93e4d8] transition-colors duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">archive</span> Move
              </button>
              
              <button 
                onClick={handleBulkTag}
                className="flex items-center gap-1.5 text-xs font-bold hover:text-[#93e4d8] transition-colors duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">label</span> Tag
              </button>

              <button 
                onClick={handleBulkArchive}
                className="flex items-center gap-1.5 text-xs font-bold hover:text-[#93e4d8] transition-colors duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span> Archive
              </button>

              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span> Delete
              </button>
            </div>

            <button 
              onClick={handleCloseBulk}
              className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors duration-300 cursor-pointer"
              id="close-bulk"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

      </section>

      {/* Section 4: Recent Workspace Activity EXACTLY matching class animations */}
      <section id="activity-streams-card">
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500">
          
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-headline-sm text-lg text-on-surface font-bold">Recent Workspace Activity</h3>
            <button 
              onClick={() => alert("Loading advanced log filter triggers...")}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline transition-all duration-300 cursor-pointer"
            >
              Filter Activity <span className="material-symbols-outlined text-[14px]">filter_list</span>
            </button>
          </div>

          <div className="divide-y divide-outline-variant" id="activity-list">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-all duration-300"
                id={`activity-row-${act.id}`}
              >
                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary shrink-0 transition-transform duration-300 hover:scale-110">
                  <span className={`material-symbols-outlined text-[18px] ${act.isErrorLine ? 'text-error' : ''}`}>
                    {act.icon}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-on-surface">
                    {act.text}
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-label-md font-medium">
                    {act.time} &bull; {act.source}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => alert("Showing older archived system logs...")}
            className="block w-full p-4 bg-surface-container-low text-center text-sm font-bold text-primary hover:bg-surface-container hover:text-primary-container transition-all duration-300 cursor-pointer"
          >
            View All Activity
          </button>
        </div>
      </section>

    </div>
  );
}
