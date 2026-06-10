"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  FileSpreadsheet, 
  Search, 
  Network, 
  Sliders, 
  Target,
  BadgeAlert,
  FolderPlus
} from "lucide-react";

interface CreateProjectWizardViewProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function CreateProjectWizardView({ onComplete, onCancel }: CreateProjectWizardViewProps) {
  // Wizard flow step indicator (1 to 5)
  const [step, setStep] = useState<number>(1);
  
  // Custom alerts/toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STEP 1 STATE: Core Project Properties
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [categoryNiche, setCategoryNiche] = useState<string>("");

  // STEP 2 STATE: Competitors Configuration (Manual list & Suggestions checklist)
  const [competitorMode, setCompetitorMode] = useState<"manual" | "discover">("manual");
  const [manualCompetitors, setManualCompetitors] = useState<string[]>(["semrush.com", "moz.com"]);
  const [newManualInput, setNewManualInput] = useState<string>("");
  const [discoveredCompetitors, setDiscoveredCompetitors] = useState([
    { domain: "ahrefs.com", checked: true, sharedKeywords: "12.4k", dr: 89 },
    { domain: "backlinko.com", checked: true, sharedKeywords: "8.1k", dr: 91 },
    { domain: "searchengineland.com", checked: false, sharedKeywords: "5.2k", dr: 91 },
    { domain: "growthbar.io", checked: false, sharedKeywords: "3.5k", dr: 74 },
  ]);

  // STEP 3 STATE: High-intent Target Keywords
  const [keywordDraft, setKeywordDraft] = useState<string>("");
  const [targetKeywords, setTargetKeywords] = useState<string[]>([
    "authority building software",
    "backlink analytics engine",
    "organic rank automation"
  ]);
  const [selectedTopicSuggestions, setSelectedTopicSuggestions] = useState<string[]>([]);

  // STEP 4 STATE: Outreach & Target DR Criteria Config
  const [minDomainRating, setMinDomainRating] = useState<number>(50);
  const [monthlyBacklinkGoal, setMonthlyBacklinkGoal] = useState<number>(25);
  const [regionLanguage, setRegionLanguage] = useState<string>("global");

