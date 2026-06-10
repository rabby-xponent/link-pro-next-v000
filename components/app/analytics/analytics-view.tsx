"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  HelpCircle, 
  Award, 
  FileCheck2,
  ChevronRight,
  Sparkles,
  Search,
  Globe,
  PieChart
} from "lucide-react";

export function AnalyticsView() {
  const [selectedInterval, setSelectedInterval] = useState<"30" | "90" | "all">("90");

  return (
    <div className="space-y-8" id="analytics-root">
      
      {/* Date Interval Selector Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4" id="analytics-filter-header">
        <div>
          <h3 className="text-sm font-bold text-slate-800">SEO Domain Performance Reports</h3>
          <p className="text-xs text-slate-400 mt-0.5">Statistical aggregate of active campaigns tracked globally.</p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md p-1" id="interval-toggle-bar">
          <button
            onClick={() => setSelectedInterval("30")}
            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all ${selectedInterval === "30" ? "bg-[#006a61] text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setSelectedInterval("90")}
            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all ${selectedInterval === "90" ? "bg-[#006a61] text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Last 90 Days
          </button>
          <button
            onClick={() => setSelectedInterval("all")}
            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all ${selectedInterval === "all" ? "bg-[#006a61] text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Grid containing primary Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="reports-grid-block">
        
        {/* Chart 1: Acquisition Trends */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4" id="acquisition-trends-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-[#006a61] w-5 h-5" />
              <span className="text-sm font-bold text-slate-800">Acquisition Rate Trend</span>
            </div>
            
            <div className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <span>+28% Growth</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-sans" id="acquisition-subdetails">
            This trend indexes cumulative weekly target links established since start of active tracking period.
          </div>

          {/* Area spline chart using custom beautiful responsive SVG */}
          <div className="border border-slate-100 p-4 rounded-xl bg-[#f8f9ff]" id="acq-chart-box">
            <svg viewBox="0 0 400 160" className="w-full h-auto" id="acq-svg-canvas">
              <defs>
                <linearGradient id="acqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006a61" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#006a61" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="10" y1="40" x2="390" y2="40" stroke="#bcc9c6" strokeDasharray="4,4" strokeWidth="0.5" />
              <line x1="10" y1="80" x2="390" y2="80" stroke="#bcc9c6" strokeDasharray="4,4" strokeWidth="0.5" />
              <line x1="10" y1="120" x2="390" y2="120" stroke="#bcc9c6" strokeDasharray="4,4" strokeWidth="0.5" />

              {/* Back area gradient fill */}
              <path 
                d="M 10 130 H 10 L 40 120 L 90 100 L 140 115 L 200 70 L 260 50 L 320 85 L 390 30 V 140 H 10 Z" 
                fill="url(#acqGrad)"
              />

              {/* Line path */}
              <path 
                d="M 10 130 L 40 120 L 90 100 L 140 115 L 200 70 L 260 50 L 320 85 L 390 30" 
                fill="none" 
                stroke="#006a61" 
                strokeWidth="3" 
                strokeLinecap="round"
              />

              {/* Interactive datapoints circle highlights */}
              <circle cx="200" cy="70" r="5" fill="#006a61" stroke="white" strokeWidth="1.5" />
              <circle cx="390" cy="30" r="5" fill="#0b1c30" stroke="white" strokeWidth="1.5" />

              {/* Values tags floating */}
              <text x="200" y="52" fontSize="9" fontFamily="monospace" fill="#006a61" fontWeight="bold" textAnchor="middle">
                84 Links
              </text>
              <text x="390" y="16" fontSize="9" fontFamily="monospace" fill="#0b1c30" fontWeight="bold" textAnchor="end">
                124 Links (Current)
              </text>
            </svg>

            {/* Bottom time markers */}
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-3 px-1" id="timeline-labels">
              <span>WK 14</span>
              <span>WK 16</span>
              <span>WK 18</span>
              <span>WK 20 (Crawl Spike)</span>
              <span>WK 22 (Current)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Google Core Indexation Share */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4" id="indexation-shares-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <PieChart className="text-[#006a61] w-5 h-5" />
              <span className="text-sm font-bold text-slate-800">Google Index Ratio Allocation</span>
            </div>
            
            <span className="text-xs font-mono bg-indigo-50 text-[#006a61] py-0.5 px-2.5 rounded font-bold">
              WCAG AA+ Compliant
            </span>
          </div>

          <div className="text-xs text-slate-400 font-sans" id="indexation-subdetails">
            Visual breakdown mapping the core indexing ratios discovered by crawl crawlers.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center" id="index-split-grid">
            {/* Elegant multi-slice horizontal segmented bar chart representation */}
            <div className="space-y-4" id="index-legend-block">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    <span>Indexed Links</span>
                  </span>
                  <span>72%</span>
                </div>
                {/* Custom layout progress line */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                    <span>Pending Crawl Queue</span>
                  </span>
                  <span>18%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                    <span>Deindexed Penalty</span>
                  </span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>

            {/* Custom SVG Circular donut display */}
            <div className="flex justify-center" id="donut-svg-panel">
              <svg viewBox="0 0 100 100" className="w-32 h-32" id="donut-canvas">
                {/* Indexed */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="15" strokeDasharray="172, 238" strokeDashoffset="0" />
                {/* Pending */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="15" strokeDasharray="43, 238" strokeDashoffset="-172" />
                {/* Deindexed */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="15" strokeDasharray="23, 238" strokeDashoffset="-215" />
                
                {/* Center text hole */}
                <circle cx="50" cy="50" r="28" fill="white" />
                <text x="50" y="47" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#0b1c30" textAnchor="middle">
                  Healthy
                </text>
                <text x="50" y="60" fontSize="8" fontFamily="monospace" fill="text-slate-400" textAnchor="middle" fontWeight="bold">
                  90%+ OK
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Tier Distribution lists conforming to 1px neutral standard */}
      <div className="bg-white border border-slate-200 rounded-xl p-6" id="authority-allocation-panel">
        <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Domain Rating Breakdown Categories</h4>
            <div className="text-xs text-slate-400 mt-1">SEO target assets grouped by authority rating tiers.</div>
          </div>
          <p className="text-xs text-[#006a61] font-mono font-bold bg-teal-50 px-2 py-1 rounded">
            Target benchmark: 50%+ Tier 1 (DR70+)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dr-tiers-grid-deck">
          <div className="p-4 border border-slate-200 rounded-lg bg-[#f8f9ff]" id="tier-1-list">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#006a61] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Tier 1 (DR70+)
              </span>
              <span className="text-xs font-bold text-slate-600">4 Entities</span>
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>wikipedia.org/wiki/SEO</span>
                <span className="font-bold text-slate-800">DR 92</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>techcrunch.com/fundings</span>
                <span className="font-bold text-slate-800">DR 89</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>github.com/trendings</span>
                <span className="font-bold text-slate-800">DR 87</span>
              </div>
              <div className="flex justify-between py-1">
                <span>medium.com/ai-trends</span>
                <span className="font-bold text-slate-800">DR 84</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg" id="tier-2-list">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Tier 2 (DR40-DR69)
              </span>
              <span className="text-xs font-bold text-slate-600">2 Entities</span>
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>producthunt.com/launches</span>
                <span className="font-bold text-slate-800">DR 78</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>dev.to/seo-hacks</span>
                <span className="font-bold text-slate-800">DR 75</span>
              </div>
              <div className="text-slate-400 py-3 text-center italic text-[11px]">
                Awaiting crawler updates
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg" id="tier-3-list">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                Tier 3 (&lt; DR40)
              </span>
              <span className="text-xs text-slate-500 italic">None added</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 font-sans" id="tier-3-empty">
              <Award className="w-8 h-8 text-slate-300 stroke-1 block mb-1" />
              <p className="text-xs font-semibold">Low authority ignored</p>
              <p className="text-[10px] text-slate-400 max-w-[160px] mx-auto mt-0.5">Campaign filters discard lowest authority assets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
