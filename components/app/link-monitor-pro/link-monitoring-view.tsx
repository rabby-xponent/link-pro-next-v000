"use client";

import React, { useState, useMemo } from "react";
import { 
  Activity, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Cpu, 
  ServerCrash,
  Sparkles,
  Zap
} from "lucide-react";
import { MonitorItem } from "@/types/index";

export function LinkMonitoringView() {
  const [items, setItems] = useState<MonitorItem[]>([
    { id: "mon-1", url: "https://wikipedia.org/wiki/SEO", anchorText: "search optimization wiki", status: "Up", crawlTimeMs: 245, lastChecked: "12 mins ago", uptimeHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { id: "mon-2", url: "https://github.com/trending", anchorText: "open source directory", status: "Up", crawlTimeMs: 182, lastChecked: "4 mins ago", uptimeHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { id: "mon-3", url: "https://techcrunch.com/funding", anchorText: "partner matrix index", status: "No-follow Alert", crawlTimeMs: 512, lastChecked: "1 hour ago", uptimeHistory: [1, 1, 0, 1, 1, 1, 1, 1, 1, 1] },
    { id: "mon-4", url: "https://medium.com/ai-trends", anchorText: "generative machine research", status: "Up", crawlTimeMs: 310, lastChecked: "15 mins ago", uptimeHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { id: "mon-5", url: "https://producthunt.com/launches", anchorText: "product marketing guide", status: "Down", crawlTimeMs: 0, lastChecked: "Just now", uptimeHistory: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { id: "mon-6", url: "https://dev.to/seo-hacks", anchorText: "web vitals metrics checklist", status: "Crawl Error", crawlTimeMs: 1205, lastChecked: "2 mins ago", uptimeHistory: [1, 1, 1, 1, 1, 1, 1, 0, 1, 0] }
  ]);

  const [isCrawlSimulating, setIsCrawlSimulating] = useState(false);
  const [crawlStepMsg, setCrawlStepMsg] = useState("");

  // Start backlink audit scanning
  const startCrawlScan = () => {
    if (isCrawlSimulating) return;
    setIsCrawlSimulating(true);
    setCrawlStepMsg("Initializing HTTP sandboxes...");

    setTimeout(() => {
      setCrawlStepMsg("Requesting raw HTML dumps...");
      
      setTimeout(() => {
        setCrawlStepMsg("Validating anchor presence and href links...");
        
        setTimeout(() => {
          // Mutate crawl times randomly to show life and status changes
          setItems(prev => prev.map(item => {
            const nextTime = item.status === "Down" ? 0 : Math.round(item.crawlTimeMs * (0.85 + Math.random() * 0.3));
            let nextStatus = item.status;
            if (item.id === "mon-5" && Math.random() > 0.5) {
              nextStatus = "Up"; // Sim recovery!
            }
            // push random status into history
            const nextHistory = [...item.uptimeHistory.slice(1), nextStatus === "Up" ? 1 : 0];
            return {
              ...item,
              crawlTimeMs: nextTime,
              status: nextStatus === "Up" && nextTime > 800 ? "Crawl Error" : nextStatus,
              lastChecked: "Just now",
              uptimeHistory: nextHistory
            };
          }));
          setIsCrawlSimulating(false);
          setCrawlStepMsg("");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Aggregated monitor numbers
  const uptimePercentage = useMemo(() => {
    const upCount = items.filter(i => i.status === "Up").length;
    return Math.round((upCount / items.length) * 100);
  }, [items]);

  const avgLatency = useMemo(() => {
    const active = items.filter(i => i.crawlTimeMs > 0);
    if (!active.length) return 0;
    return Math.round(active.reduce((sum, item) => sum + item.crawlTimeMs, 0) / active.length);
  }, [items]);

  return (
    <div className="space-y-8" id="monitoring-root">
      
      {/* Visual Diagnostic Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6" id="monitoring-diagnostic-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6" id="monitoring-diagnostics-header">
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono">Live Crawl Diagnostics</span>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-5 h-5 text-[#006a61]" />
              <span>Backlink Uptime &amp; Anchor Crawler Log</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isCrawlSimulating ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#eff4ff] text-[#006a61] border border-slate-100 rounded-md text-xs font-semibold" id="crawler-sim-status">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{crawlStepMsg}</span>
              </div>
            ) : (
              <button
                onClick={startCrawlScan}
                className="bg-[#006a61] hover:bg-[#005049] text-white py-2 px-4 text-xs font-bold rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                id="trigger-crawl-btn"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Run Anchor Presence Validation</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic metrics bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 mt-6 pt-6" id="monitoring-top-metrics">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-md ${uptimePercentage > 80 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`} id="metric-system-health">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block">Core System Health</span>
              <span className="text-2xl font-black text-slate-800">{uptimePercentage}% Uptime</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block">Average Crawl Speed</span>
              <span className="text-2xl font-black text-slate-800">{avgLatency} ms</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-md">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block">Active Alert Monitors</span>
              <span className="text-2xl font-black text-slate-800">
                {items.filter(i => i.status !== "Up").length} issues
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="monitoring-grid-split">
        
        {/* Left 2 cols: Live Crawler Listings */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-2 space-y-4" id="monitor-listings-panel">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
            <span className="text-sm font-bold text-slate-800">Live Scanned URLs</span>
            <span className="text-xs font-mono text-slate-400">Updates every 10m internally</span>
          </div>

          <div className="space-y-4" id="monitoring-items-list">
            {items.map((item) => (
              <div 
                key={item.id}
                className="p-4 border border-slate-200 hover:border-[#006a61] rounded-lg transition-all hover:shadow-sm bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                id={`monitor-item-${item.id}`}
              >
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.status === "Up" && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                    {item.status === "Down" && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
                    {item.status === "No-follow Alert" && <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                    {item.status === "Crawl Error" && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                    
                    <span className="text-xs font-semibold uppercase text-slate-400 font-mono tracking-wider">
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 truncate mt-1">{item.url}</h4>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400 font-mono">
                    <span>Anchor Match: &quot;<strong className="text-slate-600 font-semibold">{item.anchorText}</strong>&quot;</span>
                    <span>Crawl duration: {item.crawlTimeMs}ms</span>
                    <span>Checked: {item.lastChecked}</span>
                  </div>
                </div>

                {/* Status signals sparkline using simple responsive SVGs */}
                <div className="flex flex-col items-end gap-1 px-1.5 py-0.5" id={`status-history-${item.id}`}>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block mb-1">
                    Crawl History
                  </span>
                  <div className="flex gap-1">
                    {item.uptimeHistory.map((pt, index) => (
                      <span 
                        key={index}
                        className={`w-2 h-6 rounded-sm ${pt === 1 ? "bg-emerald-400" : "bg-red-400"}`}
                        title={pt === 1 ? "Success crawl" : "Failure error"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 col: Performance History Spec */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit space-y-6" id="perf-trends-panel">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Response Latency Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active tracking of response latencies during Googlebot target matching.
            </p>
          </div>

          {/* Stacking beautiful SVG Area Chart representation */}
          <div className="border border-slate-100 rounded-lg p-3 bg-[#f8f9ff] relative" id="latency-svg-chart-container">
            <div className="flex justify-between items-center mb-2" id="chart-legend">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Latency curve (ms)</span>
              <span className="text-xs font-mono font-bold text-emerald-600 text-right">Avg: {avgLatency}ms</span>
            </div>

            {/* Custom Responsive SVG Curve */}
            <svg viewBox="0 0 300 130" className="w-full mt-2" id="latency-svg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006a61" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#006a61" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Back gridlines */}
              <line x1="0" y1="30" x2="300" y2="30" stroke="#bcc9c6" strokeDasharray="3,3" strokeWidth="0.5" />
              <line x1="0" y1="70" x2="300" y2="70" stroke="#bcc9c6" strokeDasharray="3,3" strokeWidth="0.5" />
              <line x1="0" y1="110" x2="300" y2="110" stroke="#bcc9c6" strokeDasharray="3,3" strokeWidth="0.5" />

              {/* Path layout */}
              <path 
                d="M 10 110 Q 50 40 100 80 T 180 50 T 250 90 T 290 35 L 290 120 L 10 120 Z" 
                fill="url(#chartGrad)" 
              />
              <path 
                d="M 10 110 Q 50 40 100 80 T 180 50 T 250 90 T 290 35" 
                fill="none" 
                stroke="#006a61" 
                strokeWidth="2.5" 
              />

              {/* Highlight interactive circles */}
              <circle cx="100" cy="80" r="4.5" fill="#006a61" stroke="white" strokeWidth="1.5" />
              <circle cx="180" cy="50" r="4.5" fill="#0b1c30" stroke="white" strokeWidth="1.5" />
              <circle cx="290" cy="35" r="4.5" fill="#006a61" stroke="white" strokeWidth="1.5" />

              {/* Data tooltips inside SVG */}
              <text x="180" y="32" fontSize="9" fontFamily="monospace" fill="#0b1c30" fontWeight="bold" textAnchor="middle">
                Peak: 512ms
              </text>
            </svg>

            {/* Bottom time tickers */}
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-2.5 px-1" id="chart-timeline">
              <span>08:00 AM</span>
              <span>10:00 AM</span>
              <span>12:00 PM</span>
              <span>02:00 PM</span>
            </div>
          </div>

          {/* Diagnostic tips warning section */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-2.5" id="monitoring-specs-log">
            <h4 className="text-xs font-semibold text-slate-700 font-mono">Performance Notes</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 list-disc list-inside">
              <li>Down triggers issue visual alerts to support immediately.</li>
              <li>Response latencies above 800ms flag a <span className="font-semibold text-[#006a61]">Crawl Error</span> warning category.</li>
              <li>No-follow attributes trigger visual highlight state indicators.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