  // STEP 5 STATE: Initializing progress parameters
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLog, setSimLog] = useState<string>("");

  // Helper Auto-deduce project name like HTML script
  const handleUrlChange = (val: string) => {
    setWebsiteUrl(val);
    if (val) {
      // Clean prefix, protocol, and www
      let clean = val.replace(/(^\w+:|^)\/\//, '').replace('www.', '');
      let domainPart = clean.split('.')[0];
      if (domainPart) {
        setProjectName(domainPart.charAt(0).toUpperCase() + domainPart.slice(1) + " Project");
      }
    } else {
      setProjectName("");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Dynamic suggested keywords list based on user Category selection
  const getTopicKeywordsByNiche = () => {
    switch (categoryNiche) {
      case "saas":
        return ["saas marketing plan", "b2b outreach tool", "app authority tracking", "software directory backlink"];
      case "ecommerce":
        return ["e-commerce organic strategy", "shopping merchant rich snippets", "product affiliate directory", "revenue rank growth"];
      case "fintech":
        return ["trust signal secure backlink", "private equity directories", "fintech authority index", "compliance search protocol"];
      case "healthcare":
        return ["medical authority credentials", "patient directory listings", "health blog editorial links", "trusted medicine journals"];
      case "travel":
        return ["tourism editorial references", "hotel organic reviews campaign", "leisure itinerary keywords", "local traveler community metrics"];
      default:
        return ["seo optimization tool", "high trust domain list", "editorial guest posts", "search visibility crawl"];
    }
  };

  const handleToggleDiscoveredCompetitor = (index: number) => {
    setDiscoveredCompetitors(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
  };

  const handleAddManualCompetitor = () => {
    const trimmed = newManualInput.trim().toLowerCase();
    if (!trimmed) {
      showToast("Domain input cannot be left empty.");
      return;
    }
    if (manualCompetitors.includes(trimmed)) {
      showToast(`${trimmed} is already in the competitor registry.`);
      return;
    }
    setManualCompetitors(prev => [...prev, trimmed]);
    setNewManualInput("");
    showToast(`Added ${trimmed} to competitor checklist.`);
  };

  const handleDeleteManualCompetitor = (index: number) => {
    const target = manualCompetitors[index];
    setManualCompetitors(prev => prev.filter((_, i) => i !== index));
    showToast(`Removed potential competitor ${target}.`);
  };

  const handleAddCustomKeyword = () => {
    const trimmed = keywordDraft.trim();
    if (!trimmed) return;
    if (targetKeywords.includes(trimmed)) {
      showToast("Keyword target already in active collection.");
      return;
    }
    setTargetKeywords(prev => [...prev, trimmed]);
    setKeywordDraft("");
  };

  const handleRemoveCustomKeyword = (index: number) => {
    setTargetKeywords(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleTopicSuggestion = (kw: string) => {
    if (selectedTopicSuggestions.includes(kw)) {
      setSelectedTopicSuggestions(prev => prev.filter(item => item !== kw));
    } else {
      setSelectedTopicSuggestions(prev => [...prev, kw]);
    }
  };

  // Sequential Simulator block on step 5 click
  const executeSimulationAndCreate = () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimLog("Mapping the external competitor schema space...");

    setTimeout(() => {
      setSimStep(2);
      setSimLog("Formulating semantic crawl schedules for targets...");
    }, 1200);

    setTimeout(() => {
      setSimStep(3);
      setSimLog("Syncing outreach models and configuring strategic backlinks directory...");
    }, 2400);

    setTimeout(() => {
      setSimStep(4);
      setSimLog("Generating custom backlink blueprint report...");
    }, 3600);

    setTimeout(() => {
      // 1. Commit new Project back into localStorage database
      const existingStr = localStorage.getItem("uprankly_projects");
      let currentList = [];
      try {
        if (existingStr) currentList = JSON.parse(existingStr);
      } catch (e) {
        // fallback
      }

      // Merge active competitors list
      const finalCompetitors = competitorMode === "manual" 
        ? manualCompetitors 
        : discoveredCompetitors.filter(c => c.checked).map(c => c.domain);

      const computedNewProject = {
        id: `proj-${Date.now()}`,
        name: projectName || "My Website Project",
        domain: websiteUrl || "yoursite.com",
        status: "Setup",
        stage: "Research",
        opps: finalCompetitors.length * 4 + targetKeywords.length * 3 + 12,
        campaigns: 1,
        links: 0,
        completed: 0,
        lastActivity: "Created just now",
        // Extended attributes matching user formulation
        meta: {
          category: categoryNiche || "General",
          competitors: finalCompetitors,
          keywords: [...targetKeywords, ...selectedTopicSuggestions],
          minDomainRating,
          monthlyBacklinkGoal,
          regionLanguage
        }
      };

      // Put first
      const updatedList = [computedNewProject, ...currentList];
      localStorage.setItem("uprankly_projects", JSON.stringify(updatedList));

      // 2. Clear simulation trigger & transition to parent tab
      setIsSimulating(false);
      onComplete();
    }, 4800);
  };

  const handleProceedStep = () => {
    if (step === 1 && !websiteUrl.trim()) {
      showToast("Please enter a valid website URL or domain prefix to begin setup.");
      return;
    }
    setStep(prev => Math.min(5, prev + 1));
  };

  const handleBackStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="max-w-2xl mx-auto py-6" id="project-creation-wizard-root">
      
      {/* Absolute Toast alert block */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#00685f] text-white py-3 px-5 rounded-lg shadow-2xl z-50 flex items-center gap-2 border border-teal-400/20 animate-slide-up" id="wizard-floating-toast">
          <span className="material-symbols-outlined text-white text-lg">check_circle</span>
          <span className="text-xs font-semibold font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Hero Welcome decoration wrapper or indicator */}
      <div className="mb-4" id="wizard-navigation-info">
        <button 
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-[#00685f] flex items-center gap-1.5 transition-colors duration-200 cursor-pointer mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Project Formulator</span>
        </button>
      </div>

      {/* Main Formulator Wizard Frame */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md flex flex-col" id="wizard-scaffold-card">
        
        {/* Dynamic Interactive Segmented Progress Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between" id="wizard-step-header-ribbon">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-xs" id="step-number-pill">
              {step}
            </div>
            <span className="text-xs font-semibold text-slate-800">Step {step} of 5</span>
          </div>
          
          {/* Progress bar segmented indicators */}
          <div className="flex gap-1.5" id="segmented-pips-frame">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-[#0d9488]' : 'bg-slate-200'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Wizard step specific rendering container */}
        <div className="p-6 md:p-8 space-y-6" id="wizard-step-content-pane">

          {/* ————————————————— STEP 1: WEBSITE SETUP ————————————————— */}
          {step === 1 && (
            <div className="space-y-5 animate-slide-up" id="wizard-pane-1">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0b1c30]">Create a New Project</h2>
                <p className="text-xs text-slate-500 mt-1">Enter your website URL and we&apos;ll formulate your active competitive matrix</p>
              </div>

              <div className="space-y-4">
                {/* Domain name text field */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="website-url">Website URL</label>
                  <div className="relative">
                    <input 
                      type="text"
                      id="website-url"
                      placeholder="e.g. yoursite.com"
                      value={websiteUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-teal-100 transition-all text-sm font-sans"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Capitalized auto-generated project label */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="project-name">Project Name</label>
                  <input 
                    type="text"
                    id="project-name"
                    placeholder="My Custom Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-teal-100 transition-all text-sm font-sans"
                  />
                </div>

                {/* Option selection field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="niche">Category / Niche (Optional)</label>
                  <select
                    id="niche"
                    value={categoryNiche}
                    onChange={(e) => setCategoryNiche(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0d9488] transition-all text-sm font-sans cursor-pointer"
                  >
                    <option value="">Select a Niche...</option>
                    <option value="saas">SaaS &amp; Tech Systems</option>
                    <option value="ecommerce">E-commerce Marketplace</option>
                    <option value="fintech">Fintech &amp; High-Trust Finance</option>
                    <option value="healthcare">Healthcare &amp; Clinical</option>
                    <option value="travel">Travel &amp; Hospitality</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ————————————————— STEP 2: COMPETITORS ————————————————— */}
          {step === 2 && (
            <div className="space-y-5 animate-slide-up" id="wizard-pane-2">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0b1c30]">Who are your competitors?</h2>
                <p className="text-xs text-slate-500 mt-1">Add sites you compete against for rankings and links</p>
              </div>

              {/* Functional Dual Switch Box Tab */}
              <div className="flex p-1 bg-slate-100 rounded-lg" id="competitor-panel-tabbox">
                <button 
                  type="button"
                  onClick={() => setCompetitorMode("manual")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all duration-300 cursor-pointer ${
                    competitorMode === "manual" 
                      ? 'bg-white text-[#0d9488] shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  I know my competitors
                </button>
                <button 
                  type="button"
                  onClick={() => setCompetitorMode("discover")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all duration-300 cursor-pointer ${
                    competitorMode === "discover" 
                      ? 'bg-white text-[#0d9488] shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Discover for me
                </button>
              </div>

              {/* Manual Mode Competitor List layout */}
              {competitorMode === "manual" && (
                <div className="space-y-3" id="manual-mode-competitors">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. ahrefs.com"
                      value={newManualInput}
                      onChange={(e) => setNewManualInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddManualCompetitor(); } }}
                      className="flex-1 h-10 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0d9488] text-xs font-sans"
                    />
                    <button 
                      type="button"
                      onClick={handleAddManualCompetitor}
                      className="px-4 bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 space-y-2 max-h-[190px] overflow-y-auto">
                    {manualCompetitors.length === 0 ? (
                      <span className="text-xs text-slate-400 italic block text-center py-4">No competitors entered yet. Use the tool on top to add dynamic domain profiles.</span>
                    ) : (
                      manualCompetitors.map((comp, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2.5 rounded-md border border-slate-200/60 shadow-sm">
                          <span className="text-xs font-semibold text-slate-800">{comp}</span>
                          <button 
                            type="button"
                            onClick={() => handleDeleteManualCompetitor(index)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Discover suggestions checklist */}
              {competitorMode === "discover" && (
                <div className="space-y-3 animate-slide-up" id="suggested-competitors-frame">
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-center gap-3">
                    <div className="bg-[#0d9488] text-white p-1.5 rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0d9488]">AI Suggestions</p>
                      <span className="text-[10px] text-slate-500 block leading-tight">Identified authoritative domains mirroring your keyword footprint</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white max-h-[220px] overflow-y-auto">
                    {discoveredCompetitors.map((comp, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleToggleDiscoveredCompetitor(i)}
                        className="flex justify-between items-center p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={comp.checked}
                            onChange={() => {}} // toggled on row click
                            className="w-4 h-4 rounded text-[#0d9488] focus:ring-[#0d9488] border-slate-300"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800">{comp.domain}</span>
                            <span className="text-[10px] text-slate-400">Shared keywords: {comp.sharedKeywords}</span>
                          </div>
                        </div>

                        <span className="bg-teal-50 text-[#0d9488] text-[10px] font-bold px-2 py-0.5 rounded border border-teal-100 font-mono">
                          DR {comp.dr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ————————————————— STEP 3: KEYWORDS ————————————————— */}
          {step === 3 && (
            <div className="space-y-5 animate-slide-up" id="wizard-pane-3">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0b1c30]">What organic search targets do you prioritze?</h2>
                <p className="text-xs text-slate-500 mt-1">Add keywords representing peak transactional intent domains</p>
              </div>

              {/* Enter keywords manually */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="e.g. best enterprise intelligence software"
                    value={keywordDraft}
                    onChange={(e) => setKeywordDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomKeyword(); } }}
                    className="flex-1 h-10 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0d9488] text-xs font-sans"
                  />
                  <button 
                    type="button"
                    onClick={handleAddCustomKeyword}
                    className="px-4 bg-[#0d9488] hover:bg-[#075e54] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link Tag</span>
                  </button>
                </div>

                {/* Draft list layout indicators */}
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-100 rounded-lg min-h-[64px]" id="keywords-badge-container">
                  {targetKeywords.length === 0 ? (
                    <span className="text-xs text-slate-400 italic block m-auto">No keywords listed. Create custom targets on top.</span>
                  ) : (
                    targetKeywords.map((kw, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm animate-slide-up">
                        <span>{kw}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveCustomKeyword(idx)}
                          className="hover:text-red-500 font-bold ml-1 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Topic level AI-driven keyword suggestions based on selected niche */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-[#0d9488] block">AI Core Suggestions: {categoryNiche ? `${categoryNiche.toUpperCase()} Niche` : "General SEO Stack"}</span>
                <p className="text-[10px] text-slate-400">Select pre-categorized organic keyword categories recommended for authority crawls</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" id="topic-grid">
                  {getTopicKeywordsByNiche().map((suggestedKw, sIdx) => {
                    const isSelected = selectedTopicSuggestions.includes(suggestedKw);
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleToggleTopicSuggestion(suggestedKw)}
                        className={`text-left p-2 border rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-teal-50/50 border-[#0d9488] text-[#0d9488]' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="truncate">{suggestedKw}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-1 ${
                          isSelected ? 'bg-[#0d9488] border-[#0d9488] text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <span className="text-[8px] font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ————————————————— STEP 4: OUTREACH SETTINGS ————————————————— */}
          {step === 4 && (
            <div className="space-y-5 animate-slide-up" id="wizard-pane-4">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0b1c30]">Set Strategic Targeting Goals</h2>
                <p className="text-xs text-slate-500 mt-1">Specify authority triggers for organic lead and link qualification</p>
              </div>

              <div className="space-y-6">
                {/* Domain rating threshold slider */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider">Minimum Target Domain Rating (DR)</span>
                    <span className="text-xs font-mono font-bold bg-[#0d9488] text-white px-2 py-0.5 rounded">
                      DR {minDomainRating}+
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Link Pro defaults analysis exclusively to domains meeting this trust bar</p>
                  
                  <input 
                    type="range"
                    min="30"
                    max="90"
                    value={minDomainRating}
                    onChange={(e) => setMinDomainRating(Number(e.target.value))}
                    className="w-full accent-[#0d9488] bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>DR 30 (Starter)</span>
                    <span>DR 60 (Elite)</span>
                    <span>DR 90 (Corporate Enterprise)</span>
                  </div>
                </div>

                {/* Backlink volume expectation counter */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider">Target Backlink Volume (Monthly)</span>
                    <span className="text-xs font-mono font-bold bg-[#0d9488] text-white px-2 py-0.5 rounded">
                      {monthlyBacklinkGoal} Links
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Desired quarterly and monthly velocity of secured organic citation references</p>
                  
                  <input 
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={monthlyBacklinkGoal}
                    onChange={(e) => setMonthlyBacklinkGoal(Number(e.target.value))}
                    className="w-full accent-[#0d9488] bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>5 (Conservative)</span>
                    <span>50 (Steady Strategy)</span>
                    <span>100 (Hyper Growth)</span>
                  </div>
                </div>

                {/* Region selector parameters */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Primary Target Location Region</label>
                  <select
                    value={regionLanguage}
                    onChange={(e) => setRegionLanguage(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0d9488] transition-all text-xs font-sans cursor-pointer"
                  >
                    <option value="global">Global Markets (Multi-Language, Worldwide IP Range)</option>
                    <option value="us-ca">North America (US &amp; Canada English Targets)</option>
                    <option value="eu">Europe (German, French, Spanish, Italian Localized)</option>
                    <option value="uk">United Kingdom (UK Specific High Domain Registry)</option>
                    <option value="apac">Asia-Pacific (Singapore, Australia, Japan Geo-Fenced)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ————————————————— STEP 5: REVIEW & SUMMARY ————————————————— */}
          {step === 5 && (
            <div className="space-y-5 animate-slide-up" id="wizard-pane-5">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0b1c30]">Review Project Configuration</h2>
                <p className="text-xs text-slate-500 mt-1">Verify metadata limits before deploying diagnostic background crawlers</p>
              </div>

              {/* Summary table card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm" id="summary-meta-grid">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700">Strategic Target Parameters Profile</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Ready</span>
                </div>

                <div className="p-4 space-y-3.5 text-xs">
                  {/* Website / Project Details */}
                  <div className="flex justify-between items-start py-1.5 border-b border-dashed border-slate-100">
                    <span className="text-slate-400 font-semibold font-sans">Project Name &amp; Domain</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{projectName || "My Website Project"}</p>
                      <p className="text-[10px] text-slate-500 font-mono italic">{websiteUrl || "yoursite.com"}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100">
                    <span className="text-slate-400 font-semibold font-sans">Niche Category</span>
                    <span className="font-bold text-slate-700 capitalize bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {categoryNiche || "Generic SEO"}
                    </span>
                  </div>

                  {/* Competitor volume listings count */}
                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100">
                    <span className="text-slate-400 font-semibold font-sans">Direct Competitors Monitored</span>
                    <span className="font-bold text-slate-800">
                      {competitorMode === "manual" ? manualCompetitors.length : discoveredCompetitors.filter(c => c.checked).length} targets
                    </span>
                  </div>

                  {/* Keyword quantity sum */}
                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100">
                    <span className="text-slate-400 font-semibold font-sans">Seed SEO Keyword Targets</span>
                    <span className="font-bold text-slate-800">
                      {targetKeywords.length + selectedTopicSuggestions.length} phrases registered
                    </span>
                  </div>

                  {/* Core metric rules threshold */}
                  <div className="flex justify-between items-start py-1.5">
                    <span className="text-slate-400 font-semibold font-sans">Outreach Metric Thresholds</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">DR {minDomainRating}+ Sites Only</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Monthly link aim: {monthlyBacklinkGoal} securing actions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crawler simulator trigger box when executing creation process */}
              {isSimulating && (
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl space-y-3.5 animate-slide-up" id="simulation-loading-banner">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0d9488]">Aetheric Engine Initialization Sequence</p>
                      <span className="text-[10px] text-slate-500 block">Deploying link crawlers and mapping structural opportunities</span>
                    </div>
                  </div>

                  {/* Simulator multi line logs log file outputs */}
                  <div className="font-mono text-[10px] bg-slate-900 text-teal-400 p-3 rounded-lg max-h-[110px] overflow-y-auto space-y-1">
                    <p className="opacity-60">&gt; npm run build:strategy --project=&quot;{projectName}&quot;</p>
                    <p className="opacity-85">&gt; Loading Link Pro system neural cluster...</p>
                    {simStep >= 1 && <p className="text-amber-400 animate-pulse">&gt; [OK] {simLog}</p>}
                    {simStep >= 2 && <p className="text-white">&gt; [CRAWL] 147 link candidates evaluated.</p>}
                    {simStep >= 3 && <p className="text-emerald-400">&gt; [AUTH] Handshake generated for automated outreach accounts.</p>}
                    {simStep >= 4 && <p className="text-teal-300 font-semibold animate-pulse">&gt; [SUCCESS] Database entries committed successfully.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        {!isSimulating && (
          <div className="mt-auto px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between" id="wizard-buttons-navigation-strip">
            
            {/* Back action */}
            <button 
              type="button"
              onClick={step === 1 ? onCancel : handleBackStep}
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{step === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            {/* Next or Submit Action */}
            <div className="flex items-center gap-4">
              {step === 2 && (
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-slate-400 hover:text-[#0d9488] transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-[#0d9488] cursor-pointer"
                >
                  Skip for now
                </button>
              )}

              {step < 5 ? (
                <button 
                  type="button"
                  onClick={handleProceedStep}
                  className="flex items-center gap-1 px-5 h-9 bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={executeSimulationAndCreate}
                  className="flex items-center gap-1 px-6 h-10 bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Deploy Strategy Engine</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
