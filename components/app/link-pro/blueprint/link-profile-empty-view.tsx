"use client";

import React from "react";
import { 
  Server, 
  Globe, 
  Zap, 
  Plus, 
  Terminal, 
  FileText 
} from "lucide-react";

interface EmptyProjectData {
  id: string | number;
  name: string;
  domain: string;
  backlinks?: number;
  refDomains?: number;
}

interface LinkProfileEmptyViewProps {
  selectedProject: EmptyProjectData;
  isScanning: boolean;
  scanProgress: number;
  scanLogs: string[];
  onPriorityScan: () => void;
  onRegisterManually: () => void;
}

export function LinkProfileEmptyView({
  selectedProject,
  isScanning,
  scanProgress,
  scanLogs,
  onPriorityScan,
  onRegisterManually
}: LinkProfileEmptyViewProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="link-profile-empty-state-view">
      
      {/* 1. Target Ingestion Status Indicator */}
      <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="empty-queue-alert">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-teal-600 shrink-0">
            <Server className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Target Ingestion Status: Awaiting Domain Discovery Scan</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Our index crawlers queue is scheduled to parse <span className="font-mono text-teal-700 font-black">{selectedProject.domain}</span> within 24 hours.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold bg-emerald-100 text-teal-800 px-2.5 py-1 rounded-full uppercase shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping mr-1" />
          Active Queue Pos: #14
        </div>
      </div>

      {/* 2. Core Immersive Sonar Canvas & Actions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-xs flex flex-col items-center justify-center" id="empty-state-main-card">
        
        {/* Sonar rings animation box */}
        <div className="w-24 h-24 relative mb-6 flex items-center justify-center" id="sonar-animation-container">
          {/* Pulsating Ping rings */}
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/10 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-teal-400/20 animate-ping pointer-events-none" style={{ animationDuration: '2.2s' }} />
          <div className="absolute inset-4 rounded-full border border-teal-500/35 animate-ping pointer-events-none" style={{ animationDuration: '1.5s' }} />
          
          {/* Central Radar Node */}
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200/80 shadow-md flex items-center justify-center text-[#0d9488]" id="sonar-center-badge">
            <Globe className="w-8 h-8 animate-pulse text-teal-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="empty-main-heading">
          No Inbound Backlinks Discovered Yet
        </h2>
        <p className="text-slate-500 text-xs font-semibold max-w-xl mx-auto mt-2 leading-relaxed" id="empty-main-desc">
          Our global subnet crawler indexer reads trillions of HTML document nodes daily. The domain <strong className="text-slate-900 font-bold">{selectedProject.domain}</strong> currently holds zero verified backlinks. Bypass the backlog queue or test immediately.
        </p>

        {/* Ingestion & Simulation actions Row */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 w-full max-w-md" id="empty-actions-layout">
          <button
            type="button"
            disabled={isScanning}
            onClick={onPriorityScan}
            className="px-5 py-3 bg-[#0d9488] hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none w-full sm:w-auto shrink-0 select-none"
            id="empty-action-trigger-scan"
          >
            <Zap className={`w-4 h-4 ${isScanning ? "animate-spin text-teal-200" : ""}`} />
            <span>{isScanning ? "Prioritizing Crawl..." : "⚡ Run Priority Index Scan"}</span>
          </button>

          <button
            type="button"
            disabled={isScanning}
            onClick={onRegisterManually}
            className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40 w-full sm:w-auto shrink-0 select-none"
            id="empty-action-add-manually"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>Register Link Manually</span>
          </button>
        </div>

        {/* 3. Real-Time Telemetry Log Terminal */}
        {isScanning && (
          <div className="w-full max-w-2xl bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl p-4 mt-8 font-mono text-left text-[11px] space-y-2.5 shadow-2xl relative overflow-hidden animate-slide-up" id="crawler-simulator-screen">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-slate-400 mb-1">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold text-[9.5px] uppercase tracking-wider text-slate-400">Node crawler telemetry monitor</span>
              </div>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-teal-400 animate-pulse font-bold">{scanProgress}%</span>
            </div>

            {/* Log output rows */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto leading-relaxed font-mono" id="scrolling-logs">
              {scanLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-teal-500 shrink-0 select-none">&rsaquo;</span>
                  <p className="text-slate-200 font-medium">{log}</p>
                </div>
              ))}
            </div>

            {/* Progress bar graph */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3" id="log-progressbar">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(20,184,166,0.3)]" 
                style={{ width: `${scanProgress}%` }} 
              />
            </div>
          </div>
        )}

      </div>

      {/* 4. Guide Bento Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" id="empty-bento-guide">
        
        {/* Card A: Unindexed */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs" id="bento-box-domains">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <Globe className="w-4 h-4 text-[#0d9488]" />
            <h4 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">Unindexed Domains?</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Newly purchased websites or staging domains typically do not have public backlinks indices registered yet. Active outbound campaigns are required to prime public internet graphs.
          </p>
        </div>

        {/* Card B: Bypassing */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs" id="bento-box-bypass">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <Zap className="w-4 h-4 text-[#0d9488]" />
            <h4 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">Bypassing the Scheduler</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Registering domain authority profiles can be initiated instantly via manual inserts, CSV ledger imports, or triggering prioritized proxy scraper scan cycles from this view.
          </p>
        </div>

        {/* Card C: Verification */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs" id="bento-box-txt">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
            <FileText className="w-4 h-4 text-[#0d9488]" />
            <h4 className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">Verifying Link Equity</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Our index requires a 200 HTTP response. Ensure source articles are fully indexed in Google and robot.txt disallow structures do not obstruct modern spider crawlers.
          </p>
        </div>

      </div>

    </div>
  );
}
